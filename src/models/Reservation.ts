import { Schema, model, Document } from "mongoose";

export interface IReservation extends Document {
  userId: Schema.Types.ObjectId;
  showId: Schema.Types.ObjectId;
  transactionId?: Schema.Types.ObjectId;
  reservationTime: Date;
  //seats: any[];
  qrTicket: string;
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
  //   seats: {
  //     type: [Schema.Types.Mixed],
  //     default: [],
  //   },
  qrTicket: {
    type: String,
    required: true,
  },
});

export default model<IReservation>("Reservation", ReservationSchema);
