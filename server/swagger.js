const swaggerAutogen = require('swagger-autogen')();
const doc = {
  info: {
    title: 'Api',
    description: 'Description',
  },
  host: 'localhost:3000/api',
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/userRouter.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
