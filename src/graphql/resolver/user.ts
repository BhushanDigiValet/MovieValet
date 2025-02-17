import { User } from "../../models";
import { IResolvers, updateArgument } from "@graphql-tools/utils";
import { login } from "../../services/login";
import { register } from "../../services/register";
import { deleteUser } from "../../services/deleteUser";
import { restrictRole } from "../../Auth/authorization";
import { UserRole } from "../../types/defaultValue";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    users: async (_, { input }: { input: { role?: UserRole } }, context) => {
      restrictRole(context, [UserRole.THEATER_ADMIN, UserRole.CUSTOMER]);

      const filter: Record<string, any> = { isDeleted: false };
      if (input?.role) {
        filter.role = input.role;
      }

      return await User.find(filter);
    },
    user: async (_: any, { id }: { id: string }, context) => {
      restrictRole(context, []);
      if (
        context.user.role === UserRole.CUSTOMER ||
        context.user.role === UserRole.THEATER_ADMIN
      ) {
        if (context.user.id !== id) {
          throw new GraphQLError("You can only access your own profile.", {
            extensions: { code: "FORBIDDEN" },
          });
        }
      }
      return await User.findById(id);
    },
  },
  Mutation: {
    register: register,
    login: login,
    deleteUser: deleteUser,
    updateUser: async (
      _: any,
      { id, input }: { id: string; input },
      context
    ) => {
      restrictRole(context, []);

      if (
        context.user.role === UserRole.CUSTOMER ||
        context.user.role === UserRole.THEATER_ADMIN
      ) {
        if (context.user.id !== id) {
          throw new GraphQLError("You can only update your own profile.", {
            extensions: { code: "FORBIDDEN" },
          });
        }
      }
      if (input.role && context.user.role !== UserRole.ADMIN) {
        throw new GraphQLError("You cannot update your role", {
          extensions: { code: "FORBIDDEN" },
        });
      }
      
       const updatedUser = await User.findByIdAndUpdate(id, input, {
         new: true,
       });

       if (!updatedUser) {
         throw new GraphQLError("User not found.", {
           extensions: { code: "NOT_FOUND" },
         });
       }

       return updatedUser;
    },
  },
};

export default resolvers;
