import bcrypt from 'bcrypt';
import { User } from '../models';
import { generateToken } from '../Auth/auth';
import logger from '../utils/loggers';

export const login = async (_: any, { input }: any, context) => {
  const { email, password } = input;

  logger.info(`Login attempt for email: ${email}`);

  const user = await User.findOne({ email });
  if (!user) {
    logger.warn(`Login failed: Invalid credentials for email ${email}`);
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    logger.warn(`Login failed: Incorrect password for email ${email}`);
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user);

  context.res.cookie('token', token, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  logger.info(`User ${email} logged in successfully`);

  return { token, role: user.role };
};
