import { MongoClient } from "mongodb";

// ✅ Product routes
import {
  listProducts,
  singleProduct,
  removeProduct,
  addProduct,
  productMeta,
} from "./routes/productRoute.js";

// ✅ User routes
import {
  userLogin,
  userRegister,
  userAdminLogin,
} from "./routes/userRoute.js";

// ✅ Cart routes
import {
  cartGet,
  cartAdd,
  cartUpdate,
} from "./routes/cartRoute.js";

// ✅ Category routes
import { handleCategoryRoutes } from "./routes/categoryRoute.js";

// ✅ Order routes
import {
  orderList,
  orderStatus,
  orderPlace,
  orderStripe,
  orderUserOrders,
  orderVerifyStripe,
} from "./routes/orderRoute.js";

// ✅ Review routes
import { handleReviewRoutes } from "./routes/reviewRoute.js";

// --------------------
// ✅ Mongo cache
// --------------------
let cachedClient = null;
let connectPromise = null;

// ✅ sleep helper
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// ✅ Retry wrapper
async function connectWithRetry(env, retries = 3) {
  let lastErr = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = new MongoClient(env.MONGODB_URI, {
        maxPoolSize: 5,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000,
      });

      // ✅ Hard timeout so request never hangs
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Mongo connect hard timeout")), 15000)
      );

      await Promise.race([client.connect(), timeout]);

      return client; // ✅ success
    } catch (err) {
      lastErr = err;

      console.log(
        `❌ Mongo connect attempt ${attempt}/${retries} failed:`,
        err?.message || err
      );

      // ✅ backoff: 500ms, 1500ms, 3000ms...
      const wait = attempt === 1 ? 500 : attempt === 2 ? 1500 : 3000;
      await sleep(wait);
    }
  }

  throw lastErr;
}

async function getDb(env) {
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI missing in Worker secrets");
  }

  // ✅ If cached and alive use it
  if (cachedClient) {
    try {
      // ✅ ping test (very important)
      await cachedClient.db("admin").command({ ping: 1 });
      return cachedClient.db("E-Commerce");
    } catch (err) {
      console.log("⚠️ Cached Mongo connection dead, reconnecting...");
      cachedClient = null;
    }
  }

  // ✅ Only 1 connection attempt at a time
  if (!connectPromise) {
    connectPromise = (async () => {
      const client = await connectWithRetry(env, 3);
      cachedClient = client;
      return client;
    })().finally(() => {
      connectPromise = null;
    });
  }

  await connectPromise;
  return cachedClient.db("E-Commerce");
}

