// src/server.ts
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs, resolvers } from './graphql';
import { getUserFromToken } from './Auth/auth';

interface MyContext {
  user?: {
    id: string;
    username: string;
    role: string;
  };
  req: express.Request;
  res: express.Response;
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
    cors({
      origin: 'http://localhost:4200',
      credentials: true,
    }),
  );

  app.use(express.json());

  app.use(
    '/',
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<MyContext> => {
        // const token = req.headers.authorization;
        const token = req.headers.authorization?.split("Bearer ")[1];
        const user = token ? await getUserFromToken(token) : null;
        return { user, req, res };
      },
    }),
  );

  return httpServer;
};

export default createServer;
