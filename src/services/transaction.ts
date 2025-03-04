import { GraphQLError } from 'graphql';
import { Reservation, Transaction } from '../models';
import { IUserCredential, TransactionStatus, UserRole } from '../types/defaultValue';
import { restrictRole } from '../Auth/authorization';
import logger from '../utils/loggers';
import { credentialCheck } from '../utils/transactionUtils';

class TransactionService {
  static async getAllTransactions(context) {
    restrictRole(context, [UserRole.CUSTOMER, UserRole.THEATER_ADMIN]);

    try {
      return await Transaction.find();
    } catch (error) {
      logger.error(`Error in All Transactions Get; ${error.message}`);
      throw new GraphQLError(`Error in All Transactions Get; ${error.message}`);
    }
  }

  static async getTransaction(id: string, context) {
    restrictRole(context, [UserRole.CUSTOMER, UserRole.THEATER_ADMIN]);

    try {
      const transaction = await Transaction.findById(id);
      if (!transaction) {
        logger.warn(`No Such transaction by id:${id}`);
        throw new GraphQLError(`No Such transaction by id:${id}`);
      }
      return transaction;
    } catch (error) {
      logger.error(`Error in Getting Transactions id ${id} ; ${error.message}`);
      throw new GraphQLError(`Error in Getting Transactions id ${id} ; ${error.message}`);
    }
  }

  static async createTransaction(
    _parent: any, 
    args: {
      input: {
        amount: number;
        paymentMethod: string;
        status: TransactionStatus;
        userCredential: IUserCredential;
      };
    }, // Args object
    context: any, 
  ) {
    const { input } = args; 
    const { amount } = input;

    try {
      logger.info(`Input value: ${amount}`);

      credentialCheck(input.userCredential);

      const transaction = await Transaction.create(input);
      if (!transaction) {
        logger.warn('Failed to create transaction.');
        throw new GraphQLError('Failed to create transaction.');
      }

      logger.info(`Transaction ID: ${transaction.id}`);
      return transaction;
    } catch (error) {
      logger.error(`Error in Transaction Creation: ${error.message}`);
      throw new GraphQLError(`Error in Transaction Creation: ${error.message}`);
    }
  }
}

export default TransactionService;
