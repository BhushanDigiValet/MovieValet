import { Schema, model, Document } from "mongoose";

export interface ISeat extends Document {
  theaterId: Schema.Types.ObjectId;
  seatNumber: string;
  reservationId: Schema.Types.ObjectId;
  showId: Schema.Types.ObjectId;
}

const SeatSchema = new Schema<ISeat>({
  theaterId: {
    type: Schema.Types.ObjectId,
    ref: "Theater",
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  reservationId: {
    type: Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
  },
  showId: {
    type: Schema.Types.ObjectId,
    ref: "Show",
    required: true,
  },
});

export default model<ISeat>("Seat", SeatSchema);
