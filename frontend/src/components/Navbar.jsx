import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

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
          isHome ? "fixed top-0 left-0" : "relative"
        } ${
          isHome
            ? scrolled
              ? "bg-white shadow-sm"
              : "bg-transparent"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* LOGO */}
          <Link to="/">
            <img
              src="/logo.png"
              alt="Logo"
              className={`w-42 transition ${
                isHome && !scrolled ? "invert" : ""
              }`}
            />
          </Link>

          {/* DESKTOP LINKS */}
          <ul className="hidden sm:flex gap-8">
            <NavLink to="/" className={navLinkClass}>HOME</NavLink>
            <NavLink to="/collection" className={navLinkClass}>COLLECTION</NavLink>
            <NavLink to="/about" className={navLinkClass}>ABOUT</NavLink>
            <NavLink to="/contact" className={navLinkClass}>CONTACT</NavLink>
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
                isHome && !scrolled ? "invert opacity-90" : "opacity-70 hover:opacity-100"
              }`}
              alt=""
            />

            <div className="relative group flex items-center">
  <img
    src={assets.profile_icon}
    onClick={() => (!token ? navigate("/login") : null)}
    className={`w-5 cursor-pointer transition ${
      isHome && !scrolled ? "invert opacity-90" : "opacity-70 hover:opacity-100"
    }`}
    alt=""
  />

  {token && (
    <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
      <div className="w-40 rounded-md bg-white shadow-lg border text-sm text-gray-600">
        <p className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
          My Profile
        </p>
        <p
          onClick={() => navigate("/orders")}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
        >
          Orders
        </p>
        <p
          onClick={logout}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-red-500"
        >
          Logout
        </p>
      </div>
    </div>
  )}
</div>


            <Link to="/cart" className="relative">
              <img
                src={assets.cart_icon}
                className={`w-5 transition ${
                  isHome && !scrolled ? "invert opacity-90" : "opacity-70 hover:opacity-100"
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
      </header>

      {/* MOBILE MENU (unchanged) */}
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
            <p className="text-sm">Menu</p>
          </div>

          <nav className="flex flex-col text-sm text-gray-600">
            <NavLink onClick={() => setVisible(false)} to="/" className="px-6 py-3 border-b">HOME</NavLink>
            <NavLink onClick={() => setVisible(false)} to="/collection" className="px-6 py-3 border-b">COLLECTION</NavLink>
            <NavLink onClick={() => setVisible(false)} to="/about" className="px-6 py-3 border-b">ABOUT</NavLink>
            <NavLink onClick={() => setVisible(false)} to="/contact" className="px-6 py-3 border-b">CONTACT</NavLink>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
