export interface User {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface CreateUserInput {
    username: string;
    email: string;
    password: string;
}

export interface UpdateUserInput {
    id: number;
    username?: string;
    email?: string;
    password?: string;
}

export interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}