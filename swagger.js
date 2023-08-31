const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Extend the OpenAPI definition
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mi API',
      version: '1.0.0',
      description: 'API',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Cambia la URL si es necesario
      },
    ],
  },
  apis: ['./server.js'], // Ruta al archivo principal de la API
};

const specs = swaggerJsDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});