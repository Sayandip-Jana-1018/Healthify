import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Forward the request to FastAPI backend
    const response = await fetch('http://127.0.0.1:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptoms: body.symptoms
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('FastAPI Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData: JSON.stringify(errorData, null, 2)
      });
      
      let errorMessage;
      try {
        errorMessage = typeof errorData === 'object' 
          ? (errorData.detail || JSON.stringify(errorData))
          : String(errorData);
      } catch (e) {
        errorMessage = 'Failed to parse error response';
        console.error('Error parsing errorData:', e);
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Disease prediction error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to make disease prediction' },
      { status: 500 }
    );
  }
}
