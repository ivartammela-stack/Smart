import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

/**
 * Middleware to require company admin or super admin role
 * Must be used AFTER authenticateJWT
 */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'COMPANY_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Admin rights required',
    });
  }

  next();
};

/**
 * Middleware to require SUPER_ADMIN role only
 */
export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Super admin rights required',
    });
  }

  next();
};

/**
 * Middleware to require COMPANY_ADMIN role (but not super admin)
 */
export const requireCompanyAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'COMPANY_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Company admin rights required',
    });
  }

  next();
};


