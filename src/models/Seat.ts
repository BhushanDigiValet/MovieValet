import { Schema, model, Document } from "mongoose";

export interface ISeat extends Document {
  theaterId: Schema.Types.ObjectId;
  seatNumber: string;
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
});

export default model<ISeat>("Seat", SeatSchema);
