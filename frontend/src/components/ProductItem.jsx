import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductItem = ({ id, image, name, price }) => {
  const { currency, toggleWishlist, wishlist } = useContext(ShopContext);

  // FIXED: wishlist is an array of product ID strings
  const isWishlisted = Array.isArray(wishlist) 
    ? wishlist.includes(id)  // Direct comparison with product ID
    : false;

  return (
    <div className="relative group">
      {/* ❤️ Heart */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(id);
          console.log("❤️ Heart clicked:", id, "Current wishlist:", wishlist);
        }}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow hover:scale-110 transition-transform"
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500 w-5 h-5" />
        ) : (
          <FaRegHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
        )}
      </button>

      <Link
        onClick={() => window.scrollTo(0, 0)}
        className="text-gray-700 cursor-pointer block"
        to={`/product/${id}`}
      >
        <div className="overflow-hidden rounded-lg">
          <img
            className="hover:scale-110 h-60 w-full transition ease-in-out duration-300 object-cover"
            src={image?.[0] || "/placeholder.jpg"}
            alt={name}
            onError={(e) => {
              e.target.src = "/placeholder.jpg";
            }}
          />
        </div>

        <p className="pt-2 pb-1 text-sm font-medium line-clamp-1">{name}</p>
        <p className="text-sm font-semibold text-gray-900">
          {currency}
          {price?.toFixed(2) || "0.00"}
        </p>
      </Link>
      
    
    </div>
  );
};

export default ProductItem;