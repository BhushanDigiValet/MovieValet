// src/server.ts
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs, resolvers } from './graphql';
import { getUserFromToken } from './Auth/auth';
import { Server } from 'socket.io';
import { UserRole } from './types/defaultValue';

interface MyContext {
  user?: {
    id: string;
    username: string;
    role: string;
  };
  req: express.Request;
  res: express.Response;
}
const adminSockets = new Map<string, any>();

const createServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:4200',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      console.log('Unauthorized socket connection attempt.');
      socket.disconnect();
      return;
    }

    getUserFromToken(token).then((user) => {
      if (user?.role === UserRole.ADMIN) {
        console.log(`Admin connected: ${user.username}, Socket ID: ${socket.id}`);
        adminSockets.set(user.id, socket);

        socket.on('disconnect', () => {
          console.log(`Admin disconnected: ${user.username}`);
          adminSockets.delete(user.id);
        });
      } else {
        console.log('Non-admin connection blocked');
        socket.disconnect();
      }
    });
  });

  const notifyReservationUpdate = (reservationData: any) => {
    adminSockets.forEach((socket) => {
      socket.emit('reservationUpdated', reservationData);
    });
  };

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
        const token = req.headers.authorization?.split('Bearer ')[1] || req.headers.authorization;
        const user = token ? await getUserFromToken(token) : null;
        return { user, req, res };
      },
    }),
  );

  return { httpServer, notifyReservationUpdate };
};

export default createServer;
