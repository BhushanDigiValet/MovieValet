import TheaterResolver from "../../services/theater";

const theaterResolver = {
  Query: {
    theaters: TheaterResolver.theaters,
    theater: TheaterResolver.theater,
  },
  Mutation: {
    createTheater: TheaterResolver.createTheater,
    deleteTheater: TheaterResolver.deleteTheater,
    updateTheater: TheaterResolver.updateTheater,
  },
};

export default theaterResolver;
