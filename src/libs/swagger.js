// src/libs/swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation - Pelayanan Kesehatan",
      version: "1.0.0",
      description: "Dokumentasi API untuk sistem pelayanan kesehatan.",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/app/api/**/*.js", "./src/app/api/**/*.ts"], // tambahkan ts kalau kamu pakai TypeScript
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
