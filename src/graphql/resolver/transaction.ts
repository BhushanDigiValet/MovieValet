import TransactionService from '../../services/transaction';

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
