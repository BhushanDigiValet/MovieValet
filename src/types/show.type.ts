export interface ShowInput {
  movieId: string;
  theaterId: string;
  showTime: string;
  amount: number;
  showStartTime: Date;
  showEndTime: Date;
}

export interface UpdateInput extends Partial<ShowInput> {}
