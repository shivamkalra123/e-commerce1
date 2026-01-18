import { addToCart, getUserCart, updateCart } from "../controllers/cartController.js";
import { requireUser } from "../middleware/auth.js";

// POST /api/cart/get
export async function cartGet(db, request, env) {
  const userId = await requireUser(request, env);
  return getUserCart(db, request, env, userId);
}

// POST /api/cart/add
export async function cartAdd(db, request, env) {
  const userId = await requireUser(request, env);
  return addToCart(db, request, env, userId);
}

// POST /api/cart/update
export async function cartUpdate(db, request, env) {
  const userId = await requireUser(request, env);
  return updateCart(db, request, env, userId);
}
