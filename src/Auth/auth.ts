import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import dotenv from 'dotenv';
import logger from '../utils/loggers';
dotenv.config();

interface UserPayload {
  id: string;
  username: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const validateCredentials = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new Error('Invalid credentials');

  return user;
};

export const generateToken = (user): string => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '10h' },
  );
};

export const getUserFromToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

    return { id: decoded.id, username: decoded.username, role: decoded.role };
  } catch (error) {
    logger.error(`Error in token decoding: ${error.message}`);

    return null;
  }
};
