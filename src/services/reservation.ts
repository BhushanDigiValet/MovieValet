import { GraphQLError } from "graphql";
import { restrictRole } from "../Auth/authorization";
import { ReservationInput } from "../types/reservation.type";
import { Reservation, Seat, Show } from "../models";
import { UserRole } from "../types/defaultValue";
import QRCode from "qrcode";

export class ReservationService {
  static async createReservation(
    _,
    { input }: { input: ReservationInput },
    context
  ) {
    restrictRole(context, [UserRole.THEATER_ADMIN]);
    const { showId, seats, qrTicket } = input;
    const userId = context.user.id;

    try {
      const show = await Show.findById(showId);
      if (!show || show.isDeleted) {
        throw new GraphQLError("Show not found");
      }

      // Check if the seats are available
      const availableSeats = await Seat.find({
        theaterId: show.theaterId,
        showId: showId,
        seatNumber: { $in: seats },
      });
      if (availableSeats.length > 0) {
        throw new GraphQLError("One or more seats are not available");
      }

      const reservation = await Reservation.create({
        userId,
        showId,
        seats,
        qrTicket,
        reservationTime: new Date(),
      });

      for (const seat of seats) {
        await Seat.create({
          theaterId: show.theaterId,
          seatNumber: seat,
          showId,
          reservationId: reservation.id,
        });
      }
      const qrCodeData = await QRCode.toDataURL(
        `reservation:${reservation._id}`
      );
      reservation.qrTicket = qrCodeData;
      await reservation.save();

      return reservation;
    } catch (error) {
      throw new GraphQLError(`Error creating reservation: ${error.message}`);
    }
  }
}
