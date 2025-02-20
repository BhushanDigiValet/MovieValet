const transactionTypeDefs = `#graphql
enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

type Transaction {
  id: ID!
  amount: Float!
  paymentMethod: String!
  status: TransactionStatus!
  transactionTime: String!
}
input Credential{
  cardNumber:Int!
  pin: Int!
  cvv: Int!
}

input CreateTransactionInput {
  amount: Float!
  paymentMethod: String!
  status: TransactionStatus!
  userCredential: Credential!
}

type Query {
  getTransaction(id: ID!): Transaction
  getAllTransactions: [Transaction!]!
}

type Mutation {
  createTransaction(id:ID! ,input: CreateTransactionInput!): Transaction!
}`;

export default transactionTypeDefs;
