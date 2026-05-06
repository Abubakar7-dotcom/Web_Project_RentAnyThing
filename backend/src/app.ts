import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Request logging middleware
app.use(morgan('dev'));

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
import listingRoutes from './routes/listings';
import rentalRoutes from './routes/rentals';
import paymentRoutes from './routes/payments';
import reviewRoutes from './routes/reviews';
import complaintRoutes from './routes/complaints';

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/listings', reviewRoutes); // Reviews and Q&A are under /api/listings/:id/reviews and /api/listings/:id/qa
app.use('/api/complaints', complaintRoutes);

app.use('/api/messages', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not Implemented', message: 'Messages routes coming soon' });
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
