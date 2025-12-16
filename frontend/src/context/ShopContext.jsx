import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
    const currency = "$";
    const delivery_fee = 10;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log("🌐 BACKEND URL:", backendUrl);

    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState(null); // 🔥 KEY FIX
    const [token, setToken] = useState("");

    // ---------------- PRODUCTS ----------------
    const getProductsData = async () => {
        try {
            console.log("📦 Fetching products...");
            const response = await axios.get(`${backendUrl}/api/product/list`);

            if (response.data.success) {
                setProducts(response.data.products.reverse());
            } else {
                setProducts([]); // unblock UI
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("❌ Product fetch failed:", error);
            setProducts([]); // unblock UI
            toast.error("Failed to load products");
        }
    };

    // ---------------- CART ----------------
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Select Product Size");
            return;
        }

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
                { headers: { token } }
            );
        } catch {
            toast.error("Cart update failed");
        }
    };

    const getCartCount = () =>
        Object.values(cartItems).reduce(
            (sum, sizes) => sum + Object.values(sizes).reduce((a, b) => a + b, 0),
            0
        );

    const getCartAmount = () => {
        if (!products) return 0;
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

    const getUserCart = async (authToken) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/cart/get`,
                {},
                { headers: { token: authToken } }
            );
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch {
            toast.error("Failed to load cart");
        }
    };

    // ---------------- EFFECTS ----------------
    useEffect(() => {
        getProductsData(); // run ONCE
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken && !token) {
            setToken(storedToken);
            getUserCart(storedToken);
        }
    }, [token]);

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        getCartAmount,
        navigate,
        backendUrl,
        setToken,
        token
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
