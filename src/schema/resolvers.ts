import { User } from "../models";
import bcrypt from "bcrypt";

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
    register: async (
      _: any,
      {
        input,
      }: {
        input: {
          username: string;
          email: string;
          password: string;
          role: string;
        };
      },
      context: any
    ) => {
      const { username, email, password, role } = input;
      if (role === "THEATER_ADMIN" || role === "THEATER_ADMIN") {
        if (!context.user || context.user.role !== "ADMIN") {
          throw new Error("Only admins can create theater admins");
        }
      }
      if (!password) {
        throw new Error("Password is required");
      }
      const passwordHash = await bcrypt.hash(password, 10);
      // Include the admin's id (from JWT) as the creator if available
      const newUser = new User({
        username,
        email,
        passwordHash,
        role,
        createdBy: context.user ? context.user.id : undefined,
      });
      return await newUser.save();
    },
    // Other mutations…
    updateUser: async (
      _: any,
      {
        id,
        username,
        email,
        role,
        isDeleted,
      }: {
        id: string;
        username?: string;
        email?: string;
        role?: string;
        isDeleted?: boolean;
      },
      context: any
    ) => {
      // Optionally, add permission checks based on context.user.role
      if (role === "THEATER_ADMIN" || role === "THEATER_ADMIN") {
        if (!context.user || context.user.role !== "ADMIN") {
          throw new Error("Only admins can create theater admins");
        }
      }
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          ...(username && { username }),
          ...(email && { email }),
          ...(role && { role }),
          ...(typeof isDeleted === "boolean" && { isDeleted }),
          updatedBy: context.user ? context.user.id : undefined,
          updatedAt: new Date(),
        },
        { new: true }
      );
      return updatedUser;
    },

    deleteUser: async (_: any, { id }: { id: string }, context: any) => {
      const deletedUser = await User.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
          updatedBy: context.user ? context.user.id : undefined,
          updatedAt: new Date(),
        },
        { new: true }
      );
      return deletedUser;
    },
  },
};

export default resolvers;
