import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import fundraiserRoutes from './routes/fundraiserRoutes.js';
import collaborationRoutes from './routes/collaborationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'GrowMe API is running',
    version: '1.0.0',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/fundraisers', fundraiserRoutes);
app.use('/api/collaborations', collaborationRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});