import { Schema, model, Document, Types } from "mongoose";

export interface IShow extends Document {
  movieId: Types.ObjectId;
  theaterId: Types.ObjectId;
  showTime: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAT: Date;
  updatedAt: Date;
  isDeleted: boolean;
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
  showTime: {
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
  createdAT: {
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
});

export default model<IShow>("Show", ShowSchema);
