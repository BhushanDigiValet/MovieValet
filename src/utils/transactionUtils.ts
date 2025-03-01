import { GraphQLError } from 'graphql';
import { IUserCredential } from '../types/defaultValue';

import logger from './loggers';

export const credentialCheck = (userCredential: IUserCredential) => {
  if (
    userCredential.cardNumber !== 123456789 &&
    userCredential.pin !== 7777 &&
    userCredential.cvv !== 777
  ) {
    logger.warn('Invaled credential');
    throw new GraphQLError('Invaled credential');
  }
};
