import { Show } from "../models";
import logger from "../utils/loggers";
import { GraphQLError } from "graphql";

const isShowOverlapping = async (
  theaterId: string,
  newStartTime: Date,
  newEndTime: Date
): Promise<boolean> => {
  try {
    const overlappingShow = await Show.findOne({
      theaterId,
      showStartTime: { $lt: newEndTime }, // New show starts before an existing show ends
      showEndTime: { $gt: newStartTime }, // New show ends after an existing show starts
    });
    logger.info(overlappingShow);

    if (overlappingShow) {
      logger.warn(
        `❌ Showtime conflict detected in theater ${theaterId} with an existing show from ${overlappingShow.showStartTime} to ${overlappingShow.showEndTime}`
      );
      return true;
    }

    logger.info(
      `✅ No showtime conflict. New show can be scheduled from ${newStartTime} to ${newEndTime}`
    );
    return false;
  } catch (error) {
    logger.error(`❌ Error checking showtime overlap: ${error.message}`);
  }
};

export default isShowOverlapping;
