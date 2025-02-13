// src/server.ts
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import typeDefs from "./schema/typeDefs";
import resolvers from "./schema/resolvers";
import logger from "./utils/loggers";
import { getUserFromToken } from "./utils/auth";

interface MyContext {
  token?: string;
}

const createServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Expecting the header "Authorization: Bearer <token>"
        const authHeader = req.headers.authorization || "";
        const token = authHeader.split(" ")[1];
        const user = token ? getUserFromToken(token) : null;
        return { user };
      },
    })
  );

  return httpServer;
};

export default createServer;
