import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCategories } from "../api/categoriesApi";

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  
  // ❤️ WISHLIST
  const [wishlist, setWishlist] = useState([]);
  const wishlistCount = wishlist.length;

  // Render wishlist backend
  const WISHLIST_API = "https://e-commerce1-1-cd8g.onrender.com";

  // ✅ CATEGORIES
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // ✅ PRODUCTS
  const [loadingProducts, setLoadingProducts] = useState(false);

  // =============================
  // ✅ Helpers
  // =============================
  const safeJSONParse = (value, fallback) => {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  const isSameMeta = (a, b) => {
    if (!a || !b) return false;
    return a.count === b.count && String(a.latestUpdatedAt) === String(b.latestUpdatedAt);
  };

  // =============================
  // ✅ DISCOUNT CALCULATION FUNCTION
  // =============================
  const calculateProductDiscount = (product) => {
    if (!product) return product;
    
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    
    // Calculate discounted price
    let discountedPrice = price;
    let hasDiscount = false;
    
    if (discount > 0 && discount <= 100) {
      discountedPrice = price - (price * discount / 100);
      // Round to 2 decimal places
      discountedPrice = Math.round(discountedPrice * 100) / 100;
      hasDiscount = true;
    }
    
    return {
      ...product,
      price,
      discount,
      discountedPrice,
      hasDiscount,
      originalPrice: price, // Keep original for reference
    };
  };

  // Process products to add discount fields
  const processProductsWithDiscount = (productsArray) => {
    if (!Array.isArray(productsArray)) return [];
    
    return productsArray.map(product => calculateProductDiscount(product));
  };

  // =====================
  // ❤️ Wishlist helpers
  // =====================
  const getGuestId = () => {
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("guestId", id);
    }
    return id;
  };

  const getWishlistUserId = () => token || getGuestId();

  /* ===================== PRODUCTS (META CHECK + CACHE) ===================== */
  const getProductsData = async (force = false) => {
    try {
      // ✅ 1) Load from cache instantly (fast UI)
      if (!force) {
        const cached = localStorage.getItem("products_cache");
        if (cached) {
          const parsed = safeJSONParse(cached, []);
          if (Array.isArray(parsed) && parsed.length) {
            // Process cached products with discount calculation
            const processedProducts = processProductsWithDiscount(parsed);
            setProducts(processedProducts);
          }
        }
      }

      // ✅ 2) Check backend meta (lightweight)
      const metaRes = await axios.get(`${backendUrl}/api/product/meta`);
      if (!metaRes.data?.success) return;

      const serverMeta = {
        count: metaRes.data.count,
        latestUpdatedAt: metaRes.data.latestUpdatedAt,
      };

      const localMeta = safeJSONParse(
        localStorage.getItem("products_cache_meta"),
        null
      );

      // ✅ 3) if same & not forcing -> stop
      if (!force && isSameMeta(localMeta, serverMeta)) return;

      // ✅ 4) else fetch from DB
      setLoadingProducts(true);

      const res = await axios.get(`${backendUrl}/api/product/list`);

      if (res.data.success) {
        const data = (res.data.products || []).reverse();
        
        // 🔍 DEBUG: Check what fields are coming from backend
     console.log("🎯 Raw data from backend - First product:", data[0] ? {
    name: data[0].name,
    price: data[0].price,
    discount: data[0].discount,
    discountedPrice: data[0].discountedPrice,
    hasDiscount: data[0].hasDiscount,
    hasDiscountType: typeof data[0].hasDiscount,
    discountType: typeof data[0].discount
  } : "No products");
        
        // Process products to add discount calculations
        const processedProducts = processProductsWithDiscount(data);
        
        // 🔍 DEBUG: Check processed products
         console.log("🎯 Processed products - First product:", processedProducts[0] ? {
    name: processedProducts[0].name,
    price: processedProducts[0].price,
    discount: processedProducts[0].discount,
    discountedPrice: processedProducts[0].discountedPrice,
    hasDiscount: processedProducts[0].hasDiscount
  } : "No processed products");
        
        setProducts(processedProducts);

        // ✅ update cache
        localStorage.setItem("products_cache", JSON.stringify(data));
        localStorage.setItem("products_cache_meta", JSON.stringify(serverMeta));
      }
    } catch (err) {
      console.error("❌ Product fetch failed:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  /* ===================== CATEGORIES (META CHECK + CACHE) ===================== */
  const getCategoriesData = async (force = false) => {
    try {
      // ✅ 1) Load from cache instantly
      if (!force) {
        const cached = localStorage.getItem("categories_cache");
        if (cached) {
          const parsed = safeJSONParse(cached, []);
          if (Array.isArray(parsed) && parsed.length) {
            setCategories(parsed);
          }
        }
      }

      // ✅ 2) Check backend meta
      const metaRes = await axios.get(`${backendUrl}/api/categories/meta`);
      if (!metaRes.data?.success) return;

      const serverMeta = {
        count: metaRes.data.count,
        latestUpdatedAt: metaRes.data.latestUpdatedAt,
      };

      const localMeta = safeJSONParse(
        localStorage.getItem("categories_cache_meta"),
        null
      );

      // ✅ 3) if unchanged & not forcing -> stop
      if (!force && isSameMeta(localMeta, serverMeta)) return;

      // ✅ 4) else fetch categories from DB
      setLoadingCategories(true);

      const res = await getCategories(token); // your existing API function
      const data = res?.data?.categories || [];

      setCategories(data);

      // ✅ update cache
      localStorage.setItem("categories_cache", JSON.stringify(data));
      localStorage.setItem("categories_cache_meta", JSON.stringify(serverMeta));
    } catch (err) {
      console.error("❌ Categories fetch failed:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  /* ===================== CART ===================== */
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    setCartItems((prev) => {
      const updated = structuredClone(prev);
      updated[itemId] ??= {};
      updated[itemId][size] = (updated[itemId][size] || 0) + 1;
      return updated;
    });

    if (!token) return;

    try {
      await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      toast.error("Cart update failed");
      console.error(err);
      getUserCart(token);
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    setCartItems((prev) => {
      const updated = structuredClone(prev);
      if (!updated[itemId]) return prev;

      if (quantity === 0) {
        delete updated[itemId][size];
        if (Object.keys(updated[itemId]).length === 0) delete updated[itemId];
      } else {
        updated[itemId][size] = quantity;
      }

      return updated;
    });

    if (!token) return;

    try {
      await axios.post(
        `${backendUrl}/api/cart/update`,
        { itemId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      toast.error("Cart update failed");
      console.error(err);
      getUserCart(token);
    }
  };

  const getUserCart = async (authToken) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (res.data.success) setCartItems(res.data.cartData || {});
    } catch (err) {
      console.error("❌ Failed to load cart:", err);
      setCartItems({});
    }
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce(
      (sum, sizes) => sum + Object.values(sizes).reduce((a, b) => a + b, 0),
      0
    );

  // ✅ UPDATED: CART AMOUNT CALCULATION WITH DISCOUNT
  const getCartAmount = () => {
    if (!products.length) return 0;

    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (!product) continue;

      // Use discounted price if available
      const priceToUse = product.hasDiscount ? product.discountedPrice : product.price;
      
      for (const size in cartItems[id]) {
        total += priceToUse * cartItems[id][size];
      }
    }
    return total;
  };

  // ✅ NEW: CART SAVINGS CALCULATION
  const getCartSavings = () => {
    if (!products.length) return 0;

    let totalSavings = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (!product || !product.hasDiscount) continue;

      const savingsPerItem = product.price - product.discountedPrice;
      
      for (const size in cartItems[id]) {
        totalSavings += savingsPerItem * cartItems[id][size];
      }
    }
    return totalSavings;
  };

  /* ===================== ❤️ WISHLIST ===================== */
  const fetchWishlist = async () => {
    try {
      const userId = getWishlistUserId();

      const res = await axios.get(`${WISHLIST_API}/api/wishlist/${userId}`);

      if (res.data.success) setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.error("❌ Wishlist fetch failed:", err);
    }
  };

  const toggleWishlist = async (productId) => {
    console.log("🔥 toggleWishlist called with:", productId);

    try {
      const userId = getWishlistUserId();

      console.log("👤 wishlist userId:", userId);

      const res = await axios.post(`${WISHLIST_API}/api/wishlist/toggle`, {
        userId,
        productId,
      });

      console.log("✅ Wishlist toggle response:", res.data);

      fetchWishlist();
    } catch (err) {
      console.error("❌ Wishlist toggle failed FULL:", err);
      toast.error("Wishlist failed");
    }
  };

  /* ===================== EFFECTS ===================== */
  useEffect(() => {
    // ✅ load cache + verify meta
    getProductsData();
    getCategoriesData();
    fetchWishlist();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
    }
  }, []);

  /* ===================== CONTEXT ===================== */
  const value = {
    products,
    loadingProducts,
    getProductsData, // ✅ refresh: getProductsData(true)

    categories,
    loadingCategories,
    getCategoriesData, // ✅ refresh: getCategoriesData(true)

    currency,
    delivery_fee,

    search,
    setSearch,
    showSearch,
    setShowSearch,

    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    getCartSavings, // ✅ Added for showing savings

    navigate,
    backendUrl,
    token,
    setToken,
    wishlist,
    toggleWishlist,
    fetchWishlist,
    wishlistCount: wishlist.length,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;