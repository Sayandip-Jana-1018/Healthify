import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    // Get the URL from the request and extract the filename from the URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const filename = pathParts[pathParts.length - 1];
    
    // Build the path to the notebook file
    const notebookPath = path.join(process.cwd(), 'Notebook', filename);
    
    // Check if the file exists
    if (!fs.existsSync(notebookPath)) {
      return new NextResponse(
        JSON.stringify({ error: `Notebook file ${filename} not found` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Read the notebook file
    const notebookContent = fs.readFileSync(notebookPath, 'utf-8');
    
    // Parse the notebook content to ensure it's valid JSON
    const notebookData = JSON.parse(notebookContent);
    
    // Return the notebook data
    return NextResponse.json(notebookData);
  } catch (error) {
    console.error('Error serving notebook:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to serve notebook file' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
