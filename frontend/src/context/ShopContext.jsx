import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCategories } from "../api/categoriesApi"; // ✅ ADD

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

  // ✅ CATEGORIES (LOCALSTORAGE CACHE)
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  /* ===================== PRODUCTS ===================== */
  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.products.reverse());
      } else {
        setProducts([]);
        toast.error(res.data.message || "Failed to load products");
      }
    } catch (err) {
      console.error("❌ Product fetch failed:", err);
      setProducts([]);
      toast.error("Failed to load products");
    }
  };

  /* ===================== CATEGORIES (LOAD ONCE + CACHE) ===================== */
  const getCategoriesData = async (force = false) => {
    try {
      // ✅ If already in state and not forcing, don't refetch
      if (categories.length && !force) return;

      // ✅ Check localStorage cache
      const cached = localStorage.getItem("categories_cache");
      const cachedTime = localStorage.getItem("categories_cache_time");

      // ✅ cache valid for 24 hours
      const oneDay = 24 * 60 * 60 * 1000;

      if (!force && cached && cachedTime) {
        const isValid = Date.now() - Number(cachedTime) < oneDay;

        if (isValid) {
          setCategories(JSON.parse(cached));
          return;
        }
      }

      // ✅ Fetch from backend only if cache missing/expired
      setLoadingCategories(true);
      const res = await getCategories(token);

      const data = res?.data?.categories || [];
      setCategories(data);

      // ✅ Save in localStorage
      localStorage.setItem("categories_cache", JSON.stringify(data));
      localStorage.setItem("categories_cache_time", Date.now().toString());
    } catch (err) {
      console.error("❌ Categories fetch failed:", err);
      toast.error("Could not load categories");
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
        if (Object.keys(updated[itemId]).length === 0) {
          delete updated[itemId];
        }
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
      getUserCart(token); // rollback
    }
  };

  const getUserCart = async (authToken) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (res.data.success) {
        setCartItems(res.data.cartData || {});
      }
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

      for (const size in cartItems[id]) {
        total += product.price * cartItems[id][size];
      }
    }
    return total;
  };

  /* ===================== EFFECTS ===================== */
  useEffect(() => {
    getProductsData();
  }, []);

  // ✅ Load categories once when app starts
  useEffect(() => {
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

    // ✅ categories
    categories,
    loadingCategories,
    getCategoriesData, // optional refresh => getCategoriesData(true)
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
