import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Route mounts
import authRoutes from './routes/auth';
app.use('/api/auth', authRoutes);

app.use('/api/listings', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not Implemented', message: 'Listings routes coming soon' });
});

app.use('/api/rentals', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not Implemented', message: 'Rentals routes coming soon' });
});

app.use('/api/payments', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not Implemented', message: 'Payments routes coming soon' });
});

app.use('/api/messages', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not Implemented', message: 'Messages routes coming soon' });
});

app.use('/api/complaints', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not Implemented', message: 'Complaints routes coming soon' });
});

app.use('/api/admin', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not Implemented', message: 'Admin routes coming soon' });
});

app.use('/api/chatbot', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not Implemented', message: 'Chatbot routes coming soon' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', message: 'Route not found' });
});

// Global error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  const statusCode = (err as any).statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;
