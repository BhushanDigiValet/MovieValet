import { Schema, model, Document, Types } from "mongoose";
import { Genre, IStarCast } from "../types/defaultValue";

export interface IMovie extends Document {
  title: string;
  description: string;
  genre: Genre;
  imdbRating: number;
  starCast: IStarCast[];
  durationMinutes: number;
  releaseDate: Date;
  isDeleted: boolean;
  createdBy?: Types.ObjectId; 
  updatedBy?: Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const StarCastSchema = new Schema<IStarCast>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});


const MovieSchema = new Schema<IMovie>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  genre: {
    type: String,
    enum: Object.values(Genre),
    required: true,
  },
  imdbRating: {
    type: Number,
  },
  starCast: {
    type: [StarCastSchema],
    default: [],
  },
  durationMinutes: {
    type: Number,
  },
  releaseDate: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
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
});

export default model<IMovie>("Movie", MovieSchema);
