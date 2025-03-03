export interface ShowInput {
  movieName: string;
  theaterName: string;
  showTime: string;
  amount: number;
  showStartTime: Date;
  showEndTime: Date;
}

export interface UpdateInput extends Partial<ShowInput> {}
