import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation',
      contact: { name: 'API Support', email: 'support@example.com' },
      license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development' },
      { url: 'https://api.example.com', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Documentation',
  }));
  app.get('/api-docs.json', (req, res) => res.json(specs));
};
