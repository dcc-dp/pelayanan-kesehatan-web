import swaggerUi from "swagger-ui-dist";
import swaggerSpec from "@/src/libs/swagger";
import { NextResponse } from "next/server";

export async function GET() {
  const swaggerHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Docs</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
        <script>
          const ui = SwaggerUIBundle({
            spec: ${JSON.stringify(swaggerSpec)},
            dom_id: '#swagger-ui',
          });
        </script>
      </body>
    </html>
  `;
  return new Response(swaggerHtml, { headers: { "Content-Type": "text/html" } });
}
