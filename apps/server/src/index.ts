import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index';
import { testConnection } from './config/database';
import logger from './utils/logger';
import { apiLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security: Disable Express version disclosure
app.disable('x-powered-by');

// Middleware
// CORS: Restrict to specific origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost']
    : '*',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health-check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'SmartFollow server is running 🚀' });
});

// Apply rate limiting to all API routes (DDoS protection)
app.use('/api', apiLimiter);

// Routes
app.use('/api', apiRouter);

// Start server with database connection test
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      logger.error('Failed to connect to database. Server will not start.');
      process.exit(1);
    }

    // Start Express server
    app.listen(PORT, () => {
      logger.success(`Server is running on http://localhost:${PORT}`);
      logger.info(`Database: Connected to smartfollow_db`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log(`📊 Database: Connected to smartfollow_db`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();