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
import { createClient } from 'redis';
import { elasticsearchService } from './services/elasticsearchService';

// Redis client setup
export const redisClient = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      // Exponential backoff with max delay of 3s
      const delay = Math.min(retries * 50, 3000);
      return delay;
    },
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));
redisClient.on('reconnecting', () =>
  console.log('Redis Client Reconnecting...')
);

const START_SERVER = async () => {
  try {
    // Connect to Redis
    await redisClient.connect().catch((err) => {
      console.error('Redis connection failed:', err);
      // Continue server startup even if Redis fails
    });

    if (redisClient.isOpen) {
      // Test Redis connection
      await redisClient.set('test', 'Redis connection successful');
      const testResult = await redisClient.get('test');
      console.log('Redis Test:', testResult);
    }

    // Connect to MongoDB
    await CONNECT_DB();
    console.log('Connected to MongoDB Atlas successfully');

    // Khởi tạo Elasticsearch index
    await elasticsearchService.initializeProductIndex();

    // Đồng bộ dữ liệu ban đầu
    await elasticsearchService.syncProductsToElasticsearch();

    // Express app and server setup
    const app = express();
    const server = http.createServer(app);

    // Socket.io setup
    const io = new Server(server, {
      cors: {
        origin: [
          'http://localhost:5173',
          'http://localhost:3030',
          'http://localhost:3001',
          'https://bmt-life.vercel.app',
          'https://dashboard-bmt-life.vercel.app',
          'http://localhost:8000',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      console.log(`A user connected: ${socket.id}`);

      // Handle joining a room
      socket.on('online', (userId) => {
        if (userId) {
          console.log('User online:', userId);
          socket.join(userId);
        }
      });

      // Handle sending and receiving messages
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
          'http://localhost:8000',
        ],
        credentials: true,
      })
    );
    app.use(express.json());
    app.use(errorHandlingMiddleware);

    // Middleware for Socket.io
    app.use((req, res, next) => {
      req.io = io;
      next();
    });

    // Serve static files
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
    app.get('/', (req, res) => {
      res.send('Hello World from the Docker!');
    });

    // API routes
    app.use('/api', APIs);

    // Start server
    server.listen(env.HOST_URL, () => {
      console.log(`Server is running at ${env.HOST_URL}`);
    });

    // Graceful shutdown for MongoDB and Redis
    exitHook(async () => {
      await CLOSE_DB();
      console.log('Disconnected from MongoDB Atlas');
      await redisClient.quit();
      console.log('Redis connection closed');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

START_SERVER();
