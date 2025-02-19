import { Schema, model, Document } from "mongoose";

export interface IReservation extends Document {
  userId: Schema.Types.ObjectId;
  showId: Schema.Types.ObjectId;
  transactionId?: Schema.Types.ObjectId;
  reservationTime: Date;
  seatNumber: string;
  qrTicket: string;
  isDeleted: boolean;
}

const ReservationSchema = new Schema<IReservation>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  showId: {
    type: Schema.Types.ObjectId,
    ref: "Show",
    required: true,
  },
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: "Transaction",
  },
  reservationTime: {
    type: Date,
    default: Date.now,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  qrTicket: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default model<IReservation>("Reservation", ReservationSchema);
