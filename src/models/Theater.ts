import { Schema, model, Document, Types } from 'mongoose';
import { ILocation } from '../types/defaultValue';

export interface ITheater extends Document {
  name: string;
  location: ILocation;
  adminId: Types.ObjectId; // Use Types.ObjectId
  isDeleted: boolean;
  createdBy?: Types.ObjectId; // Use Types.ObjectId
  updatedBy?: Types.ObjectId; // Use Types.ObjectId
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>({
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
});

const TheaterSchema = new Schema<ITheater>({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: LocationSchema,
    required: true,
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ITheater>('Theater', TheaterSchema);