// --------------------
// ✅ CORS CONFIG (FIXED)
// --------------------
const allowedOrigins = [
  // ✅ production
  "https://brandedparcels.com",
  "https://www.brandedparcels.com",
   // ✅ IMPORTANT

  // ✅ deployed frontends
  "https://e-commerce1-lovat.vercel.app",
  "https://e-commerce1-veng.vercel.app",
  "https://e-commerce1-weme.onrender.com",

  // ✅ local dev
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

// ✅ NEVER return Access-Control-Allow-Origin as empty string.
// If not allowed, don't set it at all.
function corsHeaders(origin) {
  const isAllowed = allowedOrigins.includes(origin);

  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, token",
    "Access-Control-Allow-Credentials": "true",
  };

  if (isAllowed && origin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function withCors(res, origin) {
  const headers = new Headers(res.headers);
  const extra = corsHeaders(origin);

  for (const [k, v] of Object.entries(extra)) {
    if (v) headers.set(k, v);
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

// --------------------
// ✅ Worker Export
// --------------------
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    // ✅ Preflight OPTIONS (VERY IMPORTANT FOR CORS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    try {
      // ✅ health
      if (url.pathname === "/api/health") {
        return withCors(
          Response.json({
            success: true,
            message: "Worker API running ✅",
            time: new Date().toISOString(),
          }),
          origin
        );
      }

      // ✅ root
      if (url.pathname === "/") {
        return withCors(new Response("API working ✅"), origin);
      }

      const db = await getDb(env);

      // --------------------
      // ✅ PRODUCT ROUTES
      // --------------------
      if (url.pathname === "/api/product/list" && request.method === "GET") {
        return withCors(await listProducts(db), origin);
      }

      if (url.pathname === "/api/product/single" && request.method === "POST") {
        return withCors(await singleProduct(db, request), origin);
      }

      if (url.pathname === "/api/product/remove" && request.method === "POST") {
        return withCors(await removeProduct(db, request), origin);
      }

      if (url.pathname === "/api/product/add" && request.method === "POST") {
        return withCors(await addProduct(db, request), origin);
      }
if (url.pathname === "/api/product/meta" && request.method === "GET") {
  const res = await cachedGET(request, 60, async () => productMeta(db));
  return withCors(res, origin);
}



      // --------------------
      // ✅ USER ROUTES
      // --------------------
      if (url.pathname === "/api/user/register" && request.method === "POST") {
        return withCors(await userRegister(db, request, env), origin);
      }

      if (url.pathname === "/api/user/login" && request.method === "POST") {
        return withCors(await userLogin(db, request, env), origin);
      }

      if (url.pathname === "/api/user/admin" && request.method === "POST") {
        return withCors(await userAdminLogin(request, env), origin);
      }

      // --------------------
      // ✅ CART ROUTES
      // --------------------
      if (url.pathname === "/api/cart/get" && request.method === "POST") {
        return withCors(await cartGet(db, request, env), origin);
      }

      if (url.pathname === "/api/cart/add" && request.method === "POST") {
        return withCors(await cartAdd(db, request, env), origin);
      }

      if (url.pathname === "/api/cart/update" && request.method === "POST") {
        return withCors(await cartUpdate(db, request, env), origin);
      }

      // --------------------
      // ✅ CATEGORY ROUTES (HANDLER)
      // --------------------
      const catRes = await handleCategoryRoutes(db, request, env);
      if (catRes) return withCors(catRes, origin);
      // ✅ GET /api/categories/meta

// ✅ Edge cache helper (Cloudflare)
async function cachedGET(request, ttlSeconds, handlerFn) {
  const cache = caches.default;

  // Cache only GET
  if (request.method !== "GET") return handlerFn();

  const cacheKey = new Request(request.url, request);

  // 1) Try cache
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  // 2) Fetch fresh
  const res = await handlerFn();

  // If handler returns null or invalid
  if (!res || !(res instanceof Response)) return res;

  // Cache only successful responses
  if (res.status === 200) {
    const headers = new Headers(res.headers);

    // Cache at edge
    headers.set("Cache-Control", `public, max-age=${ttlSeconds}`);
    headers.set("CDN-Cache-Control", `public, max-age=${ttlSeconds}`);

    const cachedRes = new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });

    // Put in edge cache (async)
    await cache.put(cacheKey, cachedRes.clone());

    return cachedRes;
  }

  return res;
}


      // --------------------
      // ✅ ORDER ROUTES
      // --------------------
      if (url.pathname === "/api/order/list" && request.method === "POST") {
        return withCors(await orderList(db, request, env), origin);
      }

      if (url.pathname === "/api/order/status" && request.method === "POST") {
        return withCors(await orderStatus(db, request, env), origin);
      }

      if (url.pathname === "/api/order/place" && request.method === "POST") {
        return withCors(await orderPlace(db, request, env), origin);
      }

      if (url.pathname === "/api/order/stripe" && request.method === "POST") {
        return withCors(await orderStripe(db, request, env), origin);
      }

      if (url.pathname === "/api/order/userorders" && request.method === "POST") {
        return withCors(await orderUserOrders(db, request, env), origin);
      }

      if (url.pathname === "/api/order/verifyStripe" && request.method === "POST") {
        return withCors(await orderVerifyStripe(db, request, env), origin);
      }

      // --------------------
      // ✅ REVIEW ROUTES (HANDLER)
      // --------------------
      const reviewRes = await handleReviewRoutes(db, request, env);
      if (reviewRes) return withCors(reviewRes, origin);

      // --------------------
      // ❌ Not Found
      // --------------------
      return withCors(
        Response.json({ success: false, message: "Not Found" }, { status: 404 }),
        origin
      );
    } catch (err) {
      console.error("Worker crash:", err);

      // ✅ IMPORTANT: if middleware threw a Response, return it directly
      if (err instanceof Response) {
        return withCors(err, origin);
      }

      return withCors(
        Response.json(
          { success: false, message: err?.message || String(err) },
          { status: 500 }
        ),
        origin
      );
    }
  },
};
