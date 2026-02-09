import cloudinary from "../config/cloudinary.js";

import productModel from "../models/productModel.js";

/**
 * Helper: calculate discount
 */
function applyDiscount(price, discount) {
  const basePrice = Number(price);
  const discountValue = Math.min(Math.max(Number(discount) || 0, 0), 100);

  const discountedPrice =
    discountValue > 0
      ? Math.round(basePrice - (basePrice * discountValue) / 100)
      : basePrice;

  return {
    price: basePrice,
    discount: discountValue,
    discountedPrice,
    hasDiscount: discountValue > 0,
  };
}

/**
 * ADMIN: ADD PRODUCT
 * POST /api/admin/products
 */
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      sizeType,
      discount,
    } = req.body;

    const images = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0],
    ].filter(Boolean);

    const imagesUrl = await Promise.all(
      images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    let parsedSizes = [];
    if (sizes) {
      try {
        parsedSizes = JSON.parse(sizes);
      } catch {}
    }

    const discountData = applyDiscount(price, discount);

    const product = new productModel({
      name,
      description,
      category,
      subCategory,
      ...discountData,
      bestseller: Boolean(bestseller),

      sizeType: sizeType || "none",
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now(),
    });

    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (err) {
    console.error("addProduct error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ADMIN: UPDATE PRODUCT
 * PUT /api/admin/products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      sizeType,
      discount,
    } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // optional new images
    const images = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0],
    ].filter(Boolean);

    let imagesUrl = product.image;
    if (images.length) {
      imagesUrl = await Promise.all(
        images.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    let parsedSizes = product.sizes;
    if (sizes) {
      try {
        parsedSizes = JSON.parse(sizes);
      } catch {}
    }

    const discountData = applyDiscount(
      price ?? product.price,
      discount ?? product.discount
    );

    Object.assign(product, {
      name: name ?? product.name,
      description: description ?? product.description,
      category: category ?? product.category,
      subCategory: subCategory ?? product.subCategory,
      ...discountData,
      bestseller:
  bestseller !== undefined
    ? Boolean(bestseller)
    : product.bestseller,

      sizeType: sizeType ?? product.sizeType,
      sizes: parsedSizes,
      image: imagesUrl,
      updatedAt: new Date(),
    });

    await product.save();

    res.json({ success: true, message: "Product Updated" });
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * ADMIN: REMOVE PRODUCT
 * DELETE /api/admin/products/:id
 */
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await productModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Product Removed" });
  } catch (err) {
    console.error("removeProduct error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
export const listProducts = async (req, res) => {
  try {
    console.log("🔍 [listProducts] Starting...");
    
    let products = await productModel
      .find({})
      .sort({ updatedAt: -1, date: -1 });

    console.log(`📦 [listProducts] Found ${products.length} products from database`);
    
    // ✅ PROCESS PRODUCTS TO ENSURE ALL FIELDS EXIST
    products = products.map((product, index) => {
      console.log(`\n🎯 [listProducts] Processing product ${index + 1}/${products.length}:`, {
        id: product._id,
        name: product.name,
        rawPrice: product.price,
        rawDiscount: product.discount,
        rawDiscountedPrice: product.discountedPrice,
        rawHasDiscount: product.hasDiscount,
      });
      
      const productObj = product.toObject ? product.toObject() : product;
      
      console.log(`📋 [listProducts] Product object keys:`, Object.keys(productObj));
      
      // Ensure discount field exists (might be missing in old products)
      const discount = productObj.discount || 0;
      const price = productObj.price || 0;
      
      console.log(`💰 [listProducts] Price: ${price}, Discount: ${discount}%`);
      
      // Calculate discounted price if not present
      let discountedPrice = productObj.discountedPrice;
      let hasDiscount = productObj.hasDiscount;
      
      console.log(`🧮 [listProducts] Initial values - discountedPrice: ${discountedPrice}, hasDiscount: ${hasDiscount}`);
      
      if (discount > 0 && discount <= 100) {
        console.log(`✅ [listProducts] Product HAS discount: ${discount}%`);
        
        // Recalculate if not present or if price/discount changed
        if (!discountedPrice || discountedPrice === price) {
          const calculatedDiscount = Math.round(price - (price * discount / 100));
          console.log(`🧮 [listProducts] Calculating discounted price: ${price} - (${price} * ${discount}%) = ${calculatedDiscount}`);
          discountedPrice = calculatedDiscount;
        }
        hasDiscount = true;
      } else {
        console.log(`❌ [listProducts] Product has NO discount (or invalid: ${discount}%)`);
        discountedPrice = price;
        hasDiscount = false;
      }
      
      console.log(`🎯 [listProducts] Final values:`);
      console.log(`   - Discount: ${discount}%`);
      console.log(`   - Price: $${price}`);
      console.log(`   - Discounted Price: $${discountedPrice}`);
      console.log(`   - Has Discount: ${hasDiscount}`);
      console.log(`   - Should show ribbon: ${hasDiscount && discount > 0 ? 'YES 🎀' : 'NO'}`);
      
      const processedProduct = {
        ...productObj,
        discount,
        discountedPrice,
        hasDiscount,
        // Ensure other fields exist with defaults
        image: productObj.image || [],
        sizes: productObj.sizes || [],
        bestseller: productObj.bestseller || false,
        isActive: productObj.isActive !== false, // default to true
      };
      
      return processedProduct;
    });

    // 🎯 DEBUG: Summary of all products
    console.log("\n📊 [listProducts] SUMMARY OF ALL PRODUCTS:");
    console.log(`Total products: ${products.length}`);
    
    const productsWithDiscount = products.filter(p => p.hasDiscount && p.discount > 0);
    console.log(`Products with discount: ${productsWithDiscount.length}`);
    
    if (productsWithDiscount.length > 0) {
      console.log("📋 Products with discount details:");
      productsWithDiscount.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}: $${p.price} → $${p.discountedPrice} (${p.discount}% off)`);
      });
    } else {
      console.log("⚠️ WARNING: No products have discounts!");
      
      // Show first 3 products for debugging
      console.log("\n🔍 Sample products (first 3):");
      products.slice(0, 3).forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}:`);
        console.log(`   Price: $${p.price}`);
        console.log(`   Discount: ${p.discount}%`);
        console.log(`   Discounted Price: $${p.discountedPrice}`);
        console.log(`   Has Discount: ${p.hasDiscount}`);
      });
    }

    res.json({
      success: true,
      count: products.length,
      products,
      debug: { // Add debug info to response
        total: products.length,
        withDiscount: productsWithDiscount.length,
        sample: products.slice(0, 3).map(p => ({
          name: p.name,
          price: p.price,
          discount: p.discount,
          discountedPrice: p.discountedPrice,
          hasDiscount: p.hasDiscount
        }))
      }
    });
  } catch (err) {
    console.error("❌ [listProducts] Error:", err);
    console.error("❌ [listProducts] Error stack:", err.stack);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};