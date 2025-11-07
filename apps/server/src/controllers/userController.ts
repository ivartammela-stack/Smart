import { Request, Response } from 'express';
import { User } from '../models/userModel';

/**
 * GET /api/users
 * List all users (public - no password hash)
 */
export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role'],
      order: [['username', 'ASC']],
    });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list users',
    });
  }
};


