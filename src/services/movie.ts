import { restrictRole } from '../Auth/authorization';
import { Movie } from '../models';
import { UserRole } from '../types/defaultValue';
import { GraphQLError } from 'graphql';
import logger from '../utils/loggers';
import { MovieInput, UpdateMovieInput } from '../types/movie.type';
import { Genre } from '../models/Genre';

export class MovieService {
  static async movies(_, { input = {} }: { input?: Partial<MovieInput> }, context) {
    restrictRole(context, []);
    const { title, genre, imdbRating } = input;
    const filter: Record<string, any> = { isDeleted: false };

    if (title) filter.title = title;
    if (genre) filter.genre = genre;
    if (imdbRating) filter.imdbRating = { $gte: imdbRating };

    try {
      const allMovies = await Movie.find(
        filter,
        'title description genre imdbRating language posterUrl starCast durationMinutes releaseDate',
      ).populate(['genre']);
      logger.info(`Fetched ${allMovies.length} movies`);
      return allMovies;
    } catch (error) {
      logger.error(`Error fetching movies: ${error.message}`);
      throw new GraphQLError(`Failed to fetch movies : ${error.message}`);
    }
  }

  static async movie(_, { id }: { id: string }) {
    try {
      const movie = await Movie.findById(id).lean();
      if (!movie) {
        logger.warn(`Movie with ID ${id} not found`);
        throw new GraphQLError('Movie not found');
      }
      logger.info(`Fetched movie with ID ${id}`);
      return movie;
    } catch (error) {
      logger.error(`Error fetching movie ${id}: ${error.message}`);
      throw new GraphQLError('Failed to fetch movie');
    }
  }

  static async createMovie(_, { input }: { input: MovieInput }, context) {
    restrictRole(context, [UserRole.CUSTOMER, UserRole.THEATER_ADMIN]);

    try {
      const movieExists = await Movie.exists({
        title: input.title,
        isDeleted: false,
      });
      if (movieExists) {
        logger.warn(`Attempt to create duplicate movie: ${input.title}`);
        throw new GraphQLError('Movie already exists');
      }

      context.user?.id || null;
      const genreDoc = await Genre.findOne({ name: input.genre });
      if (!genreDoc) {
        throw new GraphQLError('Genre not found');
      }

      input.genre = genreDoc._id.toString();
      const createdBy = context.user?.id;
      const newMovie = new Movie({
        ...input,
        createdBy,
        updatedBy: createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const savedMovie = await newMovie.save();
      await savedMovie.populate(['createdBy', 'updatedBy']);

      logger.info(`Movie created: ${input.title}`, { movieId: savedMovie._id });
      return savedMovie;
    } catch (error) {
      logger.error(`Error creating movie: ${error.message}`);
      throw new GraphQLError(`Failed to create movie ${error.message}`);
    }
  }

  static async deleteMovie(_, { id }: { id: string }, context) {
    restrictRole(context, [UserRole.CUSTOMER, UserRole.THEATER_ADMIN]);

    try {
      const movieExists = await Movie.exists({ _id: id });
      if (!movieExists) {
        logger.warn(`Attempt to delete non-existent movie with ID ${id}`);
        throw new GraphQLError('Movie not found');
      }
      const updatedMovie = await Movie.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
          updatedBy: context.user.id,
          updatedAt: new Date(),
        },
        { new: true },
      ).populate(['createdBy', 'updatedBy']);

      logger.info(`Movie deleted: ${id}`);
      return updatedMovie;
    } catch (error) {
      logger.error(`Error deleting movie ${id}: ${error.message}`);
      throw new GraphQLError('Failed to delete movie');
    }
  }

  static async updateMovie(
    _,
    { id, input }: { id: string; input: Partial<UpdateMovieInput> },
    context,
  ) {
    restrictRole(context, [UserRole.CUSTOMER, UserRole.THEATER_ADMIN]);

    try {
      const movieExists = await Movie.exists({ _id: id });
      if (!movieExists) {
        logger.warn(`Attempt to update non-existent movie with ID ${id}`);
        throw new GraphQLError('Movie not found');
      }

      const updatedMovie = await Movie.findByIdAndUpdate(
        id,
        {
          ...input,
          updatedBy: context.user.id,
          updatedAt: new Date(),
        },
        {
          new: true,
          runValidators: true,
        },
      ).populate(['createdBy', 'updatedBy']);

      logger.info(`Movie updated: ${id}`);
      return updatedMovie;
    } catch (error) {
      logger.error(`Error updating movie ${id}: ${error.message}`);
      throw new GraphQLError('Failed to update movie');
    }
  }
}

export default MovieService;
