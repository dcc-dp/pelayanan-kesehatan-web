import swaggerUi from "swagger-ui-express";
import swaggerSpec from "@/src/libs/swagger";
import { NextResponse } from "next/server";
import express from "express";

// Trik kecil: kita perlu Express-like handler di Next.js
const app = express();
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export async function GET() {
  // Redirect ke UI Swagger
  return NextResponse.redirect("/api/docs");
}
