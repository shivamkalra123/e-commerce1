import { v2 as cloudinary } from "cloudinary";
import productModel from "../../models/productmodel.js";

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
      bestseller: bestseller === "true",
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
          ? bestseller === "true"
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
