/**
 * Settings Routes
 * 
 * Endpoints for company settings (users management, etc.)
 */

import { Router } from 'express';
import { AuthRequest, authenticateJWT } from '../middleware/authMiddleware';
import { requireCompanyAdmin } from '../middleware/requireAdmin';
import { User } from '../models/userModel';
import bcrypt from 'bcrypt';

const router = Router();

// Apply auth middleware
router.use(authenticateJWT);
router.use(requireCompanyAdmin); // Only company/super admins

/**
 * GET /api/settings/users
 * Get all users in current account
 */
router.get('/users', async (req: AuthRequest, res) => {
  try {
    const accountId = req.user?.account_id;

    // Super admin without account_id specified
    if (!accountId && req.user?.role === 'SUPER_ADMIN') {
      return res.json({
        success: true,
        data: [],
        message: 'Super admin: Select an account to view users',
      });
    }

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: 'Account ID required',
      });
    }

    const users = await User.findAll({
      where: { account_id: accountId },
      attributes: ['id', 'username', 'email', 'role', 'created_at', 'updated_at'],
      order: [['created_at', 'ASC']],
    });

    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
});

/**
 * POST /api/settings/users
 * Create new user in current account
 */
router.post('/users', async (req: AuthRequest, res) => {
  try {
    const accountId = req.user?.account_id;

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: 'Account ID required',
      });
    }

    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required',
      });
    }

    // Validate role
    const validRoles = ['USER', 'COMPANY_ADMIN'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Allowed: USER, COMPANY_ADMIN',
      });
    }

    // Check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'USER',
      account_id: accountId,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        plan: user.plan,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
    });
  }
});

/**
 * PATCH /api/settings/users/:id
 * Update user role or status
 */
router.patch('/users/:id', async (req: AuthRequest, res) => {
  try {
    const accountId = req.user?.account_id;
    const { id } = req.params;
    const { role } = req.body;

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: 'Account ID required',
      });
    }

    // Find user in same account
    const user = await User.findOne({
      where: { id, account_id: accountId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Validate role if provided
    if (role) {
      const validRoles = ['USER', 'COMPANY_ADMIN'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role',
        });
      }
      user.role = role;
    }

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
    });
  }
});

/**
 * DELETE /api/settings/users/:id
 * Delete user from account
 */
router.delete('/users/:id', async (req: AuthRequest, res) => {
  try {
    const accountId = req.user?.account_id;
    const { id } = req.params;

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: 'Account ID required',
      });
    }

    // Prevent deleting yourself
    if (req.user?.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    // Find user in same account
    const user = await User.findOne({
      where: { id, account_id: accountId },
    });

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
});

export default router;

