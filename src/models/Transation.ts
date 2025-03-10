import { Schema, model, Document } from 'mongoose';
import { TransactionStatus } from '../types/defaultValue';

export interface ITransaction extends Document {
  amount: number;
  paymentMethod: string;
  status: TransactionStatus;
  transactionTime: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(TransactionStatus),
    required: true,
  },
  transactionTime: {
    type: Date,
    default: Date.now,
  },
});

export default model<ITransaction>('Transaction', TransactionSchema);
