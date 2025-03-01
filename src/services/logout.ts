import { restrictRole } from '../Auth/authorization';
import logger from '../utils/loggers';

export const logout = async (req, res, context) => {
  restrictRole(context, []);

  logger.info(`User ${req.user.email} is logging out`);

  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  return { message: `User ${req.user.email} is logging out` };
};
