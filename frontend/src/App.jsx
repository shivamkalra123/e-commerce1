import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Verify from "./pages/Verify";
import Wishlist from "./pages/Wishlist";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import Loader from "./components/Loader";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ✅ Layout Wrapper for padded pages
const PaddedLayout = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Outlet />
    </div>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to warm up APIs
    const warmApis = () => {
      try {
        // Try to warm up the wishlist API (but don't wait for it)
        fetch("https://e-commerce1-1-cd8g.onrender.com/api/wishlist", {
          method: 'HEAD',
          mode: 'cors'
        }).catch(() => {
          // Ignore errors - we just want to trigger the cold start
          console.log("Warming up APIs...");
        });
      } catch (error) {
        // Ignore all errors
      }
    };

    // Start warming immediately
    warmApis();

    // Set minimum loader time (2 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Show Loader */}
      {loading && <Loader />}

      {/* Main Content - Always render but control visibility */}
      <div style={{ display: loading ? 'none' : 'block' }}>
        <ToastContainer />
        <Navbar />
        <SearchBar />

        <Routes>
          {/* ✅ Home WITHOUT padding */}
          <Route path="/" element={<Home />} />

          {/* ✅ All other pages WITH padding */}
          <Route element={<PaddedLayout />}>
            <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>
        </Routes>

        <Footer />
      </div>
    </div>
  );
};

export default App;