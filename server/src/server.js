/* eslint-disable */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import exitHook from 'async-exit-hook';
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb';
import { env } from '~/config/environment';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware';
import cookieParser from 'cookie-parser';
import { APIs } from './routes';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

const START_SERVER = () => {
  const app = express();
  const server = http.createServer(app);
  // Socket config
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Tham gia Room dựa trên userId
    socket.on('online', (userId) => {
      if (userId) {
        console.log('User online:', userId);
        socket.join(userId);
      }
    });

    // Lắng nghe tin nhắn từ client
    socket.on('sendMessage', (data) => {
      io.to(data.room).emit('receiveMessage', data.message);
    });

    socket.on('disconnect', () => {
      console.log(`A user disconnected: ${socket.id}`);
    });
  });

  app.use(cookieParser());
  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'http://localhost:3030',
        'http://localhost:3001',
        'https://bmt-life.vercel.app',
        'https://dashboard-bmt-life.vercel.app',
      ],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(errorHandlingMiddleware);

  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  // Serve static files from the 'src/public/imgs' directory
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.use('/api', APIs);

  server.listen(env.HOST_URL, () => {
    console.log(`Server is running at ${env.HOST_URL}`);
  });

  exitHook(() => {
    CLOSE_DB().then(() => console.log('Disconnected from MongoDB Atlas'));
  });
};

(async () => {
  try {
    await CONNECT_DB();
    console.log('Connect to MongoDB Atlas successfully');
    START_SERVER();
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
})();
