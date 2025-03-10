export interface MovieInput {
  title: string;
  description: string;
  genre: string;
  imdbRating: number;
  language: string[];
  posterUrl: string;
  starCast: { name: string; image: string }[];
  durationMinutes: number;
  releaseDate: string;
}

export interface UpdateMovieInput extends Partial<MovieInput> {}
