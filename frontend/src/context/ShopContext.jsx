import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log("🌐 BACKEND URL:", backendUrl);

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {
        console.log("🛒 addToCart called:", { itemId, size });

        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);

        if (token) {
            try {
                console.log("➡️ POST /api/cart/add", backendUrl + "/api/cart/add");
                await axios.post(
                    backendUrl + '/api/cart/add',
                    { itemId, size },
                    { headers: { token } }
                );
                console.log("✅ Cart updated on backend");
            } catch (error) {
                console.error("❌ addToCart error:", error);
                toast.error(error.message);
            }
        }
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    totalCount += cartItems[items][item];
                }
            }
        }
        console.log("🧮 Cart count:", totalCount);
        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        console.log("✏️ updateQuantity:", { itemId, size, quantity });

        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                console.log("➡️ POST /api/cart/update");
                await axios.post(
                    backendUrl + '/api/cart/update',
                    { itemId, size, quantity },
                    { headers: { token } }
                );
                console.log("✅ Quantity updated on backend");
            } catch (error) {
                console.error("❌ updateQuantity error:", error);
                toast.error(error.message);
            }
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0 && itemInfo) {
                    totalAmount += itemInfo.price * cartItems[items][item];
                }
            }
        }
        console.log("💰 Cart amount:", totalAmount);
        return totalAmount;
    };

    const getProductsData = async () => {
    setLoading(true);
    try {
        const response = await axios.get(backendUrl + '/api/product/list');
        if (response.data.success) {
            setProducts(response.data.products.reverse());
        }
    } catch (error) {
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
};


    const getUserCart = async (token) => {
        console.log("👤 Fetching user cart with token:", token);

        try {
            const response = await axios.post(
                backendUrl + '/api/cart/get',
                {},
                { headers: { token } }
            );
            console.log("✅ User cart response:", response);

            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.error("❌ getUserCart error:", error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        console.log("🚀 ShopContext mounted");
        getProductsData();
    }, []);

    useEffect(() => {
        console.log("🔐 Token changed:", token);

        if (!token && localStorage.getItem('token')) {
            const storedToken = localStorage.getItem('token');
            console.log("📥 Token from localStorage:", storedToken);
            setToken(storedToken);
            getUserCart(storedToken);
        }

        if (token) {
            getUserCart(token);
        }
    }, [token]);

    const value = {
    products,
    loading,
    currency,
    delivery_fee,
    search, setSearch,
    showSearch, setShowSearch,
    cartItems, addToCart, setCartItems,
    getCartCount, updateQuantity,
    getCartAmount, navigate,
    backendUrl, setToken, token
};


    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
