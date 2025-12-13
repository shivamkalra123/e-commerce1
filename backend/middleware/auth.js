import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const token = req.headers.token || req.headers.authorization;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Login Again." });
  }

  try {
    const rawToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const decoded = jwt.verify(rawToken, process.env.JWT_SECRET);

    // Always create req.user safely
    req.user = {
      id: decoded.id,
      userId: decoded.id, // compatible with older code
      ...decoded
    };

    return next();
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

export default authUser;
