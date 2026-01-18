import { requireUser } from "../middleware/auth.js";
import * as ctrl from "../controllers/reviewController.js";

/**
 * Reviews route handler
 * GET  /api/reviews/:productId
 * POST /api/reviews/:productId  (auth)
 */
export async function handleReviewRoutes(db, request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (!path.startsWith("/api/reviews")) return null;

  const method = request.method.toUpperCase();
  const parts = path.split("/").filter(Boolean);
  // parts: ["api","reviews",":productId"]

  const productId = parts[2];

  // GET /api/reviews/:productId
  if (parts.length === 3 && method === "GET") {
    return ctrl.getProductReviews(db, productId);
  }

  // POST /api/reviews/:productId (auth)
  if (parts.length === 3 && method === "POST") {
    const user = await requireUser(request, env);
    return ctrl.addReview(db, request, env, productId, user);
  }

  return Response.json({ success: false, message: "Not Found" }, { status: 404 });
}
