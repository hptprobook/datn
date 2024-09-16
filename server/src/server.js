/* eslint-disable */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import exitHook from 'async-exit-hook';
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb';
import { env } from '~/config/environment';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware';
import http from 'http';
import cookieParser from 'cookie-parser';
import { APIs } from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger_output.json';
import path from 'path';

const START_SERVER = () => {
  const app = express();
  const server = http.createServer(app);
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());
  app.use(cors());
  app.use(express.json());
  // app.use(
  //   cors({
  //     origin: 'http://localhost:5173',
  //     credentials: true,
  //   })
  // );

  app.use(errorHandlingMiddleware);

  // Serve static files from the 'src/public/imgs' directory
  app.use('/imgs', express.static(path.join(__dirname, 'public/imgs')));

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
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
