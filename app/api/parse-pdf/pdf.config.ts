import pdf from 'pdf-parse';

// Configure PDF parsing for Node.js environment
export const parsePdf = async (data: Buffer | Uint8Array) => {
  try {
    const result = await pdf(data);
    return {
      text: result.text,
      numPages: result.numpages,
      info: result.info,
      metadata: result.metadata,
      version: result.version
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw error;
  }
};
