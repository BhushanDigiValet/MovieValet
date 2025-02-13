import { User } from "../models";
import { IResolvers } from "@graphql-tools/utils";
import { login } from "../services/login";
import { register } from "../services/register";
import { deleteUser } from "../services/deleteUser";


const resolvers = {
  Query: {
    users: async () => {
      return await User.find({ isDeleted: false });
    },
    user: async (_: any, { id }: { id: string }) => {
      return await User.findById(id);
    },
  },
  Mutation: {
    register: register,
    login: login,
    deleteUser: deleteUser,
  },
};

export default resolvers;
