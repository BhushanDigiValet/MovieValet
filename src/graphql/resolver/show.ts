import { restrictRole } from "../../Auth/authorization";
import { UserRole } from "../../types/defaultValue";

const showResolver = {
  Query: {
    shows: async (parent: any, args: any, context: any) => {
      return context.dataSources.showAPI.getShows();
    },
    show: async (parent: any, args: any, context: any) => {
      return context.dataSources.showAPI.getShow(args.id);
    },
  },
  Mutation: {
    addShow: async (parent: any, args: any, context: any) => {
      restrictRole(context, [UserRole.CUSTOMER]);
      if (context.user.role === UserRole.THEATER_ADMIN) {
        //only theater admin can add Show for their theater
      }
      return context.dataSources.showAPI.addShow(args.show);
    },
    updateShow: async (parent: any, args: any, context: any) => {
      return context.dataSources.showAPI.updateShow(args.id, args.show);
    },
    deleteShow: async (parent: any, args: any, context: any) => {
      return context.dataSources.showAPI.deleteShow(args.id);
    },
  },
};
export default showResolver;
