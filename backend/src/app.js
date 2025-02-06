import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Connect to MongoDB
await connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('joinEvent', (eventId) => {
    socket.join(`event:${eventId}`);
  });

  socket.on('leaveEvent', (eventId) => {
    socket.leave(`event:${eventId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Add socket to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});