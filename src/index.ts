// src/index.ts
import "dotenv/config";
import createServer from "./server";
import connectDB from "./config/db";
import logger from "./utils/loggers";

const startServer = async () => {
  try {
    await connectDB();
    const httpServer = await createServer();
    const PORT = process.env.PORT || 4001;
    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server ready at http://localhost:${PORT}/`);
    });
  } catch (err) {
    logger.error("Error starting server:", err);
  }
};

startServer();
