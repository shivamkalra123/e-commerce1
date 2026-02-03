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
import LanguageSwitcher from "./LanguageSwitcher";
import { Heart } from "lucide-react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    wishlist,
    toggleWishlist,
  } = useContext(ShopContext);

  const selectedCategories = searchParams.get("categories")
    ? searchParams.get("categories").split(",")
    : [];

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
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
            <div className="relative group">

              <button className="relative">
                <Heart
                  size={20}
                  className={`cursor-pointer transition ${
                    isHome && !scrolled
                      ? "text-white"
                      : "text-gray-600 hover:text-black"
                  }`}
                />

                {wishlist?.length > 0 && (
                  <span className="absolute -right-2 -bottom-2 w-4 h-4 text-[9px] flex items-center justify-center rounded-full bg-black text-white">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <div className="absolute right-0 top-full pt-3 hidden group-hover:block z-40">
                <div className="w-72 bg-white shadow-xl rounded-xl border">

                  {!wishlist?.length ? (
                    <p className="p-4 text-sm text-gray-500">Wishlist is empty 🤍</p>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">

                      {wishlist.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-3 p-3 border-b last:border-none"
                        >
                          <img
                            src={item.image?.[0]}
                            className="w-12 h-14 object-cover rounded"
                          />

                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/${item._id}`);
                            }}
                            className="flex-1 cursor-pointer"
                          >
                            <p className="text-sm line-clamp-1">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.price}</p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(item._id);
                            }}
                            className="text-xs text-red-500"
                          >
                            Remove
                          </button>

                        </div>
                      ))}

                    </div>
                  )}
                </div>
              </div>
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
