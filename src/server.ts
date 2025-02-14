// src/server.ts
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { typeDefs, resolvers } from "./graphql";
import { getUserFromToken } from "./Auth/auth";

interface MyContext {
  user?: {
    id: string;
    username: string;
    role: string;
  };
  req: express.Request;
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
      context: async ({ req }): Promise<MyContext> => {
        const token = req.headers.authorization;

        const user = token ? await getUserFromToken(token) : null;
  

        return { user, req };
      },
    })
  );

  return httpServer;
};

export default createServer;
