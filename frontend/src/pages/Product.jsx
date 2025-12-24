import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import AuthModal from "../components/AuthModal";

const Product = () => {
  const { productId } = useParams();
  const backend = import.meta.env.VITE_BACKEND_URL;

  const { products, currency, addToCart, token } =
    useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Auth modal
  const [showAuthModal, setShowAuthModal] = useState(false);

  /* ===================== FETCH PRODUCT ===================== */
  useEffect(() => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]);
    }
  }, [productId, products]);

  /* ===================== FETCH REVIEWS ===================== */
  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${backend}/api/reviews/${productId}`
      );
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  /* ===================== SUBMIT REVIEW ===================== */
  const submitReview = async () => {
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    if (!comment.trim()) return;

    try {
      await axios.post(
        `${backend}/api/reviews/${productId}`,
        { rating, comment },
        { headers: { token } }
      );

      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  if (!productData) return <div className="opacity-0" />;

  return (
    <>
      <div className="border-t-2 pt-10 transition-opacity duration-500 opacity-100">
        {/* ===================== PRODUCT DATA ===================== */}
        <div className="flex flex-col sm:flex-row gap-12">

          {/* IMAGES */}
          <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">
            <div className="flex sm:flex-col sm:w-[18%] overflow-x-auto sm:overflow-y-auto">
              {productData.image.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setImage(img)}
                  className="w-[24%] sm:w-full cursor-pointer mb-2"
                  alt=""
                />
              ))}
            </div>
            <div className="sm:w-[80%]">
              <img src={image} className="w-full h-auto" alt="" />
            </div>
          </div>

          {/* INFO */}
          <div className="flex-1">
            <h1 className="text-2xl font-medium">{productData.name}</h1>

            <div className="flex items-center gap-1 mt-2">
              {[...Array(4)].map((_, i) => (
                <img key={i} src={assets.star_icon} className="w-3" />
              ))}
              <img src={assets.star_dull_icon} className="w-3" />
              <p className="pl-2 text-sm">( {reviews.length} )</p>
            </div>

            <p className="mt-5 text-3xl font-medium">
              {currency}
              {productData.price}
            </p>

            <p className="mt-5 text-gray-500 md:w-4/5">
              {productData.description}
            </p>

            {/* SIZE */}
            <div className="my-8">
              <p className="mb-2">Select Size</p>
              <div className="flex gap-2">
                {productData.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`border px-4 py-2 ${
                      size === s ? "border-orange-500" : "bg-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => addToCart(productData._id, size)}
              className="bg-black text-white px-8 py-3 text-sm"
            >
              ADD TO CART
            </button>

            <hr className="mt-8 sm:w-4/5" />

            <div className="text-sm text-gray-500 mt-5 space-y-1">
              <p>100% Original product</p>
              <p>Cash on delivery available</p>
              <p>7 days easy return</p>
            </div>
          </div>
        </div>

        {/* ===================== REVIEWS ===================== */}
        <div className="mt-20">
          <div className="flex border-b">
            <b className="px-5 py-3 text-sm">Reviews ({reviews.length})</b>
          </div>

          {/* REVIEW LIST */}
          <div className="mt-6 space-y-6">
            {reviews.map((rev) => (
              <div key={rev._id} className="border p-4 rounded-md">
                <div className="flex justify-between">
                  <p className="font-medium">{rev.userName}</p>
                  <p className="text-sm">⭐ {rev.rating}/5</p>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>

          {/* ADD REVIEW */}
          <div className="mt-8 border p-5 rounded-md">
            <h3 className="font-medium mb-3">Write a review</h3>

            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="border px-3 py-2 mb-3"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Stars
                </option>
              ))}
            </select>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience"
              className="border w-full p-3 mb-3"
            />

            <button
              onClick={submitReview}
              className="bg-black text-white px-6 py-2"
            >
              Submit Review
            </button>
          </div>
        </div>

        {/* RELATED */}
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>

      {/* AUTH MODAL */}
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Product;
