import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Category Spesialis API",
      version: "1.0.0",
      description: "Dokumentasi API Category Spesialis",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
  },
  apis: [path.resolve("./src/app/api/**/*.js")], // otomatis baca semua route.js termasuk [id]
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
