import { NextResponse } from "next/server";

// GET /api/v1/health - Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      api: "healthy",
      database: "pending", // Will be updated when database is connected
      auth: "healthy",
    },
  });
}
