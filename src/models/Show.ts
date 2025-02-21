import { Schema, model, Document, Types } from "mongoose";

export interface IShow extends Document {
  movieId: Types.ObjectId;
  theaterId: Types.ObjectId;
  showStartTime: Date;
  showEndTime: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  amount: number;
}

const ShowSchema = new Schema<IShow>({
  movieId: {
    type: Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  theaterId: {
    type: Schema.Types.ObjectId,
    ref: "Theater",
    required: true,
  },
  showStartTime: {
    type: Date,
    required: true,
  },
  showEndTime: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  amount: {
    type: Number,
    required: true,
  },
});

export default model<IShow>("Show", ShowSchema);
