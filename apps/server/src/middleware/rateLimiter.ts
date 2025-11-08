// Rate limiting middleware to prevent abuse
import rateLimit from 'express-rate-limit';

// Strict rate limiter for authentication endpoints (prevent brute-force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: {
    error: 'Too many login attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter (prevent DDoS)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs per IP
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin operations rate limiter (stricter)
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per windowMs
  message: {
    error: 'Too many admin requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

