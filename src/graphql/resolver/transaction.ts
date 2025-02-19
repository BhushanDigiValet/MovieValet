import { GraphQLError } from "graphql";
import { restrictRole } from "../../Auth/authorization";
import { Reservation, Transaction } from "../../models";
import { TransactionStatus, UserRole } from "../../types/defaultValue";
import logger from "../../utils/loggers";
import { Query } from "mongoose";

const transactionResolver = {
  Query: {
    getAllTransactions: async (_, args, context) => {
      restrictRole(context, [UserRole.CUSTOMER, UserRole.THEATER_ADMIN]);

      try {
        return await Transaction.find();
      } catch (error) {
        logger.error(`Error in All Transactions Get; ${error.message}`);
        throw new GraphQLError(
          `Error in All Transactions Get; ${error.message}`
        );
      }
    },
    getTransaction: async (_, { id }: { id: string }, context) => {
      restrictRole(context, [UserRole.CUSTOMER, UserRole.THEATER_ADMIN]);

      try {
        const transaction = await Transaction.findById(id);
        if (!transaction) {
          logger.warn(`No Such transaction by id:${id}`);
          throw new GraphQLError(`No Such transaction by id:${id}`);
        }
        return transaction;
      } catch (error) {
        logger.error(
          `Error in Getting Transactions id ${id} ; ${error.message}`
        );
        throw new GraphQLError(
          `Error in Getting Transactions id ${id} ; ${error.message}`
        );
      }
    },
  },
  Mutation: {
    createTransaction: async (
      _,
      {
        id,
        input,
      }: {
        id: string;
        input: {
          amount: number;
          paymentMethod: string;
          status: TransactionStatus;
        };
      },
      context
    ) => {
      restrictRole(context, [UserRole.THEATER_ADMIN]);

      try {
        const reservation = await Reservation.findById(id);
        if (!reservation) {
          logger.warn(
            `${context.user.id} please provide a valid reservation ID`
          );
          throw new GraphQLError(
            `${context.user.id} please provide a valid reservation ID`
          );
        }
        const transaction = await Transaction.create(input);

        reservation.transactionId = transaction.id;
        await reservation.save();
        logger.info(
          `Transaction ID: ${transaction.id} added to Reservation ID: ${reservation.id}`
        );

        return transaction;
      } catch (error) {
        logger.error(`Error in Transaction Creation: ${error.message}`);
        throw new GraphQLError(
          `Error in Transaction Creation: ${error.message}`
        );
      }
    },
  },
};
export default transactionResolver;
