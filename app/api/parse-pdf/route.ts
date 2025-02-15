import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parsePdf } from './pdf.config';

// Helper function to create consistent JSON responses
function createJsonResponse(data: any, status: number = 200) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// Helper function to create Supabase admin client
function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required environment variables for Supabase admin client');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function POST(request: NextRequest) {
  // Validate environment variables first
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required environment variables:', {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });
    return createJsonResponse({
      error: 'Server configuration error',
      details: 'Missing required environment variables'
    }, 500);
  }
  // Handle preflight request
  if (request.method === 'OPTIONS') {
    return createJsonResponse({ message: 'OK' }, 200);
  }
  try {
    console.log('Starting PDF parse request...');
    
    // Get the PDF path from the request
    let pdfPath: string;
    try {
      const body = await request.json();
      pdfPath = body.pdfPath;
    } catch (error) {
      console.error('Error parsing request body:', error);
      return createJsonResponse({
        error: 'Invalid request body',
        details: 'Request body must be valid JSON with a pdfPath property'
      }, 400);
    }
    
    if (!pdfPath) {
      console.error('No PDF path provided');
      return createJsonResponse({ 
        error: 'No PDF path provided',
        details: 'The request must include a PDF path'
      }, 400);
    }
    
    console.log('Downloading PDF from path:', pdfPath);
    
    // Create Supabase admin client and download the PDF
    const supabaseAdmin = createSupabaseAdmin();
    const { data: pdfData, error: downloadError } = await supabaseAdmin.storage
      .from('pdfs')
      .download(pdfPath);
    
    if (downloadError) {
      console.error('Error downloading PDF:', downloadError);
      return createJsonResponse({
        error: 'Failed to download PDF',
        details: downloadError.message
      }, 500);
    }
    
    if (!pdfData) {
      return createJsonResponse({
        error: 'No PDF data received',
        details: 'The file may be empty or not accessible'
      }, 404);
    }
    
    console.log('PDF downloaded successfully:', {
      size: pdfData.size,
      type: pdfData.type
    });

    // Convert Blob to Uint8Array
    console.log('Converting PDF to Uint8Array...');
    const arrayBuffer = await pdfData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    console.log('Uint8Array created, size:', uint8Array.length, 'bytes');
    
    console.log('Loading PDF with PDF.js...');
    
    try {
      // Parse the PDF using pdf-parse
      const result = await parsePdf(uint8Array);
      
      console.log('PDF parsed successfully');
      console.log('PDF loaded, pages:', result.numPages);
      
      // Split the text into pages based on form feed characters or double newlines
      const pageTexts = result.text.split(/\f|\n\n+/);
      const pages = pageTexts.map((content, index) => ({
        pageNumber: index + 1,
        content: content.trim() || '[No text content found]'
      }));
      
      console.log('Text content processed into pages');
      
      return createJsonResponse({
        pages,
        metadata: result.metadata,
        info: result.info,
        numPages: result.numPages,
        version: result.version
      });
    } catch (error) {
      console.error('Error parsing PDF:', error);
      return createJsonResponse({ 
        error: 'Failed to parse PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return createJsonResponse({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
}
