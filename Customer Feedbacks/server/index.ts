import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/database.js";

// Import route handlers
import { handleDemo } from "./routes/demo.js";
import authRoutes from "./routes/auth.js";
import whatsappRoutes from "./routes/whatsapp.js";
import settingsRoutes from "./routes/settings.js";
import customersRoutes from "./routes/customers.js";
import feedbackRoutes from "./routes/feedback.js";
import statsRoutes from "./routes/stats.js";
import migrationRoutes from "./routes/migration.js";
import emailWebhookRoutes from "./routes/email-webhook.js";

// Load environment variables
dotenv.config();

export function createServer() {
  const app = express();

  // Connect to database
  connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // Health check
  app.get("/api/ping", (_req, res) => {
    res.json({
      message: "Customer Feedback Automation API v1.0",
      timestamp: new Date().toISOString(),
      status: "healthy",
    });
  });

  // Legacy demo route
  app.get("/api/demo", handleDemo);

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/stats", statsRoutes);
  app.use("/api/whatsapp", whatsappRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/customers", customersRoutes);
  app.use("/api/feedback", feedbackRoutes);
  app.use("/api/migration", migrationRoutes);
  app.use("/api/email", emailWebhookRoutes);

  // Error handling middleware
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("Server Error:", err);
      res.status(500).json({
        error: "Internal server error",
        message: err.message,
      });
    },
  );

  // 404 handler for API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  return app;
}
