import { TextractClient } from "@aws-sdk/client-textract";

// Initialize the Textract client
export const textractClient = new TextractClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});
