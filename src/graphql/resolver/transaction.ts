import { GraphQLError } from "graphql";
import { restrictRole } from "../../Auth/authorization";
import { Reservation, Transaction } from "../../models";
import {
  IUserCredential,
  TransactionStatus,
  UserRole,
} from "../../types/defaultValue";
import logger from "../../utils/loggers";
import { credentialCheck } from "../../utils/transactionUtils";
import TransactionService from "../../services/transaction";

const transactionResolver = {
  Query: {
    getAllTransactions: TransactionService.getAllTransactions,
    getTransaction: TransactionService.getTransaction,
  },
  Mutation: {
    createTransaction: TransactionService.createTransaction,
  },
};
export default transactionResolver;
