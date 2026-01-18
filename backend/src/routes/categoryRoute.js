import { requireUser } from "../middleware/auth.js";
import * as ctrl from "../controllers/categoryController.js";

/**
 * CATEGORY ROUTES (Workers)
 *
 * GET    /api/categories
 * POST   /api/categories
 * POST   /api/categories/:id/subcategories
 * PUT    /api/categories/:id
 * DELETE /api/categories/:id
 * DELETE /api/categories/:id/subcategories/:sub
 */
export async function handleCategoryRoutes(db, request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  // We assume categories base path:
  // /api/categories
  // /api/categories/...
  if (!path.startsWith("/api/categories")) return null;

  const method = request.method.toUpperCase();

  // Split path parts
  // "/api/categories/123/subcategories/abc"
  const parts = path.split("/").filter(Boolean);
  // parts example:
  // ["api","categories"]
  // ["api","categories",":id"]
  // ["api","categories",":id","subcategories"]
  // ["api","categories",":id","subcategories",":sub"]

  // ✅ GET /api/categories
  if (parts.length === 2 && method === "GET") {
    return ctrl.getAll(db, request, env);
  }

  // ✅ POST /api/categories (auth)
  if (parts.length === 2 && method === "POST") {
    await requireUser(request, env); // just validate token
    return ctrl.createCategory(db, request, env);
  }

  // from here, we have id
  const id = parts[2];

  // ✅ PUT /api/categories/:id (auth)
  if (parts.length === 3 && method === "PUT") {
    await requireUser(request, env);
    return ctrl.updateCategory(db, request, env, id);
  }

  // ✅ DELETE /api/categories/:id (auth)
  if (parts.length === 3 && method === "DELETE") {
    await requireUser(request, env);
    return ctrl.deleteCategory(db, request, env, id);
  }

  // ✅ POST /api/categories/:id/subcategories (auth)
  if (parts.length === 4 && parts[3] === "subcategories" && method === "POST") {
    await requireUser(request, env);
    return ctrl.addSubcategory(db, request, env, id);
  }

  // ✅ DELETE /api/categories/:id/subcategories/:sub (auth)
  if (
    parts.length === 5 &&
    parts[3] === "subcategories" &&
    method === "DELETE"
  ) {
    await requireUser(request, env);
    const sub = decodeURIComponent(parts[4]);
    return ctrl.deleteSubcategory(db, request, env, id, sub);
  }

  return Response.json({ success: false, message: "Not Found" }, { status: 404 });
}
