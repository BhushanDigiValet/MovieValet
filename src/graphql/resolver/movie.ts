import MovieResolver from '../../services/movie';

const movieResolver = {
  Query: {
    movies: MovieResolver.movies,
    movie: MovieResolver.movie,
  },
  Mutation: {
    createMovie: MovieResolver.createMovie,
    deleteMovie: MovieResolver.deleteMovie,
    updateMovie: MovieResolver.updateMovie,
  },
};

export default movieResolver;
