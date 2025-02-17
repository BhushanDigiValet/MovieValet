import { GraphQLError } from "graphql";
import { hashPassword } from "../Auth/auth";
import { restrictRole, validateRoleCreation } from "../Auth/authorization";
import { User } from "../models";
import { UserRole } from "../types/defaultValue";
import logger from "../utils/loggers";
import {
  RegisterInput,
  UserFilterInput,
  UserUpdateInput,
} from "../types/user.type";

export class UserResolver {
  static async register(_: any, { input }: { input: RegisterInput }, context) {
    const { username, email, password, role } = input;

    try {
      validateRoleCreation(role, context);

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        logger.warn(
          `Registration attempt failed: User with email ${email} already exists`
        );
        throw new GraphQLError("User already exists");
      }

      const passwordHash = await hashPassword(password);

      const newUser = new User({
        username,
        email,
        passwordHash,
        role,
        createdBy: context.user ? context.user.id : undefined,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await newUser.save();

      logger.info(`New user registered: ${username} (${email}), role: ${role}`);

      return {
        username: username,
        email: email,
        role: role,
        message: "User registered successfully",
      };
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      throw new GraphQLError("Failed to register user");
    }
  }

  static async deleteUser(_, { id }: { id: string }, context) {
    restrictRole(context, []);

    try {
      if (
        context.user.role === UserRole.CUSTOMER ||
        context.user.role === UserRole.THEATER_ADMIN
      ) {
        if (context.user.id !== id) {
          logger.warn(
            `Unauthorized delete attempt by user ${context.user.id} on user ${id}`
          );
          throw new GraphQLError("You can only delete your own profile.", {
            extensions: { code: "FORBIDDEN" },
          });
        }

        const adminId = context.user.id;

        const data = await User.findByIdAndUpdate(
          id,
          { isDeleted: true, updatedBy: adminId, updatedAt: new Date() },
          { new: true }
        );

        if (!data) {
          logger.error(
            `User with ID ${id} not found for deletion by Admin ${adminId}`
          );
          throw new GraphQLError("User not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        logger.info(`User ${id} deleted successfully by Admin ${adminId}`);

        return {
          username: data.username,
          email: data.email,
          role: data.role,
          message: "User deleted successfully",
        };
      }
    } catch (error) {
      logger.error(`Error deleting user ${id}: ${error.message}`);
      throw new GraphQLError("Failed to delete user");
    }
  }

  static async users(_: any, { input }: { input: UserFilterInput }, context) {
    restrictRole(context, [UserRole.THEATER_ADMIN, UserRole.CUSTOMER]);

    const filter: Record<string, any> = { isDeleted: false };
    if (input?.role) {
      filter.role = input.role;
    }

    try {
      logger.info(
        `Fetching users with filter: ${JSON.stringify(filter)} by user ${
          context.user.id
        }`
      );

      const users = await User.find(filter);
      return users;
    } catch (error) {
      logger.error(`Error fetching users: ${error.message}`);
      throw new GraphQLError("Failed to fetch users");
    }
  }

  static async user(_: any, { id }: { id: string }, context) {
    restrictRole(context, []);

    try {
      if (
        context.user.role === UserRole.CUSTOMER ||
        context.user.role === UserRole.THEATER_ADMIN
      ) {
        if (context.user.id !== id) {
          logger.warn(
            `Unauthorized access attempt by user ${context.user.id} to user profile ${id}`
          );
          throw new GraphQLError("You can only access your own profile.", {
            extensions: { code: "FORBIDDEN" },
          });
        }
      }

      logger.info(`Fetching user profile: ${id} by user ${context.user.id}`);
      const user = await User.findById(id);

      if (!user) {
        logger.error(`User ${id} not found`);
        throw new GraphQLError("User not found");
      }

      return user;
    } catch (error) {
      logger.error(`Error fetching user ${id}: ${error.message}`);
      throw new GraphQLError("Failed to fetch user");
    }
  }

  static async updateUser(
    _: any,
    { id, input }: { id: string; input: UserUpdateInput },
    context
  ) {
    restrictRole(context, []);

    try {
      if (
        context.user.role === UserRole.CUSTOMER ||
        context.user.role === UserRole.THEATER_ADMIN
      ) {
        if (context.user.id !== id) {
          logger.warn(
            `Unauthorized update attempt by user ${context.user.id} on user ${id}`
          );
          throw new GraphQLError("You can only update your own profile.", {
            extensions: { code: "FORBIDDEN" },
          });
        }
      }

      if (input.role && context.user.role !== UserRole.ADMIN) {
        logger.warn(
          `User ${context.user.id} attempted to update role, which is forbidden.`
        );
        throw new GraphQLError("You cannot update your role", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      const updatedUser = await User.findByIdAndUpdate(id, input, {
        new: true,
      });

      if (!updatedUser) {
        logger.error(`User with ID ${id} not found for update`);
        throw new GraphQLError("User not found.", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      logger.info(
        `User ${id} updated successfully by Admin ${context.user.id}`
      );
      return updatedUser;
    } catch (error) {
      logger.error(`Error updating user ${id}: ${error.message}`);
      throw new GraphQLError("Failed to update user");
    }
  }
}

export default UserResolver;
