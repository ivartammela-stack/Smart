import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    username: string;
    role: string;
    account_id?: number;
  };
  accountId?: number; // Effective account ID (for filtering)
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    
    // Set effective account ID
    // Super admin can override with x-account-id header
    if (req.user?.role === 'SUPER_ADMIN' && req.headers['x-account-id']) {
      req.accountId = Number(req.headers['x-account-id']);
    } else {
      req.accountId = req.user?.account_id;
    }
    
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

