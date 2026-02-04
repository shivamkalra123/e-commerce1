import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductItem = ({ id, image, name, price }) => {
  const { currency, toggleWishlist, wishlist } = useContext(ShopContext);

const isWishlisted = Array.isArray(wishlist)
  ? wishlist.some((p) => p.productId === id || p._id === id)
  : false;



  return (
    <div className="relative">
      {/* ❤️ Heart */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(id);
          console.log("❤️ Heart clicked:", id);
        }}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow"
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart />
        )}
      </button>

      <Link
        onClick={() => scrollTo(0, 0)}
        className="text-gray-700 cursor-pointer block"
        to={`/product/${id}`}
      >
        <div className="overflow-hidden">
          <img
            className="hover:scale-110 h-60 w-full transition ease-in-out object-cover"
            src={image[0]}
            alt=""
          />
        </div>

        <p className="pt-2 pb-1 text-sm">{name}</p>
        <p className="text-sm font-medium">
          {currency}
          {price}
        </p>
      </Link>
    </div>
  );
};

export default ProductItem;
