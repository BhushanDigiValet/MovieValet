import { ShowResolver } from "../../services/show";

const showResolver = {
  Query: {
    shows: ShowResolver.shows,
    show: ShowResolver.show,
  },
  Mutation: {
    createShow: ShowResolver.createShow,
    // updateShow: async (parent: any, args: any, context: any) => {
    //   return context.dataSources.showAPI.updateShow(args.id, args.show);
    // },
    // deleteShow: async (parent: any, args: any, context: any) => {
    //   return context.dataSources.showAPI.deleteShow(args.id);
    // },
  },
};
export default showResolver;
