import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import Account from '../models/accountModel';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid password' });

    // Load account to get billing_plan
    const account = user.account_id ? await Account.findByPk(user.account_id) : null;

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        username: user.username, 
        role: user.role,
        account_id: user.account_id,
      }, 
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ 
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        plan: account?.billing_plan || 'TRIAL',
        account_id: user.account_id,
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Login failed' });
  }
};