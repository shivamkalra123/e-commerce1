import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const deliveryCharge = 10;

const SUPPORTED_CURRENCIES = {
  USD: "usd", // US Dollar
  ZAR: "zar", // South African Rand
  GHS: "ghs", // Ghanaian Cedi
  EUR: "eur", // Euro
  GBP: "gbp", // British Pound
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//cod payment
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address, currency } = req.body;
    const { origin } = req.headers;

    // 1️⃣ Decide which currency to use
    const requestedCode = (currency || "USD").toUpperCase();
    const stripeCurrency = SUPPORTED_CURRENCIES[requestedCode] || "usd";

    // 2️⃣ Save order in DB (amount is in full units, e.g. 33.00)
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
      currency: stripeCurrency, // optional: store it on the order
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // 3️⃣ Build line items for Stripe (minor units: *100)
    const line_items = items.map((item) => ({
      price_data: {
        currency: stripeCurrency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Delivery charge in same currency
    line_items.push({
      price_data: {
        currency: stripeCurrency,
        product_data: {
          name: "Delivery-charges",
        },
        unit_amount: Math.round(deliveryCharge * 100),
      },
      quantity: 1,
    });

    // 4️⃣ Create checkout session
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await orderModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//user order data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Staus Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
};
