// userService.ts
import User from '../models/userModel';

// Create a new user
export const createUser = async (userData: any): Promise<User> => {
    const user = await User.create(userData);
    return user;
};

// Get a user by ID
export const getUserById = async (id: number): Promise<User | null> => {
    const user = await User.findByPk(id);
    return user;
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
    const users = await User.findAll();
    return users;
};

// Update a user
export const updateUser = async (id: number, userData: any): Promise<User | null> => {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update(userData);
    return user;
};

// Delete a user
export const deleteUser = async (id: number): Promise<boolean> => {
    const user = await User.findByPk(id);
    if (!user) return false;
    await user.destroy();
    return true;
};