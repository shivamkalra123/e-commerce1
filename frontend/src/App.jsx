import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShopContextProvider from "./context/ShopContext"; // Add this import

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

// Debug Component to show user info
const UserDebug = () => {
  useEffect(() => {
    // Check localStorage for token
    const token = localStorage.getItem("token");
    const guestId = localStorage.getItem("guestId");
    
    console.log("🔍 DEBUG - User Information:");
    console.log("Token from localStorage:", token ? `${token.substring(0, 20)}...` : "No token");
    console.log("Guest ID from localStorage:", guestId);
    console.log("Token length:", token?.length || 0);
    console.log("Token exists:", !!token);
    
    if (token) {
      try {
        // Try to decode JWT if it's a JWT token
        const base64Url = token.split('.')[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          console.log("📋 JWT Payload:", payload);
          console.log("👤 User ID from JWT:", payload.id || payload.userId || payload.sub);
        }
      } catch (error) {
        console.log("Token is not a JWT or cannot be decoded");
      }
    }
  }, []);

  return null; // This component doesn't render anything
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
          console.log("🔥 Warming up wishlist API...");
        });
      } catch (error) {
        // Ignore all errors
      }
    };

    // Log initial state
    console.log("🚀 App component mounted");
    console.log("⏳ Loading state:", loading);
    
    const token = localStorage.getItem("token");
    console.log("🔑 Initial token from localStorage:", token ? "Exists" : "None");
    
    if (token) {
      console.log("🔐 Token preview:", token.substring(0, 50) + "...");
    }

    // Start warming immediately
    warmApis();

    // Set minimum loader time (6.5 seconds to match loader animation)
    const timer = setTimeout(() => {
      console.log("⏰ Loader timeout reached, hiding loader");
      setLoading(false);
    }, 6500);

    return () => {
      console.log("🧹 Cleaning up App component");
      clearTimeout(timer);
    };
  }, []);

  // Log when loading state changes
  useEffect(() => {
    console.log("🔄 Loading state changed to:", loading);
  }, [loading]);

  return (
    <ShopContextProvider>
      {/* Debug component */}
      <UserDebug />
      
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
    </ShopContextProvider>
  );
};

export default App;