import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

interface PredictionResult {
  prediction: boolean;
  probability: number;
  risk_level: string;
}

export async function POST(req: Request): Promise<NextResponse<PredictionResult | { error: string }>> {
  try {
    const data = await req.json();
    
    // Convert the request data to the format expected by the model
    const inputFeatures = [
      data.pregnancies,
      data.glucose,
      data.bloodPressure,
      data.skinThickness,
      data.insulin,
      data.bmi,
      data.dpf,
      data.age
    ];

    // Path to your Python script
    const pythonScriptPath = path.join(process.cwd(), 'code', 'diabetes_predictor.py');

    return new Promise<NextResponse<PredictionResult | { error: string }>>((resolve) => {
      const pythonProcess = spawn('python', [
        pythonScriptPath,
        ...inputFeatures.map(String)
      ]);

      let result = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Python script error:', error);
          resolve(NextResponse.json(
            { error: 'Prediction failed' },
            { status: 500 }
          ));
          return;
        }

        try {
          const prediction = JSON.parse(result);
          resolve(NextResponse.json({
            prediction: prediction.prediction === 1,
            probability: prediction.probability,
            risk_level: prediction.probability >= 0.7 ? 'High Risk' : 
                       prediction.probability >= 0.4 ? 'Moderate Risk' : 'Low Risk'
          }));
        } catch (e) {
          console.error('Error parsing prediction result:', e);
          resolve(NextResponse.json(
            { error: 'Invalid prediction result' },
            { status: 500 }
          ));
        }
      });
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
