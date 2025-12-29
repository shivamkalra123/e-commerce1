import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  page: { type: String },
  translations: {
    en: { type: String, required: true },
    fr: String,
    de: String,
    nl: String,
    zu: String
  },
  status: {
    type: String,
    enum: ["pending", "translated"],
    default: "pending"
  },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Content", contentSchema);
