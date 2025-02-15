declare module 'pdf-parse' {
  interface PDFInfo {
    version: string;
    numpages: number;
    text: string;
    info: {
      [key: string]: any;
    };
    metadata: {
      [key: string]: any;
    };
  }

  function pdf(dataBuffer: Buffer | Uint8Array): Promise<PDFInfo>;
  export = pdf;
}
