import { login } from "../../services/login";
import UserResolver from "../../services/user";

const resolvers = {
  Query: {
    users: UserResolver.users,
    user: UserResolver.user,
  },
  Mutation: {
    register: UserResolver.register,
    login: login,
    deleteUser: UserResolver.deleteUser,
    updateUser: UserResolver.updateUser,
  },
};

export default resolvers;
