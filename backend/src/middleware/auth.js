import jwt from "jsonwebtoken";

export function getTokenFromHeaders(request) {
  const auth = request.headers.get("Authorization") || request.headers.get("authorization");
  const tokenHeader = request.headers.get("token");

  // priority: Authorization: Bearer xxx
  if (auth && auth.startsWith("Bearer ")) {
    return auth.slice(7).trim();
  }

  // if Authorization directly contains token
  if (auth && auth.length > 10) {
    return auth.trim();
  }

  // fallback: token header
  if (tokenHeader && tokenHeader.length > 10) {
    return tokenHeader.trim();
  }

  return null;
}

export function requireUser(request, env) {
  const token = getTokenFromHeaders(request);

  if (!token) {
    // ❌ return 401 (NOT 500)
    throw Response.json(
      { success: false, message: "Not Authorized. Login Again." },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    return {
      id: decoded.id,
      userId: decoded.id,
      ...decoded,
    };
  } catch (err) {
    throw Response.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}
