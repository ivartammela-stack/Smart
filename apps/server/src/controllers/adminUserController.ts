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
 * DELETE /admin/users/:id
 * Delete a user (admin only)
 */
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user?.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
    });
  }
};

/**
 * PUT /admin/users/:id/reset-password
 * Reset user password (admin only)
 * Generates new temporary password
 */
export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate new temporary password
    const tempPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await user.update({ password: hashedPassword });

    res.json({
      success: true,
      message: 'Password reset successfully',
      temporaryPassword: tempPassword, // ⚠️ Show only once!
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
    });
  }
};

/**
 * Generate a cryptographically secure random temporary password
 */
function generateTemporaryPassword(): string {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto');
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const length = 16;
  let password = '';
  
  // Use crypto.randomBytes for cryptographically secure random
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(randomBytes[i] % charset.length);
  }
  
  return password;
}


