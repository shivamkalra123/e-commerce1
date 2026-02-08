import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

// ----------------------------------
// 🔑 FORCE dotenv FIRST (VERY IMPORTANT)
// ----------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env"),
});

// ✅ DEBUG (remove later)
console.log("ENV CHECK:", {
  mongo: !!process.env.MONGODB_URI,
  cloudinary: {
    name: process.env.CLOUDINARY_NAME,
    key: !!process.env.CLOUDINARY_API_KEY,
    secret: !!process.env.CLOUDINARY_SECRET_KEY,
  },
});

// ----------------------------------
// Now it's SAFE to import everything
// ----------------------------------
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// 🔐 Admin routes
import adminAuthRoutes from "./routes/adminAuthRoute.js";
import adminCategoryRoutes from "./routes/categoryAdminRoute.js";
import adminProductRoutes from "./routes/productAdminRoute.js";
import adminOrderRoutes from "./routes/orderAdminRoute.js";

// ☁️ Cloudinary (after dotenv)
import "./config/cloudinary.js";

// ----------------------------------
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// ----------------------------------
// MongoDB
// ----------------------------------
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "E-Commerce",
    });
    console.log("✅ MongoDB (Mongoose) Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

await connectDB();

// ----------------------------------
// Routes
// ----------------------------------
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminCategoryRoutes);
app.use("/api/admin", adminProductRoutes);
app.use("/api/admin", adminOrderRoutes);

// ----------------------------------
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Admin API running 🚀",
    time: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ----------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
