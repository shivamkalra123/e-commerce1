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
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

/* ✅ CORS — MUST be before routes */
app.use(cors());
app.options("*", cors());

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

app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});

export default app;
