import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  imageUrl: String,
  publicId: String,
  headline: String,
  subtext: String,
  buttonText: String,
  buttonUrl: String,
  visible: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Banner", bannerSchema);
