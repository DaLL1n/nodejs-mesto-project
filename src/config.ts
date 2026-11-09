import dotenv from 'dotenv';

dotenv.config();

const { NODE_ENV, JWT_SECRET } = process.env;

export const SECRET_KEY: string = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : (JWT_SECRET || 'dev-secret-key');

export const AUTH_COOKIE_NAME = 'auth-token';
