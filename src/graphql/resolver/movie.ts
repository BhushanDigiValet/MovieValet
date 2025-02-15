import mongoose from "mongoose";
import { restrictRole } from "../../Auth/authorization";
import { Movie } from "../../models";
import { UserRole } from "../../types/defaultValue";
import { GraphQLError } from "graphql";

const movieResolver = {
  Query: {
    async movies(_, args, context) {
      restrictRole(context, []);
      const allMovies = await Movie.find();
      return allMovies;
    },
    async movie(_, { id }:{ id:string}, context) {
    
      const movie= Movie.findById(id);
      if(!movie){
        throw new GraphQLError("Movie not found");
      }
      return movie;
    
    },
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
        throw new GraphQLError("Movie already exists");
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
