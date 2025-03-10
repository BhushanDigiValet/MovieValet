import TheaterService from '../../services/theater';

const theaterResolver = {
  Query: {
    theaters: TheaterService.theaters,
    theater: TheaterService.theater,
  },
  Mutation: {
    createTheater: TheaterService.createTheater,
    deleteTheater: TheaterService.deleteTheater,
    updateTheater: TheaterService.updateTheater,
  },
};

export default theaterResolver;
