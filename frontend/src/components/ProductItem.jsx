import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductItem = (props) => {
  const { currency, toggleWishlist, wishlist } = useContext(ShopContext);

  const {
    id,
    image = [],
    name = "",
    price = 0,
    discount = 0,
  } = props;

  const priceNum = Number(price);
  const discountNum = Number(discount);

  const hasDiscount = discountNum > 0 && discountNum <= 100;

  const discountedPrice = hasDiscount
    ? Math.round((priceNum - (priceNum * discountNum) / 100) * 100) / 100
    : priceNum;

  const isWishlisted = Array.isArray(wishlist) && wishlist.includes(id);

  // Convert everything to numbers

  const discountedPriceNum = Number(discountedPrice) || priceNum;
  
  // Simple condition: if discount > 0, show ribbon
  const showRibbon = discountNum > 0;
  
  // Calculate display price
  const displayPrice = showRibbon ? discountedPriceNum : priceNum;
  
  console.log(`🎯 ${name}: discount=${discountNum}, showRibbon=${showRibbon}`);

  return (
    <div className="relative group">
      {/* 🎯 ALWAYS SHOW TEST RIBBON FOR DEBUGGING */}
      

      {/* ❤️ Wishlist */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(id);
        }}
        className="absolute top-2 right-2 z-20 bg-white rounded-full p-2 shadow hover:scale-110 transition"
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500 w-5 h-5" />
        ) : (
          <FaRegHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
        )}
      </button>

      {/* 🎀 Discount Ribbon - SIMPLE CONDITION */}
      {showRibbon && (
        <div className="absolute top-2 left-2 z-10 animate-bounce">
          <div className="relative">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 py-1 text-sm font-extrabold rounded-full shadow-xl">
              SALE! {Math.round(discountNum)}% OFF
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-red-600 border-r-[10px] border-r-transparent" />
          </div>
        </div>
      )}

      <Link to={`/product/${id}`} className="block text-gray-700">
        <div className="overflow-hidden rounded-lg">
          <img
            src={image[0] || "/placeholder.jpg"}
            alt={name}
            className="h-60 w-full object-cover transition group-hover:scale-110"
          />
        </div>

        <p className="pt-2 text-sm font-medium line-clamp-1">{name}</p>

        {/* 💰 Price */}
        <div className="flex items-center gap-2">
          <p className={`text-lg font-bold ${showRibbon ? 'text-green-600' : 'text-gray-900'}`}>
            {currency}
            {displayPrice.toFixed(2)}
          </p>

          {showRibbon && priceNum > displayPrice && (
            <p className="text-sm text-gray-500 line-through">
              {currency}
              {priceNum.toFixed(2)}
            </p>
          )}
        </div>

        {/* 💸 Savings */}
        {showRibbon && priceNum > displayPrice && (
          <span className="inline-block mt-2 px-3 py-1 text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full border border-green-300">
            🔥 Save {currency}{(priceNum - displayPrice).toFixed(2)}
          </span>
        )}
      </Link>
    </div>
  );
};

export default ProductItem;