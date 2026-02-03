import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Wishlist = () => {
  const { wishlist, toggleWishlist, currency } = useContext(ShopContext);

  if (!wishlist.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Heart size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">Your wishlist is empty</p>

        <Link
          to="/collection"
          className="mt-6 rounded-full bg-black px-6 py-3 text-white text-sm hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold mb-8">My Wishlist</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div key={item._id} className="relative group">
            {/* ❤️ Remove */}
            <button
              onClick={() => toggleWishlist(item._id)}
              className="absolute top-3 right-3 z-10"
            >
              <Heart className="fill-red-500 text-red-500" size={22} />
            </button>

            {/* Image */}
            <Link to={`/product/${item._id}`}>
              <img
                src={item.image?.[0]}
                alt={item.name}
                className="h-64 w-full object-cover rounded-lg group-hover:scale-105 transition"
              />
            </Link>

            {/* Info */}
            <p className="mt-3 text-sm">{item.name}</p>
            <p className="text-sm font-medium">
              {currency}
              {item.price}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Wishlist;
