import { GraphQLError } from "graphql";
import { restrictRole } from "../../Auth/authorization";
import { Theater, User } from "../../models";
import { ILocation, UserRole } from "../../types/defaultValue";
import mongoose from "mongoose";

const theaterResolver = {
  Query: {
    theaters: async (_, args, context: any) => {
      restrictRole(context, [UserRole.THEATER_ADMIN]);
      return await Theater.find({ isDeleted: false });
    },
    theater: async (_, { id }: { id: string }, context: any) => {
      restrictRole(context, [UserRole.THEATER_ADMIN]);

      if (!id) {
        throw new GraphQLError("Theater ID is required");
      }
      return await Theater.findById(id);
    },
  },
  Mutation: {
    createTheater: async (
      _: any,
      {
        input,
      }: { input: { name: string; location: ILocation; adminId: string } },
      context
    ) => {
      const { name, location, adminId } = input;

      restrictRole(context, [UserRole.CUSTOMER]);

      const adminObjectId = new mongoose.Types.ObjectId(adminId);

      // Check if the admin ID exists and is a THEATER_ADMIN
      const existingAdmin = await User.findOne({
        _id: adminObjectId,
        role: UserRole.THEATER_ADMIN,
      });
      if (!existingAdmin) {
        throw new GraphQLError(
          "Admin ID does not exist or is not a THEATER_ADMIN"
        );
      }

      // Check if the admin is already assigned to a theater
      const existingTheaterAdmin = await Theater.findOne({
        adminId: adminObjectId,
      });

      if (existingTheaterAdmin) {
        throw new GraphQLError("This admin is already assigned to a theater");
      }

      // Check if the theater name already exists
      const existingTheater = await Theater.findOne({ name });
      if (existingTheater) {
        throw new GraphQLError("Theater already exists");
      }

      const newTheater = new Theater({
        name,
        location,
        adminId: adminObjectId,
        createdBy: context.user
          ? mongoose.Types.ObjectId.createFromHexString(context.user.id)
          : undefined,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return await newTheater.save();
    },
    deleteTheater: async (_: any, { id }: { id: string }, context) => {
      restrictRole(context, [UserRole.CUSTOMER]);

      const theaterObjectId = new mongoose.Types.ObjectId(id);
      const userObjectId = new mongoose.Types.ObjectId(context.user.id);

      const existingTheater = await Theater.findOne({ _id: theaterObjectId });

      if (!existingTheater) {
        throw new GraphQLError("Theater does not exist");
      }

      if (existingTheater.isDeleted) {
        throw new GraphQLError("Theater is already deleted");
      }

      if (context.user.role === UserRole.THEATER_ADMIN) {
        if (!existingTheater.adminId.equals(userObjectId)) {
          throw new GraphQLError("You can only delete the theater you manage");
        }
      }

      existingTheater.isDeleted = true;
      existingTheater.updatedBy = userObjectId;
      existingTheater.updatedAt = new Date();

      return await existingTheater.save();
    },

    updateTheater: async (_, { id, input }, context) => {
      restrictRole(context, [UserRole.CUSTOMER]);

      const existingTheater = await Theater.findById(id);
      if (!existingTheater) {
        throw new GraphQLError("Theater not found");
      }

      if (context.user.role === UserRole.THEATER_ADMIN) {
        if (!existingTheater.adminId.equals(context.user.id)) {
          throw new GraphQLError("You can only update the theater you manage");
        }
      }
      const updatedTheater = existingTheater.set({
        ...input,
        updatedBy: context.user.id,
        updatedAt: new Date(),
      });
      return (await updatedTheater.save()).populate([
        "adminId",
        "createdBy",
        "updatedBy",
      ]);
    },
  },
};

export default theaterResolver;

// updateTheater: async (
//       _: any,
//       { id, input }: { id: string; input: any }
//     ) => {
//       return {};
//     },
//     deleteTheater: async (_: any, { id }: { id: string }) => {
//       return true;
//     },
