import { ObjectId } from "mongodb";




/**
 * GET /api/product/list
 */
export async function listProducts(db) {
  const products = await db.collection("products").find({}).toArray();
  
  // ✅ ADD DISCOUNT PROCESSING HERE
  const processedProducts = products.map(product => {
    const discount = product.discount || 0;
    const price = product.price || 0;
    
    let discountedPrice = price;
    let hasDiscount = false;
    
    if (discount > 0 && discount <= 100) {
      discountedPrice = Math.round(price - (price * discount / 100));
      hasDiscount = true;
    }
    
    return {
      ...product,
      discount,
      discountedPrice,
      hasDiscount,
      // Ensure other fields exist
      image: product.image || [],
      sizes: product.sizes || [],
      bestseller: product.bestseller || false,
      subCategory: product.subCategory || "",
    };
  });
  
  // 🎯 DEBUG LOGGING
  console.log("🔍 [API Backend] listProducts:");
  console.log(`📦 Total products: ${processedProducts.length}`);
  
  const productsWithDiscount = processedProducts.filter(p => p.hasDiscount);
  console.log(`🎯 Products with discount: ${productsWithDiscount.length}`);
  
  if (productsWithDiscount.length > 0) {
    console.log("📋 Discounted products:");
    productsWithDiscount.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}: $${p.price} → $${p.discountedPrice} (${p.discount}% off)`);
    });
  } else {
    console.log("⚠️ No products have discounts in API backend!");
    
    // Show first 3 products structure
    console.log("\n🔍 Sample products (first 3):");
    processedProducts.slice(0, 3).forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}:`);
      console.log(`   Price: $${p.price}`);
      console.log(`   Discount: ${p.discount}%`);
      console.log(`   Discounted Price: $${p.discountedPrice}`);
      console.log(`   Has Discount: ${p.hasDiscount}`);
      console.log(`   All fields:`, Object.keys(p));
    });
  }
  
  return Response.json({ 
    success: true, 
    products: processedProducts,
    debug: { // Add debug info
      total: processedProducts.length,
      withDiscount: productsWithDiscount.length,
      sample: processedProducts.slice(0, 3).map(p => ({
        name: p.name,
        price: p.price,
        discount: p.discount,
        discountedPrice: p.discountedPrice,
        hasDiscount: p.hasDiscount
      }))
    }
  });
}

/**
 * POST /api/product/single
 * body: { productId }
 */
export async function singleProduct(db, request) {
  const body = await request.json();
  const { productId } = body;

  if (!productId) {
    return Response.json(
      { success: false, message: "productId is required" },
      { status: 400 }
    );
  }

  const product = await db
    .collection("products")
    .findOne({ _id: new ObjectId(productId) });

  return Response.json({ success: true, product });
}
export async function productMeta(db) {
  // total products count
  const count = await db.collection("products").countDocuments();

  // latest updated (preferred)
  const latestDoc = await db
    .collection("products")
    .find({})
    .project({ updatedAt: 1, date: 1 }) // keep lightweight
    .sort({ updatedAt: -1, date: -1 })  // fallback to date
    .limit(1)
    .toArray();

  const latest = latestDoc?.[0] || null;

  return Response.json({
    success: true,
    count,
    latestUpdatedAt: latest?.updatedAt || latest?.date || null,
  });
}

/**
 * POST /api/product/remove
 * body: { id }
 */
export async function removeProduct(db, request) {
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return Response.json(
      { success: false, message: "id is required" },
      { status: 400 }
    );
  }

  await db.collection("products").deleteOne({ _id: new ObjectId(id) });

  return Response.json({ success: true, message: "Product Removed" });
}

/**
 * POST /api/product/add
 * body: {
 *  name, description, price, category, subCategory,
 *  sizes, bestseller, sizeType,
 *  image: [url1, url2...]
 * }
 *
 * NOTE: Images must already be uploaded to Cloudinary.
 */
export async function addProduct(db, request) {
  const body = await request.json();

  const {
    name,
    description,
    price,
    category,
    subCategory,
    sizes,
    bestseller,
    sizeType,
    image,
  } = body;

  if (!name || !description || price == null || !category) {
    return Response.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  // ✅ sizes safe handling
  let parsedSizes = [];
  if (Array.isArray(sizes)) parsedSizes = sizes;

  const productData = {
    name,
    description,
    category,
    subCategory: subCategory || "",
    price: Number(price),
    bestseller: bestseller === true || bestseller === "true",
    sizeType: sizeType || "none",
    sizes: parsedSizes,
    image: Array.isArray(image) ? image : [],
    date: Date.now(),
    __v: 0,
  };

  await db.collection("products").insertOne(productData);

  return Response.json({ success: true, message: "Product Added" });
}


