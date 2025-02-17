import { GraphQLError } from "graphql";
import { Movie, Show, Theater } from "../models";
import { UserRole } from "../types/defaultValue";
import { restrictRole } from "../Auth/authorization";
import { ShowInput } from "../types/show.type";
import logger from "../utils/loggers";

export class ShowResolver {
  static shows = async (parent, args, context) => {
    restrictRole(context, []);

    try {
      let filter: Record<string, any> = { isDeleted: false };

      if (context.user.role === UserRole.CUSTOMER) {
        filter.showTime = { $gte: new Date() };
        return Show.find(filter).populate(["movieId", "theaterId"]);
      }

      if (context.user.role === UserRole.THEATER_ADMIN) {
        filter.adminId = context.user.id;
        const theater = await Theater.findOne(filter).populate([
          "movieId",
          "theaterId",
          "createdBy",
        ]);

        if (!theater) {
          throw new GraphQLError(
            "Theater Admin does not have an associated theater."
          );
        }

        return Show.find(filter).populate([
          "movieId",
          "theaterId",
          "createdBy",
        ]);
      }

      return Show.find(filter).populate(["movieId", "theaterId", "createdBy"]);
    } catch (error) {
      logger.error(`Error fetching shows: ${error.message}`, { error: error });
      throw new GraphQLError("Failed to fetch shows");
    }
  };

  static show = async (_, { id }: { id: string }, context) => {
    restrictRole(context, []);

    try {
    } catch (error) {
      logger.error(`Error fetching show: ${error.message}`, { error: error });
      throw new GraphQLError("Failed to fetch show");
    }
  };

  static createShow = async (_, { input }: { input: ShowInput }, context) => {
    restrictRole(context, [UserRole.CUSTOMER]);
    const { movieId, theaterId, showTime } = input;

    try {
      const movieExists = await Movie.exists({ _id: movieId });

      if (!movieExists)
        throw new GraphQLError("Invalid movieId. Movie not found.");

      const theaterExists = await Theater.exists({ _id: theaterId });
      if (!theaterExists)
        throw new GraphQLError("Invalid theaterId. Theater not found.");

      const isAdminOfTheater = await Theater.exists({
        _id: theaterId,
        adminId: context.user.id,
      });

      if (!isAdminOfTheater) {
        throw new GraphQLError(
          "Theater Admin can only add shows for their theater."
        );
      }

      if (new Date(showTime) <= new Date()) {
        throw new GraphQLError("Showtime must be in the future.");
      }

      const show = await Show.create({
        movieId,
        theaterId,
        showTime,
        createdBy: context.user.id,
        updatedBy: context.user.id,
      });
      return show;
    } catch (error) {
      logger.error(`Error creating show: ${error.message}`);
      throw new GraphQLError("Failed to create show");
    }
  };

  static deleteShow = async (_, { id }: { id: string }, context) => {
    restrictRole(context, [UserRole.CUSTOMER]);

    try {
      const show = await Show.findById(id);
      if (!show) {
        throw new GraphQLError("Show not found");
      }
    } catch (error) {
      logger.error("Error in Deleting show", error);
      throw new GraphQLError("Error in Deleting show");
    }
  };
}
