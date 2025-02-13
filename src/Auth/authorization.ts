// src/utils/authorization.ts
import { GraphQLError } from "graphql";
import { UserRole } from "../types/defaultValue";
import logger from "../utils/loggers";

export const validateRoleCreation = (role: string, context: any): void => {
  if (role === UserRole.ADMIN || role === UserRole.THEATER_ADMIN) {
    if (!context.user) {
      logger.error("User not authenticated.");
      throw new GraphQLError("User not authenticated.");
    }
    if (context.user.role !== UserRole.ADMIN) {
      logger.error("Unauthorized to perform this action");
      throw new GraphQLError("Unauthorized to perform this action");
    }
  }
};

export const restrictRole = (
  context: any,
  restrictedRoles: UserRole[]
): void => {
  if (!context.user) {
    logger.error("Unauthorized: Please log in");
    throw new GraphQLError("Unauthorized: Please log in", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }
  if (restrictedRoles.includes(context.user.role)) {
    logger.error(
      `Access Denied: ${context.user.role} cannot perform this action`
    );
    throw new GraphQLError(
      `Access Denied: ${context.user.role} cannot perform this action`,
      {
        extensions: { code: "FORBIDDEN" },
      }
    );
  }
};

// export const noCustomer = (context: any): void => {
//   if (!context.user) {
//     throw new GraphQLError("Login", {
//       extensions: { code: "UNAUTHORIZED" },
//     });
//   }
//   if (context.user.role === UserRole.CUSTOMER) {
//     throw new GraphQLError("Unauthorized for Customer", {
//       extensions: { code: "UNAUTHORIZED" },
//     });
//   }
// };

// export const noTHEATER_ADMIN = (context: any): void => {
//   if (!context.user) {
//     throw new GraphQLError("Unauthorized for Customer", {
//       extensions: { code: "UNAUTHORIZED" },
//     });
//   }
//   if (context.user.role === UserRole.THEATER_ADMIN) {
//     throw new GraphQLError("Unauthorized for Customer", {
//       extensions: { code: "UNAUTHORIZED" },
//     });
//   }
// };
