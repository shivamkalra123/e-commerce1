import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

// 🔐 Admin routes
import adminCategoryRoutes from "./routes/categoryAdminRoute.js";
import adminProductRoutes from "./routes/productAdminRoute.js";
import adminOrderRoutes from "./routes/orderAdminRoute.js";

// 🌍 Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --------------------
// Middleware
// --------------------
app.use(cors());
app.use(express.json());

// --------------------
// MongoDB Connection
// --------------------
let db;

const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  try {
    await client.connect();
    db = client.db("E-Commerce");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

await connectDB();

// --------------------
// Attach DB to req
// --------------------
app.use((req, res, next) => {
  req.db = db;
  next();
});

// --------------------
// 🔐 ADMIN ROUTES
// --------------------
app.use("/api/admin", adminCategoryRoutes);
app.use("/api/admin", adminProductRoutes);
app.use("/api/admin", adminOrderRoutes);

// --------------------
// Health Check
// --------------------
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Admin API running 🚀",
    time: new Date().toISOString(),
  });
});

// --------------------
// 404 Handler
// --------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// --------------------
// Error Handler
// --------------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// --------------------
// Start Server
// --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
