import { ObjectId } from "mongodb";

/**
 * ADMIN: Get all orders
 */
export async function allOrders(db) {
  try {
    const orders = await db
      .collection("orders")
      .find({})
      .sort({ date: -1 })
      .toArray();

    return Response.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: err.message });
  }
}

/**
 * ADMIN: Update order status
 */
export async function updateStatus(db, request) {
  try {
    const { orderId, status } = await request.json();

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
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: err.message });
  }
}
