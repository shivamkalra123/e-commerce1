import { ObjectId } from "mongodb";
import Stripe from "stripe";

const deliveryCharge = 10;

const SUPPORTED_CURRENCIES = {
  USD: "usd",
  ZAR: "zar",
  GHS: "ghs",
  EUR: "eur",
  GBP: "gbp",
};

function getStripe(env) {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is missing in environment variables");
  }
  return new Stripe(env.STRIPE_SECRET_KEY);
}

/**
 * POST /api/order/place  (COD)
 */
export async function placeOrder(db, request, env, userIdFromToken) {
  try {
    const body = await request.json();
    const { userId, items, amount, address } = body;

    // ✅ secure: prefer token user id
    const finalUserId = userIdFromToken || userId;

    if (!finalUserId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const orderData = {
      userId: String(finalUserId),
      items: items || [],
      amount: Number(amount || 0),
      address: address || {},
      status: "Order Placed",
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    await db.collection("orders").insertOne(orderData);

    // clear cart
    await db.collection("users").updateOne(
      { _id: new ObjectId(finalUserId) },
      { $set: { cartData: {} } }
    );

    return Response.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: error.message });
  }
}

/**
 * POST /api/order/stripe
 */
export async function placeOrderStripe(db, request, env, userIdFromToken) {
  try {
    const stripe = getStripe(env);

    const body = await request.json();
    const { userId, items, amount, address, currency } = body;

    const finalUserId = userIdFromToken || userId;
    if (!finalUserId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const origin = request.headers.get("origin") || env.FRONTEND_URL || "";

    // currency
    const requestedCode = (currency || "USD").toUpperCase();
    const stripeCurrency = SUPPORTED_CURRENCIES[requestedCode] || "usd";

    // Save order in DB first
    const orderData = {
      userId: String(finalUserId),
      items: items || [],
      amount: Number(amount || 0),
      address: address || {},
      status: "Order Placed",
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
      currency: stripeCurrency,
    };

    const result = await db.collection("orders").insertOne(orderData);
    const orderId = result.insertedId;

    // Stripe line items
    const line_items = (items || []).map((item) => ({
      price_data: {
        currency: stripeCurrency,
        product_data: { name: item.name },
        unit_amount: Math.round(Number(item.price || 0) * 100),
      },
      quantity: Number(item.quantity || 1),
    }));

    // Delivery charge
    line_items.push({
      price_data: {
        currency: stripeCurrency,
        product_data: { name: "Delivery-charges" },
        unit_amount: Math.round(deliveryCharge * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${orderId}`,
      cancel_url: `${origin}/verify?success=false&orderId=${orderId}`,
      line_items,
      mode: "payment",
    });

    return Response.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: error.message });
  }
}

/**
 * POST /api/order/verifyStripe
 * body: { orderId, success, userId }
 */
export async function verifyStripe(db, request, env, userIdFromToken) {
  try {
    const body = await request.json();
    const { orderId, success, userId } = body;

    const finalUserId = userIdFromToken || userId;

    if (!orderId) {
      return Response.json(
        { success: false, message: "orderId required" },
        { status: 400 }
      );
    }

    const oid = new ObjectId(orderId);

    if (success === "true") {
      await db.collection("orders").updateOne(
        { _id: oid },
        { $set: { payment: true } }
      );

      if (finalUserId) {
        await db.collection("users").updateOne(
          { _id: new ObjectId(finalUserId) },
          { $set: { cartData: {} } }
        );
      }

      return Response.json({ success: true });
    } else {
      await db.collection("orders").deleteOne({ _id: oid });
      return Response.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: error.message });
  }
}

/**
 * POST /api/order/list (admin)
 */
export async function allOrders(db) {
  try {
    const orders = await db
      .collection("orders")
      .find({})
      .sort({ date: -1 })
      .toArray();

    return Response.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: error.message });
  }
}

/**
 * POST /api/order/userorders (user)
 * body: { userId } optional, will be taken from token
 */
export async function userOrders(db, request, env, userIdFromToken) {
  try {
    const body = await request.json().catch(() => ({}));
    const finalUserId = userIdFromToken || body.userId;

    if (!finalUserId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await db
      .collection("orders")
      .find({ userId: String(finalUserId) })
      .sort({ date: -1 })
      .toArray();

    return Response.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: error.message });
  }
}

/**
 * POST /api/order/status (admin)
 * body: { orderId, status }
 */
export async function updateStatus(db, request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return Response.json(
        { success: false, message: "orderId and status required" },
        { status: 400 }
      );
    }

    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: String(status) } }
    );

    return Response.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: error.message });
  }
}
