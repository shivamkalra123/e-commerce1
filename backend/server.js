import express from "express"
import cors from "cors";
import "dotenv/config"
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import categoriesRoute from "./routes/categoryRoute.js"
import bannerRoute from "./routes/bannerRoute.js"
import reviewRoutes from "./routes/reviewRoute.js"
import adminContentRoute from "./routes/adminContent.js"
import contentRoute from "./routes/contentRoute.js"

// app config
const app = express();
const port = process.env.PORT || 4000;

connectDB()
connectCloudinary()

// middleware
// middleware
app.use(express.json())

// 🔥 FIXED CORS FOR VERCEL
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://e-commerce1-lovat.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://e-commerce1-weme.onrender.com",
    "https://brandedparcels.com",
    "https://e-commerce1-veng.vercel.app"

  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
res.setHeader(
  "Access-Control-Allow-Headers",
  "Content-Type, Authorization, token"
);

  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


// 🔥 LOG EVERY API HIT
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode}`);
  });
  next();
});

// routes
app.use("/api/content", contentRoute);
app.use("/api/admin/content", adminContentRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/banner", bannerRoute);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("API working")
})

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
})

export default app;
