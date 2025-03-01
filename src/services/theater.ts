import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';
import { restrictRole } from '../Auth/authorization';
import { UserRole } from '../types/defaultValue';
import { User, Theater } from '../models';
import logger from '../utils/loggers';
import { CreateTheaterInput } from '../types/theater.type';

export class TheaterService {
  static async theaters(_, args, context) {
    restrictRole(context, [UserRole.THEATER_ADMIN]);

    try {
      logger.info(`User ${context.user.id} is fetching all theaters`);

      const theaters = await Theater.find({ isDeleted: false }).populate([
        'adminId',
        'createdBy',
        'updatedBy',
      ]);

      logger.info(`Fetched ${theaters.length} theaters`);

      return theaters;
    } catch (error) {
      logger.error(`Error fetching theaters: ${error.message}`);
      throw new GraphQLError('Failed to fetch theaters');
    }
  }

  static async theater(_, { id }: { id: string }, context) {
    restrictRole(context, [UserRole.THEATER_ADMIN]);

    if (!id) {
      logger.warn('Theater ID is required but not provided');
      throw new GraphQLError('Theater ID is required');
    }

    try {
      logger.info(`User ${context.user.id} is fetching theater with ID ${id}`);

      const theater = await Theater.findById(id);
      if (!theater) {
        logger.error(`Theater with ID ${id} not found`);
        throw new GraphQLError('Theater not found');
      }

      logger.info(`Fetched theater: ${theater.name}`);
      return theater;
    } catch (error) {
      logger.error(`Error fetching theater with ID ${id}: ${error.message}`);
      throw new GraphQLError('Failed to fetch theater');
    }
  }

  static async createTheater(_, { input }: { input: CreateTheaterInput }, context) {
    const { name, location, adminEmail } = input;

    restrictRole(context, [UserRole.CUSTOMER, UserRole.THEATER_ADMIN]);

    try {
      logger.info(`User ${context.user.id} is creating a theater with name ${name}`);

      const admin = await User.findOne({
        email: adminEmail,
        role: UserRole.THEATER_ADMIN,
      }).lean();

      if (!admin) {
        logger.warn(`Admin email ${adminEmail} is invalid or not a THEATER_ADMIN`);
        throw new GraphQLError(`Admin email ${adminEmail} is invalid or not a THEATER_ADMIN`);
      }

      const adminId = admin._id;

     
      const [existingTheater, existingTheaterAdmin] = await Promise.all([
        Theater.exists({ name }),
        Theater.exists({ adminId }),
      ]);

      if (existingTheater) {
        logger.warn(`Theater with name ${name} already exists`);
        throw new GraphQLError('Theater already exists');
      }

      if (existingTheaterAdmin) {
        logger.warn(`Admin ${adminId} is already assigned to a theater`);
        throw new GraphQLError('This admin is already assigned to a theater');
      }

      const newTheater = new Theater({
        name,
        location,
        adminId,
        createdBy: context.user ? new mongoose.Types.ObjectId(context.user.id) : undefined,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      logger.info(`Theater ${name} created successfully`);
      return (await newTheater.save()).populate(['adminId', 'createdBy', 'updatedBy']);
    } catch (error) {
      logger.error(`Error creating theater: ${error.message}`);
      throw new GraphQLError(error.message || 'Failed to create theater');
    }
  }

  static async deleteTheater(_, { id }: { id: string }, context) {
    restrictRole(context, [UserRole.CUSTOMER]);

    try {
      logger.info(`User ${context.user.id} is attempting to delete theater with ID ${id}`);
      const existingTheater = await Theater.findById(id).lean();

      if (!existingTheater) {
        logger.error(`Theater with ID ${id} does not exist`);
        throw new GraphQLError('Theater does not exist');
      }

      if (existingTheater.isDeleted) {
        logger.warn(`Theater with ID ${id} is already deleted`);
        throw new GraphQLError('Theater is already deleted');
      }

      if (
        context.user.role === UserRole.THEATER_ADMIN &&
        !existingTheater.adminId.equals(context.user.id)
      ) {
        logger.warn(`User ${context.user.id} is not authorized to delete theater ${id}`);
        throw new GraphQLError('You can only delete the theater you manage');
      }

      const updatedTheater = await Theater.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
          updatedBy: context.user.id,
          updatedAt: new Date(),
        },
        { new: true },
      ).populate(['adminId', 'createdBy', 'updatedBy']);

      logger.info(`Theater with ID ${id} deleted successfully`);
      return updatedTheater;
    } catch (error) {
      logger.error(`Error deleting theater with ID ${id}: ${error.message}`);
      throw new GraphQLError('Failed to delete theater');
    }
  }

  static async updateTheater(_, { id, input }, context) {
    restrictRole(context, [UserRole.CUSTOMER]);

    try {
      logger.info(`User ${context.user.id} is attempting to update theater with ID ${id}`);

      const existingTheater = await Theater.findById(id).lean();
      if (!existingTheater) {
        logger.error(`Theater with ID ${id} not found`);
        throw new GraphQLError('Theater not found');
      }

      if (
        context.user.role === UserRole.THEATER_ADMIN &&
        !existingTheater.adminId.equals(context.user.id)
      ) {
        logger.warn(`User ${context.user.id} is not authorized to update theater ${id}`);
        throw new GraphQLError('You can only update the theater you manage');
      }

      const updatedTheater = await Theater.findByIdAndUpdate(
        id,
        {
          ...input,
          updatedBy: context.user.id,
          updatedAt: new Date(),
        },
        { new: true },
      ).populate(['adminId', 'createdBy', 'updatedBy']);

      logger.info(`Theater with ID ${id} updated successfully`);
      return updatedTheater;
    } catch (error) {
      logger.error(`Error updating theater with ID ${id}: ${error.message}`);
      throw new GraphQLError('Failed to update theater');
    }
  }
}

export default TheaterService;
