import { MongoClient, ServerApiVersion } from 'mongodb';
import { env } from '~/config/environment';

let appDatabaseInstance = null;

const client = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    serverSelectionTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
});

// Kết nối tới database
export const CONNECT_DB = async () => {
  await client.connect();

  appDatabaseInstance = client.db(env.DATABASE_NAME);
};

export const GET_DB = () => {
  if (!appDatabaseInstance) throw new Error('Must connect to Database first');
  return appDatabaseInstance;
};

export const CLOSE_DB = async () => {
  await client.close();
};
