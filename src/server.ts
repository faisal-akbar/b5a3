import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

// Ensure mongoose connects only once (for serverless environments)
let isConnected = false;
async function connectDB() {
  if (!isConnected) {
    await mongoose.connect(config.database_url as string);
    isConnected = true;
  }
}

export default async function handler(req: any, res: any) {
  await connectDB();
  return app(req, res);
}
