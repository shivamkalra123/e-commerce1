import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: [{
    type: String,
  }],
  category: {
    type: String,
  },
  subCategory: {
    type: String,
  },
  sizes: [{
    type: String,
  }],
  bestseller: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Number,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model("Product", productSchema);

export default Product;