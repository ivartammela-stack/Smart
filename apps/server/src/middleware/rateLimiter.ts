// Rate limiting middleware to prevent abuse
import rateLimit from 'express-rate-limit';

// Strict rate limiter for authentication endpoints (prevent brute-force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Increased from 5 to 10 for better UX
  message: {
    error: 'Too many login attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false, // Disable validation since we're behind nginx
  },
});

// General API rate limiter (prevent DDoS)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased from 100 to 1000 for normal usage
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false, // Disable validation since we're behind nginx
  },
});

// Admin operations rate limiter (stricter)
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased from 50 to 500 for admin operations
  message: {
    error: 'Too many admin requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false, // Disable validation since we're behind nginx
  },
});

