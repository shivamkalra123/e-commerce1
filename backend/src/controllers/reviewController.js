import { ObjectId } from "mongodb";

const COLLECTION = "reviews";

/**
 * GET /api/reviews/:productId
 */
export async function getProductReviews(db, productId) {
  try {
    if (!productId) {
      return Response.json(
        { success: false, message: "productId required" },
        { status: 400 }
      );
    }

    const reviews = await db
      .collection(COLLECTION)
      .find({ product: String(productId) }) // keeping same type as your mongoose schema
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({ success: true, reviews });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews/:productId
 * body: { rating, comment }
 */
export async function addReview(db, request, env, productId, user) {
  try {
    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || !comment) {
      return Response.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );
    }

    const reviewDoc = {
      product: String(productId),
      user: String(user.id), // from token
      userName: user.name || "User", // if token doesn't include name
      rating: Number(rating),
      comment: String(comment),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION).insertOne(reviewDoc);

    const review = await db
      .collection(COLLECTION)
      .findOne({ _id: result.insertedId });

    return Response.json({ success: true, review });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
