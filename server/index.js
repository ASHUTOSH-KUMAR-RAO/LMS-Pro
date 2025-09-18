import express from "express";
import cors from "cors";
import "dotenv/config"; // 🔧 Express mein extra package install karna padta hai env file ke liye, But Next.js mein built-in support hai! Modern development mein Next.js popular hone ki ek wajah ye bhi hai 🚀
import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";

// 🛤️ Import Routes
import educatorRouter from "./routes/educatorRoutes.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";

// 🚀 Initialize Express App
const app = express();

// 🔗 Database & Cloud Connections
try {
  console.log("🔌 Connecting to databases...");
  await connectDb();
  console.log("✅ MongoDB connected successfully!");

  await connectCloudinary();
  console.log("☁️ Cloudinary connected successfully!");
} catch (error) {
  console.error("❌ Database connection failed:", error.message);
  process.exit(1);
}

// 🛡️ Middleware Setup
/**
 * 🌐 CORS - Cross-Origin Resource Sharing
 * Allows frontend domains to connect with our backend
 * Without this, browsers throw "CORS ERROR" 🚫
 */
app.use(cors());

/**
 * 🔐 Clerk Authentication Middleware
 * Handles user authentication across all routes
 */
app.use(clerkMiddleware());

// 🛤️ Routes Configuration
/**
 * 🏠 Health Check Route
 * Basic endpoint to verify server is running
 */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🎉 API is working perfectly!",
  });
});

/**
 * 🔔 Webhook Routes (Raw data required)
 * These routes need raw body data, not JSON parsed
 */
app.post("/clerk", express.json(), clerkWebhooks);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

/**
 * 📚 API Routes with JSON Middleware
 * All business logic routes with JSON parsing
 */
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);

// 🚀 Server Startup
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("🎯 ================================");
  console.log(`🚀 Server is running on Port: ${PORT}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log("🎯 ================================");
});
