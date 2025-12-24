import Review from "../models/Review.js";

// GET reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST a review
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: "All fields required" });
    }

    const review = new Review({
      product: req.params.productId,
      user: req.user._id,
      userName: req.user.name,
      rating,
      comment,
    });

    await review.save();
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
