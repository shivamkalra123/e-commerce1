import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import {
  Link,
  NavLink,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { Trans } from "@lingui/macro";
import { Heart, Loader2 } from "lucide-react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";
  const isCollection = location.pathname === "/collection";
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    categories,
    loadingCategories,
    getCategoriesData,
    fetchWishlist, // Use the context function
    wishlist, // Wishlist IDs from context
    toggleWishlist, // Toggle function from context
  } = useContext(ShopContext);

  const selectedCategories = searchParams.get("categories")
    ? searchParams.get("categories").split(",")
    : [];

  // API Base URL
  const WISHLIST_API = "https://e-commerce1-1-cd8g.onrender.com";

  // Fetch wishlist with product details
  const fetchWishlistWithProducts = async () => {
    if (!token) {
      setWishlistProducts([]);
      return;
    }

    try {
      setLoadingWishlist(true);
      
      // First, fetch the wishlist IDs from context or directly
      // The context already fetches wishlist, but we need product details
      
      if (!wishlist || wishlist.length === 0) {
        setWishlistProducts([]);
        setLoadingWishlist(false);
        return;
      }
      
      // Fetch product details for all product IDs in wishlist
      const productsRes = await fetch(`${WISHLIST_API}/api/products/by-ids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds: wishlist }),
      });
      
      const productsData = await productsRes.json();
      
      if (productsData.success) {
        setWishlistProducts(productsData.products || []);
      } else {
        setWishlistProducts([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist products:', error);
      setWishlistProducts([]);
    } finally {
      setLoadingWishlist(false);
    }
  };

  // Handle wishlist item removal
  const handleRemoveFromWishlist = async (productId, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    try {
      // Optimistic update: remove from local state immediately
      setWishlistProducts(prev => prev.filter(item => item._id !== productId));
      
      // Call the toggle function from context
      await toggleWishlist(productId);
      
      // Refresh the context wishlist
      fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Re-fetch on error
      fetchWishlistWithProducts();
    }
  };

  // Initialize and refresh wishlist when token or wishlist changes
  useEffect(() => {
    if (token && wishlist && wishlist.length > 0) {
      fetchWishlistWithProducts();
    } else {
      setWishlistProducts([]);
    }
  }, [token, wishlist]);

  // Refresh wishlist when dropdown opens
  useEffect(() => {
    if (wishlistOpen && token) {
      fetchWishlistWithProducts();
    }
  }, [wishlistOpen]);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setWishlistProducts([]);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!categories.length) getCategoriesData();
  }, [categories.length]);

  const showCategoryBar = isCollection || scrolled;

  const toggleCategoryInUrl = (catName) => {
    const params = Object.fromEntries([...searchParams]);
    let current = params.categories ? params.categories.split(",") : [];

    if (current.includes(catName)) current = current.filter((c) => c !== catName);
    else current = [...current, catName];

    if (current.length) params.categories = current.join(",");
    else delete params.categories;

    delete params.subcategories;

    navigate("/collection");
    setSearchParams(params);
  };

  const navLinkClass = ({ isActive }) =>
    `text-xs tracking-wide transition ${
      isHome && !scrolled
        ? isActive
          ? "text-white"
          : "text-white/80 hover:text-white"
        : isActive
        ? "text-black"
        : "text-gray-600 hover:text-black"
    }`;

  return (
    <>
      <header
        className={`w-full z-50 transition-all duration-300 ${
          isHome ? "fixed top-0 left-0" : "sticky top-0"
        } ${
          isHome
            ? scrolled
              ? "bg-white shadow-sm"
              : "bg-transparent"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-3">

          <Link to="/">
            <img
              src="/logo.png"
              alt="Logo"
              className={`w-42 transition ${isHome && !scrolled ? "invert" : ""}`}
            />
          </Link>

          <ul className="hidden sm:flex gap-8">
            <NavLink to="/" className={navLinkClass}><Trans>HOME</Trans></NavLink>
            <NavLink to="/collection" className={navLinkClass}><Trans>COLLECTION</Trans></NavLink>
            <NavLink to="/about" className={navLinkClass}><Trans>ABOUT</Trans></NavLink>
            <NavLink to="/contact" className={navLinkClass}><Trans>CONTACT</Trans></NavLink>
          </ul>

          <div className="flex items-center gap-5">

            {/* SEARCH */}
            <img
              src={assets.search_icon}
              onClick={() => {
                setShowSearch(true);
                navigate("/collection");
              }}
              className={`w-5 cursor-pointer transition ${
                isHome && !scrolled
                  ? "invert opacity-90"
                  : "opacity-70 hover:opacity-100"
              }`}
              alt=""
            />

            {/* WISHLIST */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!token) {
                    navigate("/login");
                    return;
                  }
                  setWishlistOpen((p) => !p);
                }}
                className="relative"
                disabled={loadingWishlist}
              >
                {loadingWishlist ? (
                  <Loader2 size={20} className="animate-spin text-gray-500" />
                ) : (
                  <Heart
                    size={20}
                    className={`cursor-pointer transition ${
                      isHome && !scrolled
                        ? "text-white"
                        : wishlistProducts.length > 0
                        ? "text-red-500 fill-red-500"
                        : "text-gray-600 hover:text-black"
                    }`}
                  />
                )}

                {wishlistProducts.length > 0 && (
                  <span className="absolute -right-2 -bottom-2 w-4 h-4 text-[9px] flex items-center justify-center rounded-full bg-black text-white">
                    {wishlistProducts.length}
                  </span>
                )}
              </button>

              {wishlistOpen && (
                <>
                  {/* backdrop click close */}
                  <div
                    onClick={() => setWishlistOpen(false)}
                    className="fixed inset-0 z-30"
                  />

                  <div className="absolute right-0 top-full pt-3 z-40">
                    <div className="w-80 bg-white shadow-xl rounded-xl border">
                      <div className="p-3 border-b">
                        <h3 className="font-medium">My Wishlist</h3>
                        <p className="text-xs text-gray-500">
                          {wishlistProducts.length} items
                        </p>
                      </div>
                      
                      {!token ? (
                        <div className="p-4">
                          <p className="text-sm text-gray-500 mb-2">
                            Please login to view wishlist
                          </p>
                          <button
                            onClick={() => {
                              setWishlistOpen(false);
                              navigate("/login");
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Login
                          </button>
                        </div>
                      ) : loadingWishlist ? (
                        <div className="p-6 flex flex-col items-center justify-center">
                          <Loader2 className="animate-spin text-gray-400 mb-2" size={24} />
                          <p className="text-sm text-gray-500">Loading wishlist...</p>
                        </div>
                      ) : wishlistProducts.length === 0 ? (
                        <div className="p-6 text-center">
                          <Heart className="mx-auto text-gray-300 mb-2" size={32} />
                          <p className="text-sm text-gray-500">Your wishlist is empty</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Save items you love for later
                          </p>
                          <button
                            onClick={() => {
                              setWishlistOpen(false);
                              navigate("/collection");
                            }}
                            className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Browse Collection
                          </button>
                        </div>
                      ) : (
                        <div className="max-h-80 overflow-y-auto">
                          {wishlistProducts.map((product) => (
                            <div
                              key={product._id}
                              className="flex items-center gap-3 p-3 border-b last:border-none hover:bg-gray-50 group"
                            >
                              <div className="w-14 h-14 flex-shrink-0">
                                <img
                                  src={product.image?.[0] || "/placeholder.jpg"}
                                  className="w-full h-full object-cover rounded"
                                  alt={product.name}
                                  onError={(e) => {
                                    e.target.src = "/placeholder.jpg";
                                  }}
                                />
                              </div>

                              <div
                                onClick={() => {
                                  setWishlistOpen(false);
                                  navigate(`/product/${product._id}`);
                                }}
                                className="flex-1 cursor-pointer min-w-0"
                              >
                                <p className="text-sm font-medium line-clamp-1">
                                  {product.name}
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  ${product.price?.toFixed(2) || "0.00"}
                                </p>
                                {product.category && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {product.category}
                                    {product.subCategory && ` • ${product.subCategory}`}
                                  </p>
                                )}
                              </div>

                              <button
                                onClick={(e) => handleRemoveFromWishlist(product._id, e)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                                title="Remove from wishlist"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          
                          <div className="p-3 border-t">
                            <button
                              onClick={() => {
                                setWishlistOpen(false);
                                navigate("/collection");
                              }}
                              className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
                            >
                              View All Items →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* PROFILE */}
            <img
              src={assets.profile_icon}
              onClick={() => (!token ? navigate("/login") : null)}
              className={`w-5 cursor-pointer transition ${
                isHome && !scrolled
                  ? "invert opacity-90"
                  : "opacity-70 hover:opacity-100"
              }`}
              alt=""
            />

            {/* CART */}
            <Link to="/cart" className="relative">
              <img
                src={assets.cart_icon}
                className={`w-5 transition ${
                  isHome && !scrolled
                    ? "invert opacity-90"
                    : "opacity-70 hover:opacity-100"
                }`}
                alt=""
              />
              <span className="absolute -right-2 -bottom-2 w-4 h-4 text-[9px] flex items-center justify-center rounded-full bg-black text-white">
                {getCartCount()}
              </span>
            </Link>

            <img
              src={assets.menu_icon}
              onClick={() => setVisible(true)}
              className={`w-5 cursor-pointer sm:hidden ${
                isHome && !scrolled ? "invert" : ""
              }`}
              alt=""
            />
          </div>
        </div>

        {showCategoryBar && (
          <div className="w-full border-t bg-white/95 backdrop-blur-md">
            <div className="flex gap-8 overflow-x-auto py-3 px-6">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => toggleCategoryInUrl(cat.name)}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;