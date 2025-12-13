import userModel from "../models/userModel.js";



const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { itemId, size } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!itemId || !size) return res.status(400).json({ success: false, message: "itemId and size required" });

    // Load, but we will compute newCartData and write atomically
    const user = await userModel.findById(userId).lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // ensure current cartData is an object
    const currentCart = user.cartData && typeof user.cartData === 'object' ? user.cartData : {};

    const itemKey = String(itemId);
    const sizeKey = String(size);

    // clone and update to avoid mutation issues
    const newCart = { ...currentCart };

    if (!newCart[itemKey]) newCart[itemKey] = {};
    newCart[itemKey][sizeKey] = (Number(newCart[itemKey][sizeKey]) || 0) + 1;

    // Atomically set the whole cartData in DB and return the fresh doc
    const updated = await userModel.findByIdAndUpdate(
      userId,
      { $set: { cartData: newCart } },
      { new: true, runValidators: true }
    ).lean();

    console.log(`After update (fresh from DB) for ${userId}:`, JSON.stringify(updated?.cartData, null, 2));

    return res.json({ success: true, message: "Added To Cart", cartData: updated.cartData || {} });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};




const updateCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { itemId, size, quantity } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!itemId || !size || typeof quantity === "undefined")
      return res.status(400).json({ success: false, message: "itemId, size and quantity required" });

    const q = Number(quantity);
    if (Number.isNaN(q) || q < 0) return res.status(400).json({ success: false, message: "quantity must be non-negative" });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.cartData = user.cartData || {};
    const itemKey = String(itemId);
    const sizeKey = String(size);
    if (!user.cartData[itemKey]) user.cartData[itemKey] = {};

    if (q === 0) {
      delete user.cartData[itemKey][sizeKey];
      if (Object.keys(user.cartData[itemKey] || {}).length === 0) delete user.cartData[itemKey];
    } else {
      user.cartData[itemKey][sizeKey] = q;
    }

    await user.save();
    const fresh = await userModel.findById(userId).lean();
    console.log(`After updateCart (fresh from DB) for ${userId}:`, JSON.stringify(fresh?.cartData, null, 2));

    return res.json({ success: true, message: "Cart Updated", cartData: fresh.cartData || {} });
  } catch (error) {
    console.error("updateCart error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await userModel.findById(userId).lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.json({ success: true, cartData: user.cartData || {} });
  } catch (error) {
    console.error("getUserCart error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
