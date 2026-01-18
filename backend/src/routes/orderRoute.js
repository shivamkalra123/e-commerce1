import { requireUser } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/adminAuth.js";

import {
  placeOrder,
  placeOrderStripe,
  allOrders,
  updateStatus,
  userOrders,
  verifyStripe,
} from "../controllers/orderController.js";

// /api/order/list  (admin)
export async function orderList(db, request, env) {
  await requireAdmin(request, env);
  return allOrders(db);
}

// /api/order/status (admin)
export async function orderStatus(db, request, env) {
  await requireAdmin(request, env);
  return updateStatus(db, request);
}

// /api/order/place (user)
export async function orderPlace(db, request, env) {
  const user = await requireUser(request, env);
  return placeOrder(db, request, env, user.id);
}

// /api/order/stripe (user)
export async function orderStripe(db, request, env) {
  const user = await requireUser(request, env);
  return placeOrderStripe(db, request, env, user.id);
}

// /api/order/userorders (user)
export async function orderUserOrders(db, request, env) {
  const user = await requireUser(request, env);
  return userOrders(db, request, env, user.id);
}

// /api/order/verifyStripe (user)
export async function orderVerifyStripe(db, request, env) {
  const user = await requireUser(request, env);
  return verifyStripe(db, request, env, user.id);
}
