import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Matches your Express createToken()
 */
function createToken(userId, env) {
  // same payload: { id }
  return jwt.sign({ id: String(userId) }, env.JWT_SECRET);
}

/**
 * POST /api/user/login
 * body: { email, password }
 */
export async function loginUser(db, request, env) {
  try {
    const { email, password } = await request.json();

    const users = db.collection("users"); // ✅ confirm collection name

    const user = await users.findOne({ email });
    if (!user) {
      return Response.json({
        success: false,
        message: "User doesn't exists",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id, env);
      return Response.json({ success: true, token });
    } else {
      return Response.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: error.message });
  }
}

/**
 * POST /api/user/register
 * body: { name, email, password }
 */
export async function registerUser(db, request, env) {
  try {
    const { name, email, password } = await request.json();

    const users = db.collection("users");

    // user exists?
    const exists = await users.findOne({ email });
    if (exists) {
      return Response.json({ success: false, message: "User already exists" });
    }

    // validate email/password
    if (!validator.isEmail(email)) {
      return Response.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (!password || password.length < 8) {
      return Response.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // insert user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      cartData: {}, // optional: makes cart features smoother
      createdAt: new Date(),
    });

    const token = createToken(result.insertedId, env);

    return Response.json({ success: true, token });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: error.message });
  }
}

/**
 * POST /api/user/admin
 * body: { email, password }
 */
export async function adminLogin(request, env) {
  try {
    const { email, password } = await request.json();

    if (
      email === env.ADMIN_EMAIL &&
      password === env.ADMIN_PASSWORD
    ) {
      // keeping same weird token style you used
      const token = jwt.sign(email + password, env.JWT_SECRET);
      return Response.json({ success: true, token });
    } else {
      return Response.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: error.message });
  }
}
