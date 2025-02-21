import { GraphQLError } from "graphql";
import { restrictRole } from "../Auth/authorization";
import { ReservationInput } from "../types/reservation.type";
import { Reservation, Show, Theater } from "../models";
import { UserRole } from "../types/defaultValue";
import QRCode from "qrcode";
import logger from "../utils/loggers";
import mongoose from "mongoose";

export class ReservationService {
  static async getReservations(
    _,
    { theaterId }: { theaterId: string },
    context
  ) {
    const filter: Record<string, any> = { isDeleted: false };

    try {
      if (theaterId) {
        filter.theaterId = theaterId;

        if (context.user.role === UserRole.THEATER_ADMIN) {
          const theaterExists = await Theater.findOne({
            _id: theaterId,
            adminId: context.user.id,
          }).lean();

          if (!theaterExists) {
            logger.warn(
              `Unauthorized access attempt by user ${context.user.id} for theater ${theaterId}`
            );
            throw new GraphQLError(
              "Unauthorized: Theater not found or you are not the admin."
            );
          }
        }
      }

      if (context.user.role === UserRole.CUSTOMER) {
        filter.userId = context.user.id;
      }
      logger.info(
        `Fetching reservations for user ${
          context.user.id
        } with filter: ${JSON.stringify(filter)}`
      );
      const reservations = await Reservation.find(filter).lean();

      logger.info(
        `Fetched ${reservations.length} reservations for user ${context.user.id}`
      );
      return reservations;
    } catch (error) {
      logger.error(`Error fetching reservations for user ${context.user.id}`, {
        error: error.message,
        theaterId,
      });
      throw new GraphQLError(`Failed to fetch reservations. ${error.message}`);
    }
  }
  static async getReservationsByUser(
    _,
    { userId }: { userId: string },
    context
  ) {
    restrictRole(context, [UserRole.THEATER_ADMIN]);

    try {
      const userReservation = await Reservation.find({ userId }).populate([
        userId,
      ]);
      return userReservation;
    } catch (error) {
      logger.error(`Error in finding reservation by ID ${error.message}`);
      throw new GraphQLError(
        `Error in finding reservation by ID ${error.message}`
      );
    }
  }

  static async cancelReservation(_, { id }: { id: string }, context) {
    restrictRole(context, []);

    try {
      const { user } = context;

      logger.info(`User ${user.id} attempting to cancel reservation ${id}`);

      // Fetch reservation with only needed fields
      const reservation = await Reservation.findById(id).select(
        "userId showId isDeleted"
      );

      if (!reservation) {
        logger.warn(`Reservation ${id} not found.`);
        throw new GraphQLError("Reservation not found");
      }

      if (reservation.isDeleted) {
        logger.warn(`Reservation ${id} is already canceled.`);
        throw new GraphQLError("Reservation is already canceled");
      }

      // Customer can only cancel their own reservation
      if (
        user.role === UserRole.CUSTOMER &&
        reservation.userId.toString() !== user.id
      ) {
        logger.warn(
          `Unauthorized attempt by user ${user.id} to cancel reservation ${id}`
        );
        throw new GraphQLError("You are not the owner of this reservation");
      }

      // Theater Admin validation
      if (user.role === UserRole.THEATER_ADMIN) {
        const show = await Show.findById(reservation.showId).select(
          "theaterId"
        );

        if (!show) {
          logger.error(
            `Show ${reservation.showId} not found for reservation ${id}`
          );
          throw new GraphQLError("Show not found for this reservation");
        }

        const theater = await Theater.findById(show.theaterId).select(
          "adminId"
        );

        if (!theater) {
          logger.error(
            `Theater ${show.theaterId} not found for reservation ${id}`
          );
          throw new GraphQLError("Theater not found for this reservation");
        }

        if (theater.adminId.toString() !== user.id) {
          logger.warn(
            `Unauthorized attempt by theater admin ${user.id} to cancel reservation ${id}`
          );
          throw new GraphQLError(
            "You are not authorized to cancel this reservation"
          );
        }
      }

      // Perform soft delete
      const updatedReservation = await Reservation.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );

      logger.info(`Reservation ${id} canceled successfully by user ${user.id}`);

      return updatedReservation;
    } catch (error) {
      logger.error(`Error canceling reservation ${id}`, {
        error: error.message,
        userId: context.user.id,
      });
      throw new GraphQLError("Failed to cancel reservation. Please try again.");
    }
  }

  static async createReservation(
    _,
    { input }: { input: ReservationInput },
    context
  ) {
    restrictRole(context, [UserRole.THEATER_ADMIN]);

    const { showId, seatNumber } = input;
    const userId = context.user.id;

    try {
      const [show, reservedSeats] = await Promise.all([
        Show.findById(showId),
        Reservation.find({
          showId,
          seatNumber: { $in: seatNumber },
          isDeleted: false,
        }),
      ]);

      if (!show || show.isDeleted) {
        logger.error(`Show not found or deleted: ${showId}`);
        throw new GraphQLError("Show not found");
      }

      if (reservedSeats.length > 0) {
        logger.error(`Seat already reserved: ${seatNumber}`);
        throw new GraphQLError("Seat is already reserved");
      }

      const reservationId = new mongoose.Types.ObjectId();

      const qrTicket = await QRCode.toDataURL(`reservation:${reservationId}`);

      const reservation = await Reservation.create({
        _id: reservationId,
        userId,
        showId,
        seatNumber,
        qrTicket,
        reservationTime: new Date(),
      });

      return reservation;
    } catch (error) {
      throw new GraphQLError(`Failed to create reservation.. ${error.message}`);
    }
  }
}
