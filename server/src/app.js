import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
    })
  );
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'garage-management-api' });
  });

  app.use('/api', apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
