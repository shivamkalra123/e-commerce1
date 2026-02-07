import jwt from "jsonwebtoken";

export const requireAdmin = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const expected = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;

    if (decoded !== expected) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again.",
      });
    }

    next();
  } catch (err) {
    console.error("Admin auth error:", err);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
