import { ObjectId } from "mongodb";

/**
 * GET /api/product/list
 */
export async function listProducts(db) {
  const products = await db.collection("products").find({}).toArray();
  return Response.json({ success: true, products });
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


