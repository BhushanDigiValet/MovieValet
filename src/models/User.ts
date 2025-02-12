import { Schema, model, Document, Types } from "mongoose";
import { UserRole } from "../types/defaultValue";

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  email: string;
  role: UserRole;
  isDeleted: boolean;
  createdBy?: Types.ObjectId; 
  createdAt: Date;
  updatedBy?: Types.ObjectId; 
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


export default model<IUser>("User", UserSchema);
