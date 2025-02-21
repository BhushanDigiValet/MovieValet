import { GraphQLError } from "graphql";
import { Movie, Show, Theater } from "../models";
import { UserRole } from "../types/defaultValue";
import { restrictRole } from "../Auth/authorization";
import { ShowInput, UpdateInput } from "../types/show.type";
import logger from "../utils/loggers";
import isShowOverlapping from "../utils/showUtils";

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
      const show = await Show.findById(id);
      if (show.isDeleted) {
        throw new GraphQLError("Show is deleted");
      }
      if (!show) {
        throw new GraphQLError("Show not found");
      }

      if (context.user.role === UserRole.CUSTOMER) {
        if (new Date(show.showStartTime) < new Date()) {
          throw new GraphQLError("Show has already passed.");
        }
      }

      if (context.user.role === UserRole.THEATER_ADMIN) {
        const theater = await Theater.findOne({
          _id: show.theaterId,
          adminId: context.user.id,
        });

        if (!theater) {
          throw new GraphQLError(
            "Theater Admin can only view shows for their theater."
          );
        }
      }

      return await show.populate([
        "movieId",
        "theaterId",
        "createdBy",
        "updatedBy",
      ]);
    } catch (error) {
      logger.error(`Error fetching show: ${error.message}`, { error: error });
      throw new GraphQLError("Failed to fetch show");
    }
  };

  static createShow = async (_, { input }: { input: ShowInput }, context) => {
    restrictRole(context, [UserRole.CUSTOMER]);
    const { movieId, theaterId, showStartTime, showEndTime, amount } = input;

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

      if (!isAdminOfTheater && context.user.role === UserRole.THEATER_ADMIN) {
        throw new GraphQLError(
          "Theater Admin can only add shows for their theater."
        );
      }

      if (new Date(showStartTime) <= new Date()) {
        throw new GraphQLError("Showtime must be in the future.");
      }
      const check = await isShowOverlapping(
        theaterId,
        showStartTime,
        showEndTime
      );
      if (check) {
        throw new GraphQLError(
          "Some show already place. try some another time"
        );
      }

      const show = await Show.create({
        movieId,
        theaterId,
        showStartTime,
        showEndTime,
        createdBy: context.user.id,
        updatedBy: context.user.id,
        amount,
      });
      const fullShowData = await show.populate(["movieId", "theaterId"]);
      return fullShowData;
    } catch (error) {
      logger.error(`Error creating show: ${error.message}`);
      throw new GraphQLError(`Error creating show: ${error.message}`);
    }
  };

  static updateShow = async (
    _,
    { id, input }: { id: string; input: UpdateInput },
    context
  ) => {
    restrictRole(context, [UserRole.CUSTOMER]);

    try {
      const show = await Show.findById(id);
      if (!show) {
        throw new GraphQLError("Show not found");
      }

      const theater = await Theater.findOne({
        _id: show.theaterId,
        adminId: context.user.id,
      });
      if (!theater && context.user.role === UserRole.THEATER_ADMIN) {
        throw new GraphQLError(
          "Theater Admin can only update shows for their theater."
        );
      }

      if (input.movieId) {
        const movieExists = await Movie.exists({ _id: input.movieId });

        if (!movieExists)
          throw new GraphQLError("Invalid movieId. Movie not found.");
      }

      if (input.theaterId) {
        const theaterExists = await Theater.exists({ _id: input.theaterId });
        if (!theaterExists)
          throw new GraphQLError("Invalid theaterId. Theater not found.");

        const isAdminOfTheater = await Theater.exists({
          _id: input.theaterId,
          adminId: context.user.id,
        });

        if (!isAdminOfTheater) {
          throw new GraphQLError(
            "Theater Admin can only update shows for their theater."
          );
        }
      }

      if (input.showTime) {
        if (new Date(input.showTime) <= new Date()) {
          throw new GraphQLError("Showtime must be in the future.");
        }
      }

      Object.keys(input).forEach((key) => {
        show[key] = input[key];
      });

      show.updatedBy = context.user.id;
      show.updatedAt = new Date();

      await show.save();
      logger.info(`Show with ID ${id} updated by Admin ${context.user.id}`);

      return await show.populate([
        "movieId",
        "theaterId",
        "createdBy",
        "updatedBy",
      ]);
    } catch (error) {
      logger.error("Error in Updating Show:", error.message);
      throw new GraphQLError("Error in Updating Show");
    }
  };

  static deleteShow = async (_, { id }: { id: string }, context) => {
    restrictRole(context, [UserRole.THEATER_ADMIN]);

    try {
      const show = await Show.findById(id);
      if (!show) {
        throw new GraphQLError("Show not found");
      }

      const theater = await Theater.findOne({
        _id: show.theaterId,
        adminId: context.user.id,
      });
      if (!theater) {
        throw new GraphQLError(
          "Theater Admin can only delete shows for their own theater."
        );
      }

      show.isDeleted = true;
      show.updatedBy = context.user.id;
      show.updatedAt = new Date();

      await show.save();
      logger.info(
        `Show with ID ${id} marked as deleted by Admin ${context.user.id}`
      );

      return await show.populate([
        "movieId",
        "theaterId",
        "createdBy",
        "updatedBy",
      ]);
    } catch (error) {
      logger.error("Error in Deleting Show:", error);
      throw new GraphQLError("Error in Deleting Show");
    }
  };
}
