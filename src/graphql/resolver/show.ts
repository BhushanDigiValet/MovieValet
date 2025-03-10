import { ShowResolver } from '../../services/show';

const showResolver = {
  Query: {
    shows: ShowResolver.shows,
    show: ShowResolver.show,
  },
  Mutation: {
    createShow: ShowResolver.createShow,
    deleteShow: ShowResolver.deleteShow,
    updateShow: ShowResolver.updateShow,
  },
};
export default showResolver;
