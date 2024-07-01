/* eslint-disable */
import express from 'express';
import cors from 'cors';
import exitHook from 'async-exit-hook';
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb';
import { env } from '~/config/environment';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware';
import { corsOptions } from './config/cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import { APIs } from './routes';
const START_SERVER = () => {
  const app = express();

  const server = http.createServer(app);

  app.use(cookieParser());

  app.use(cors(corsOptions));

  app.use(express.json());

  app.use(errorHandlingMiddleware);

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.use('/api', APIs);

  if (env.BUILD_MODE === 'production') {
    server.listen(env.APP_PORT, () => {
      console.log(`Server is running at ${env.APP_PORT}`);
    });
  } else {
    server.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(
        `Server is running at http://${env.APP_HOST}:${env.APP_PORT}/`
      );
    });
  }

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
