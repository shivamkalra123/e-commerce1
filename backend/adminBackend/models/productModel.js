import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    // Pricing
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },

    discountedPrice: {
      type: Number,
      default: function() {
        return this.price;
      },
      min: [0, "Discounted price cannot be negative"],
    },

    hasDiscount: {
      type: Boolean,
      default: false,
    },

    // Category & Classification
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      index: true,
    },

    subCategory: {
      type: String,
      trim: true,
      default: "",
      // Optional field - no required validation
    },

    // Images
    image: {
      type: [String], // Array of image URLs
      default: [],
      validate: {
        validator: function(images) {
          // At least one image is required
          return images && images.length > 0;
        },
        message: "At least one product image is required",
      },
    },

    // Sizes & Dimensions
    sizeType: {
      type: String,
      enum: ["clothing", "footwear", "none", "other"],
      default: "none",
    },

    sizes: {
      type: [
        {
          size: {
            type: String,
            required: true,
            trim: true,
          },
          quantity: {
            type: Number,
            default: 0,
            min: [0, "Quantity cannot be negative"],
          },
          inStock: {
            type: Boolean,
            default: true,
          },
        },
      ],
      default: [],
    },

    // Product Status & Flags
    bestseller: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Inventory & Tracking
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Additional optional fields you might need
    brand: {
      type: String,
      trim: true,
      default: "",
    },

    colors: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    // Ratings & Reviews (if you plan to add later)
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be less than 0"],
        max: [5, "Rating cannot exceed 5"],
      },
      count: {
        type: Number,
        default: 0,
        min: [0, "Rating count cannot be negative"],
      },
    },

    // Metadata
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Timestamps (auto-managed)
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for checking if product is in stock
productSchema.virtual("inStock").get(function() {
  if (this.sizes && this.sizes.length > 0) {
    return this.sizes.some(size => size.quantity > 0);
  }
  return this.stock > 0;
});

// Virtual for total available quantity
productSchema.virtual("totalQuantity").get(function() {
  if (this.sizes && this.sizes.length > 0) {
    return this.sizes.reduce((total, size) => total + size.quantity, 0);
  }
  return this.stock;
});

// Pre-save middleware to calculate discounted price
productSchema.pre("save", function(next) {
  if (this.isModified("price") || this.isModified("discount")) {
    const discountValue = Math.min(Math.max(Number(this.discount) || 0, 0), 100);
    this.discountedPrice = discountValue > 0 
      ? Math.round(this.price - (this.price * discountValue) / 100)
      : this.price;
    this.hasDiscount = discountValue > 0;
  }
  next();
});

// Indexes for better query performance
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ discountedPrice: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ "ratings.average": -1 });

// Static method to find discounted products
productSchema.statics.findDiscounted = function() {
  return this.find({ hasDiscount: true, isActive: true });
};

// Static method to find bestsellers
productSchema.statics.findBestsellers = function() {
  return this.find({ bestseller: true, isActive: true });
};

// Static method to find by category
productSchema.statics.findByCategory = function(category, subCategory = null) {
  const query = { category, isActive: true };
  if (subCategory) {
    query.subCategory = subCategory;
  }
  return this.find(query);
};

// Instance method to update stock
productSchema.methods.updateStock = function(size = null, quantity) {
  if (this.sizes && this.sizes.length > 0 && size) {
    const sizeObj = this.sizes.find(s => s.size === size);
    if (sizeObj) {
      sizeObj.quantity = Math.max(0, quantity);
      sizeObj.inStock = sizeObj.quantity > 0;
    }
  } else {
    this.stock = Math.max(0, quantity);
  }
  return this.save();
};

const Product = mongoose.model("Product", productSchema);

export default Product;