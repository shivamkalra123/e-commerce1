import jwt from "jsonwebtoken";

export async function requireAdmin(request, env) {
  const tokenHeader = request.headers.get("token");
  const authHeader = request.headers.get("authorization");

  const token = tokenHeader || authHeader;

  if (!token) {
    throw Response.json(
      { success: false, message: "Not Authorized. Login Again." },
      { status: 401 }
    );
  }

  try {
    const rawToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    // because adminLogin signs (email+password) directly
    const decoded = jwt.verify(rawToken, env.JWT_SECRET);

    const expected = env.ADMIN_EMAIL + env.ADMIN_PASSWORD;

    if (decoded !== expected) {
      throw new Error("Not Authorized. Login Again.");
    }

    return true;
  } catch (err) {
    console.error("adminAuth error:", err);
    throw Response.json(
      { success: false, message: err.message },
      { status: 401 }
    );
  }
}
