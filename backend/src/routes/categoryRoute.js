import { requireUser } from "../middleware/auth.js";
import * as ctrl from "../controllers/categoryController.js";

/**
 * CATEGORY ROUTES (Workers)
 *
 * GET    /api/categories
 * GET    /api/categories/meta              ✅ NEW
 * POST   /api/categories
 * POST   /api/categories/:id/subcategories
 * PUT    /api/categories/:id
 * DELETE /api/categories/:id
 * DELETE /api/categories/:id/subcategories/:sub
 * 
 */

async function cachedGET(request, ttlSeconds, handlerFn) {
  const cache = caches.default;

  if (request.method !== "GET") return handlerFn();

  const cacheKey = new Request(request.url, request);

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const res = await handlerFn();

  if (!res || !(res instanceof Response)) return res;

  if (res.status === 200) {
    const headers = new Headers(res.headers);
    headers.set("Cache-Control", `public, max-age=${ttlSeconds}`);
    headers.set("CDN-Cache-Control", `public, max-age=${ttlSeconds}`);

    const cachedRes = new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });

    await cache.put(cacheKey, cachedRes.clone());
    return cachedRes;
  }

  return res;
}

export async function handleCategoryRoutes(db, request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  // only handle category routes
  if (!path.startsWith("/api/categories")) return null;

  const method = request.method.toUpperCase();

  // Split path parts
  // "/api/categories/123/subcategories/abc"
  const parts = path.split("/").filter(Boolean);

  // ✅ GET /api/categories
  if (parts.length === 2 && method === "GET") {
    return ctrl.getAll(db, request, env);
  }

  // ✅ GET /api/categories/meta  ✅✅✅
  // IMPORTANT: must be before treating parts[2] as an ID
if (parts.length === 3 && parts[2] === "meta" && method === "GET") {
  return cachedGET(request, 60, async () => ctrl.categoriesMeta(db));
}

  // ✅ POST /api/categories (auth)
  if (parts.length === 2 && method === "POST") {
    await requireUser(request, env); // validate token only
    return ctrl.createCategory(db, request, env);
  }

  // from here, we have id
  const id = parts[2];

  // ✅ PUT /api/categories/:id (auth)
  if (parts.length === 3 && method === "PUT") {
    await requireUser(request, env);
    return ctrl.updateCategory(db, request, env, id);
  }
// ✅ GET /api/categories/meta

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

  return Response.json(
    { success: false, message: "Not Found" },
    { status: 404 }
  );
}
