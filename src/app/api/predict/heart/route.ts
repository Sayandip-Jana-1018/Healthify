import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Remove oldpeak from the request body since we removed it from the form
    const requestBody = {
      age: Number(body.age),
      sex: Number(body.sex),
      cp: Number(body.cp),
      trestbps: Number(body.trestbps),
      chol: Number(body.chol),
      fbs: Number(body.fbs),
      restecg: Number(body.restecg),
      thalach: Number(body.thalach),
      exang: Number(body.exang),
      slope: Number(body.slope),
      ca: Number(body.ca),
      thal: Number(body.thal)
    };

    // Forward the request to FastAPI backend
    const response = await fetch('http://127.0.0.1:8000/predict/heart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Prediction failed');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Heart prediction error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to make heart disease prediction' },
      { status: 500 }
    );
  }
}
