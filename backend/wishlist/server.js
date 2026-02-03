import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import wishlistRoutes from "./routes/wishlist.js";

dotenv.config();

const app = express();

/* ---------- MIDDLEWARE ---------- */

app.use(
  cors({
    origin: "*", // later restrict if needed
    credentials: false,
  })
);

app.use(express.json());
console.log("ahah");

/* ---------- ROUTES ---------- */

app.get("/", (req, res) => {
  res.send("Wishlist service running ✅");
});

app.use("/api/wishlist", wishlistRoutes);

/* ---------- MONGO ---------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch(console.error);

/* ---------- START ---------- */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`Wishlist running on ${PORT}`)
);
