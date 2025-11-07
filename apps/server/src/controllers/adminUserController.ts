import { Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/userModel';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * GET /admin/users
 * List all users (admin only)
 */
export const listUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']],
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

/**
 * POST /admin/users
 * Create a new user (admin only)
 * Returns temporary password that must be shown to admin only once
 */
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, username, role } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email and username are required',
      });
    }

    // Validate role
    const validRoles = ['user', 'admin'];
    const userRole = role && validRoles.includes(role) ? role : 'user';

    // Generate temporary password (12 characters)
    const tempPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      role: userRole,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at,
      },
      temporaryPassword: tempPassword, // ⚠️ Show only once!
    });
  } catch (error: any) {
    console.error('Error creating user:', error);

    // Handle unique constraint violations
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create user',
    });
  }
};

/**
 * Generate a random temporary password
 */
function generateTemporaryPassword(): string {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}


