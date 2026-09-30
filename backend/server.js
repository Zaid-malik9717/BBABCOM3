import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './src/config/index.js';
import { initDb } from './src/data/db.js';
import apiRoutes from './src/routes/index.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';

const app = express();

// Initialize database
initDb();

// Middlewares
app.use(cors({
  origin: '*', // Allow development proxy and direct requests
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Root Route
app.get('/', (req, res) => {
  res.json({
    name: 'Scholara Student Productivity Hub Backend API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      tasks: '/api/tasks',
      assignments: '/api/assignments',
      routines: '/api/routines',
      timetable: '/api/timetable',
      goals: '/api/goals',
      dashboard: '/api/dashboard',
    },
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
const server = app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`🎓 Scholara API Server running on port ${config.port}`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🚀 Health check: http://localhost:${config.port}/api/health`);
  console.log(`====================================================`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;
