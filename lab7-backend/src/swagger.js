const swaggerUi = require("swagger-ui-express");

const swaggerDocument = {
  openapi: "3.0.0",
  info: { title: "Lab7 API", version: "1.0.0" },
  paths: {
    "/token": { post: { summary: "Generate JWT" } },
  },
  components: { securitySchemes: { bearerAuth: { type: "http", scheme: "bearer" } } },
  security: [{ bearerAuth: [] }],
};

module.exports = app =>
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
