import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
      apiKey: process.env.API_KEY,
    },
    plugins: [
      "expo-secure-store"
    ],
  };
};