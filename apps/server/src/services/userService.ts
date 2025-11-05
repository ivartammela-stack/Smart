// userService.ts
import { User } from '../models/userModel';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Create a new user
export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
    const { name, email, password } = userData;
    const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, password]
    );
    return result.rows[0];
};

// Get a user by ID
export const getUserById = async (id: number): Promise<User | null> => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows.length ? result.rows[0] : null;
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
};

// Update a user
export const updateUser = async (id: number, userData: Partial<User>): Promise<User | null> => {
    const { name, email, password } = userData;
    const result = await pool.query(
        'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password) WHERE id = $4 RETURNING *',
        [name, email, password, id]
    );
    return result.rows.length ? result.rows[0] : null;
};

// Delete a user
export const deleteUser = async (id: number): Promise<boolean> => {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
};