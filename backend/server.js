import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import categoriesRoute from "./routes/categoryRoute.js";
import bannerRoute from "./routes/bannerRoute.js";

const app = express();

connectDB();
connectCloudinary();

/* ✅ Manual CORS (Vercel + Express 5 safe) */
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    req.headers.origin || "*"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Credentials",
    "true"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// routes
app.use("/api/categories", categoriesRoute);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/banner", bannerRoute);

app.get("/", (req, res) => {
  res.send("API working");
});

export default app;
