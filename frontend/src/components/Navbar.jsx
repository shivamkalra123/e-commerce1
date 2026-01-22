import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import {
  Link,
  NavLink,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { Trans, t } from "@lingui/macro";
import LanguageSwitcher from "./LanguageSwitcher";
import { getCategories } from "../api/categoriesApi";
import { toast } from "react-toastify";

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
  } = useContext(ShopContext);

  // ✅ Categories
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const selectedCategories = searchParams.get("categories")
    ? searchParams.get("categories").split(",")
    : [];

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  // ✅ Scroll effect on ALL pages (not just home)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ Fetch categories ONCE (or whenever token changes)
  useEffect(() => {
    const loadCats = async () => {
      try {
        setLoadingCategories(true);
        const res = await getCategories(token);
        const fetched = res?.data?.categories || [];
        setCategories(fetched);
      } catch (err) {
        console.log("❌ Categories Fetch Error:", err);
        toast.error(t`Could not load categories`);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCats();
  }, [token]);

  // ✅ Category bar should appear:
  // 1) Always on collection page
  // 2) OR when scrolled down (on any page)
  const showCategoryBar = isCollection || scrolled;

  const toggleCategoryInUrl = (catName) => {
    const params = Object.fromEntries([...searchParams]);

    let current = params.categories ? params.categories.split(",") : [];

    if (current.includes(catName)) {
      current = current.filter((c) => c !== catName);
    } else {
      current = [...current, catName];
    }

    if (current.length) params.categories = current.join(",");
    else delete params.categories;

    delete params.subcategories;

    // ✅ ensure user is in collection page when selecting
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
        {/* TOP NAV */}
        <div className="flex items-center justify-between px-6 py-3">
          {/* LOGO */}
          <Link to="/">
            <img
              src="/logo.png"
              alt="Logo"
              className={`w-42 transition ${isHome && !scrolled ? "invert" : ""}`}
            />
          </Link>

          {/* DESKTOP LINKS */}
          <ul className="hidden sm:flex gap-8">
            <NavLink to="/" className={navLinkClass}>
              <Trans>HOME</Trans>
            </NavLink>
            <NavLink to="/collection" className={navLinkClass}>
              <Trans>COLLECTION</Trans>
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              <Trans>ABOUT</Trans>
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              <Trans>CONTACT</Trans>
            </NavLink>
          </ul>

          {/* ICONS */}
          <div className="flex items-center gap-5">
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

            {/* PROFILE */}
            <div className="relative group flex items-center">
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

              {token && (
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                  <div className="w-40 rounded-md bg-white shadow-lg border text-sm text-gray-600">
                    <p className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <Trans>My Profile</Trans>
                    </p>
                    <p
                      onClick={() => navigate("/orders")}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <Trans>Orders</Trans>
                    </p>
                    <p
                      onClick={logout}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-red-500"
                    >
                      <Trans>Logout</Trans>
                    </p>
                  </div>
                </div>
              )}
            </div>

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

            {/* LANGUAGE SWITCHER */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* MOBILE MENU ICON */}
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

        {/* ✅ CATEGORY BAR (VISIBLE ON COLLECTION OR WHEN SCROLLED) */}
        {showCategoryBar && (
          <div className="w-full border-t border-b bg-white">
            <div className="px-6 py-2 flex gap-3 overflow-x-auto whitespace-nowrap">
              {loadingCategories ? (
                <p className="text-sm text-gray-500">
                  <Trans>Loading...</Trans>
                </p>
              ) : categories.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No categories found
                </p>
              ) : (
                categories.map((cat) => {
                  const active = selectedCategories.includes(cat.name);
                  return (
                    <button
                      key={cat._id}
                      onClick={() => toggleCategoryInUrl(cat.name)}
                      className={`px-4 py-2 rounded-full border text-sm transition ${
                        active
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute top-0 right-0 h-full w-3/4 max-w-xs bg-white transition-transform ${
            visible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center gap-3 px-5 py-4 border-b">
            <img
              src={assets.dropdown_icon}
              className="h-4 rotate-180 cursor-pointer"
              onClick={() => setVisible(false)}
              alt=""
            />
            <p className="text-sm">
              <Trans>Menu</Trans>
            </p>
          </div>

          <nav className="flex flex-col text-sm text-gray-600">
            <NavLink
              onClick={() => setVisible(false)}
              to="/"
              className="px-6 py-3 border-b"
            >
              <Trans>HOME</Trans>
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="/collection"
              className="px-6 py-3 border-b"
            >
              <Trans>COLLECTION</Trans>
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="/about"
              className="px-6 py-3 border-b"
            >
              <Trans>ABOUT</Trans>
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="/contact"
              className="px-6 py-3 border-b"
            >
              <Trans>CONTACT</Trans>
            </NavLink>

            <div className="px-6 py-4">
              <LanguageSwitcher className="w-full" />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
