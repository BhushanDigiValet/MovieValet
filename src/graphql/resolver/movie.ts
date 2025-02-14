import mongoose from "mongoose";
import { restrictRole } from "../../Auth/authorization";
import { Movie } from "../../models";
import { UserRole } from "../../types/defaultValue";

const movieResolver = {
  Query: {
    async movies() {
      return await Movie.find();
    },
    async movie(_, { id }) {},
  },
  Mutation: {
    async createMovie(
      _,
      {
        input,
      }: {
        input: {
          title: string;
          description: string;
          genre: string;
          imdbRating: number;
          language: string[];
          posterUrl: string;
          starCast: { name: string; image: string }[];
          durationMinutes: number;
          releaseDate: string;
        };
      },
      context
    ) {
      restrictRole(context, [UserRole.CUSTOMER, UserRole.THEATER_ADMIN]);
      const {
        title,
        description,
        genre,
        imdbRating,
        language,
        posterUrl,
        starCast,
        durationMinutes,
        releaseDate,
      } = input;

      const existingMovie = await Movie.findOne({ title });
      if (existingMovie) {
        throw new Error("Movie already exists");
      }

      const createdBy = context.user
        ? new mongoose.Types.ObjectId(context.user.id)
        : null;
      const newMovie = new Movie({
        title,
        description,
        genre,
        imdbRating,
        language,
        posterUrl,
        starCast,
        durationMinutes,
        releaseDate,
        createdBy,
        updatedBy: createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return await newMovie.save();
    },
  },
};

export default movieResolver;
