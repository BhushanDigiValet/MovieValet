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
            logger.error(
              `Unauthorized access or theater not found: ${theaterId}`,
              { userId: context.user.id }
            );
            throw new GraphQLError(
              "Theater not found or you are not the admin of this theater"
            );
          }
        }
      }

      if (context.user.role === UserRole.CUSTOMER) {
        filter.userId = context.user.id;
      }
      const reservations = await Reservation.find(filter);
      return reservations;
    } catch (error) {
      logger.error("Get Reservation Error", { error, theaterId });
      throw new GraphQLError("Failed to get reservation. Please try again.");
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
        Reservation.find({ showId, seatNumber: { $in: seatNumber } }),
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
      console.error("Reservation Error:", error);
      throw new GraphQLError("Failed to create reservation. Please try again.");
    }
  }
}
