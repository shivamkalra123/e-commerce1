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
  const [products, setProducts] = useState([]); // always array
  const [token, setToken] = useState("");

  // ✅ CATEGORIES
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // ✅ PRODUCTS
  const [loadingProducts, setLoadingProducts] = useState(false);

  // =============================
  // ✅ Helpers
  // =============================
  const oneDay = 24 * 60 * 60 * 1000;
  const thirtyMin = 30 * 60 * 1000;

  const safeJSONParse = (value, fallback) => {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  /* ===================== PRODUCTS (LOAD ONCE + CACHE) ===================== */
  const getProductsData = async (force = false) => {
    try {
      // ✅ 1) if we already have products in memory and not forcing -> return
      if (products.length && !force) return;

      // ✅ 2) localStorage cache check
      const cached = localStorage.getItem("products_cache");
      const cachedTime = localStorage.getItem("products_cache_time");

      // choose TTL: 30 min (recommended for products)
      const ttl = thirtyMin;

      if (!force && cached && cachedTime) {
        const isValid = Date.now() - Number(cachedTime) < ttl;

        if (isValid) {
          const parsed = safeJSONParse(cached, []);
          if (Array.isArray(parsed) && parsed.length) {
            setProducts(parsed);
            return;
          }
        }
      }

      // ✅ 3) fetch from backend if cache missing/expired
      setLoadingProducts(true);

      const res = await axios.get(`${backendUrl}/api/product/list`);

      if (res.data.success) {
        const data = (res.data.products || []).reverse();

        setProducts(data);

        // ✅ store to localStorage
        localStorage.setItem("products_cache", JSON.stringify(data));
        localStorage.setItem("products_cache_time", Date.now().toString());
      } else {
        toast.error(res.data.message || "Failed to load products");

        // ✅ fallback to old cache even if expired
        if (cached) {
          const parsed = safeJSONParse(cached, []);
          setProducts(Array.isArray(parsed) ? parsed : []);
        } else {
          setProducts([]);
        }
      }
    } catch (err) {
      console.error("❌ Product fetch failed:", err);
      toast.error("Failed to load products");

      // ✅ fallback to cached products
      const cached = localStorage.getItem("products_cache");
      if (cached) {
        const parsed = safeJSONParse(cached, []);
        setProducts(Array.isArray(parsed) ? parsed : []);
      } else {
        setProducts([]);
      }
    } finally {
      setLoadingProducts(false);
    }
  };

  /* ===================== CATEGORIES (LOAD ONCE + CACHE) ===================== */
  const getCategoriesData = async (force = false) => {
    try {
      // ✅ If already in memory and not forcing, no refetch
      if (categories.length && !force) return;

      // ✅ Check localStorage
      const cached = localStorage.getItem("categories_cache");
      const cachedTime = localStorage.getItem("categories_cache_time");

      // categories change rarely -> 24h TTL
      const ttl = oneDay;

      if (!force && cached && cachedTime) {
        const isValid = Date.now() - Number(cachedTime) < ttl;
        if (isValid) {
          const parsed = safeJSONParse(cached, []);
          if (Array.isArray(parsed) && parsed.length) {
            setCategories(parsed);
            return;
          }
        }
      }

      setLoadingCategories(true);

      const res = await getCategories(token);
      const data = res?.data?.categories || [];

      setCategories(data);

      localStorage.setItem("categories_cache", JSON.stringify(data));
      localStorage.setItem("categories_cache_time", Date.now().toString());
    } catch (err) {
      console.error("❌ Categories fetch failed:", err);
      toast.error("Could not load categories");

      // ✅ fallback to cached categories
      const cached = localStorage.getItem("categories_cache");
      if (cached) {
        const parsed = safeJSONParse(cached, []);
        setCategories(Array.isArray(parsed) ? parsed : []);
      } else {
        setCategories([]);
      }
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

    // optimistic update
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
      getUserCart(token); // rollback from backend
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

  const getCartAmount = () => {
    if (!products.length) return 0;

    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (!product) continue;

      for (const size in cartItems[id]) total += product.price * cartItems[id][size];
    }
    return total;
  };

  /* ===================== EFFECTS ===================== */
  useEffect(() => {
    // ✅ load from cache first, then backend only if needed
    getProductsData();
    getCategoriesData();
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
    getProductsData, // ✅ force refresh: getProductsData(true)

    categories,
    loadingCategories,
    getCategoriesData, // ✅ force refresh: getCategoriesData(true)

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

    navigate,
    backendUrl,
    token,
    setToken,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
