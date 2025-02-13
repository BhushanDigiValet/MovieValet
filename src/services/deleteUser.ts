import { GraphQLError } from "graphql";
import { User } from "../models";
import logger from "../utils/loggers";
import { UserRole } from "../types/defaultValue";

export const deleteUser = async (
  _: any,
  { id, role }: { id: string; role: string },
  context: any
) => {
  if (!context.user) {
    throw new GraphQLError("Unauthorized", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }

  if (
    (role === UserRole.ADMIN && context.user.role === UserRole.THEATER_ADMIN) ||
    context.user.role === UserRole.CUSTOMER
  ) {
    throw new GraphQLError("Unauthorized to delete");
  }

  const adminId = context.user.id;

  const data = await User.findByIdAndUpdate(
    id,
    { isDeleted: true, updatedBy: adminId, updatedAt: new Date() },
    { new: true }
  );

  if (!data) {
    logger.error(`User with ID ${id} not found`);
    throw new GraphQLError("User not found", {
      extensions: { code: "NOT_FOUND" },
    });
  }

  logger.info(`User ${id} deleted by Admin ${adminId}`);

  return {
    username: data.username,
    email: data.email,
    role: data.role,
    message: "User deleted successfully",
  };
};
