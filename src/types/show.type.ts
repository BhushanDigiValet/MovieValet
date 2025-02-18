export interface ShowInput {
  movieId: string;
  theaterId: string;
  showTime: string;
}

export interface UpdateInput extends Partial<ShowInput> {}
