import jwt from "jsonwebtoken";

/**
 * Worker auth middleware (replacement of Express next())
 * Usage:
 *   const user = await requireUser(request, env);
 *   user.id -> userId
 */
export async function requireUser(request, env) {
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

    const decoded = jwt.verify(rawToken, env.JWT_SECRET);

    // return user object
    return {
      id: decoded.id,
      userId: decoded.id, // backward compatibility with old code
      ...decoded,
    };
  } catch (error) {
    console.error("auth error:", error);
    throw Response.json(
      { success: false, message: error.message },
      { status: 401 }
    );
  }
}
