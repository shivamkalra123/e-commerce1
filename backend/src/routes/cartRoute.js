import { ObjectId } from "mongodb";
import { requireUser } from "../middleware/auth.js";

/**
 * POST /api/cart/get
 */
export async function cartGet(db, request, env) {
  const user = requireUser(request, env);

  const existing = await db.collection("users").findOne({ _id: new ObjectId(user.id) });

  return Response.json({
    success: true,
    cartData: existing?.cartData || {},
  });
}

/**
 * POST /api/cart/add
 * body: { itemId, size }
 */
export async function cartAdd(db, request, env) {
  const user = requireUser(request, env);
  const body = await request.json();
  const { itemId, size } = body;

  if (!itemId || !size) {
    return Response.json(
      { success: false, message: "itemId and size required" },
      { status: 400 }
    );
  }

  const userDoc = await db.collection("users").findOne({ _id: new ObjectId(user.id) });
  const cartData = userDoc?.cartData && typeof userDoc.cartData === "object" ? userDoc.cartData : {};

  cartData[itemId] ??= {};
  cartData[itemId][size] = (Number(cartData[itemId][size]) || 0) + 1;

  await db.collection("users").updateOne(
    { _id: new ObjectId(user.id) },
    { $set: { cartData } }
  );

  return Response.json({ success: true, message: "Added To Cart", cartData });
}

/**
 * POST /api/cart/update
 * body: { itemId, size, quantity }
 */
export async function cartUpdate(db, request, env) {
  const user = requireUser(request, env);
  const body = await request.json();
  const { itemId, size, quantity } = body;

  const q = Number(quantity);
  if (!itemId || !size || Number.isNaN(q) || q < 0) {
    return Response.json(
      { success: false, message: "Invalid update payload" },
      { status: 400 }
    );
  }

  const userDoc = await db.collection("users").findOne({ _id: new ObjectId(user.id) });
  const cartData = userDoc?.cartData && typeof userDoc.cartData === "object" ? userDoc.cartData : {};

  if (!cartData[itemId]) cartData[itemId] = {};

  if (q === 0) {
    delete cartData[itemId][size];
    if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
  } else {
    cartData[itemId][size] = q;
  }

  await db.collection("users").updateOne(
    { _id: new ObjectId(user.id) },
    { $set: { cartData } }
  );

  return Response.json({ success: true, cartData });
}
