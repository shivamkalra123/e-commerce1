import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  /* ===================== CART ===================== */
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    // optimistic update
    setCartItems(prev => {
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
    setCartItems(prev => {
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
      (sum, sizes) =>
        sum + Object.values(sizes).reduce((a, b) => a + b, 0),
      0
    );

  const getCartAmount = () => {
    if (!products.length) return 0;

    let total = 0;
    for (const id in cartItems) {
      const product = products.find(p => p._id === id);
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
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
