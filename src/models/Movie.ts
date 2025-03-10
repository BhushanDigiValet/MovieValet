import { Schema, model, Document, Types } from 'mongoose';
import { IStarCast } from '../types/defaultValue';

export interface IMovie extends Document {
  title: string;
  description: string;
  genre: Types.ObjectId;
  imdbRating: number;
  starCast: IStarCast[];
  language: string[];
  posterUrl: string;
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
    type: Schema.Types.ObjectId,
    ref: 'Genre',
    required: true,
  },
  imdbRating: {
    type: Number,
  },
  language: {
    type: [String],
    default: [],
  },
  posterUrl: {
    type: String,
    required: true,
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

export default model<IMovie>('Movie', MovieSchema);
