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
    const userId = req.user.id;
    const { itemId, size, quantity } = req.body;

    const q = Number(quantity);
    if (Number.isNaN(q) || q < 0) {
      return res.status(400).json({ success: false, message: "Invalid quantity" });
    }

    const user = await userModel.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ success: false });
    }

    const current = user.cartData || {};
    if (!current[itemId] || !current[itemId][size]) {
      // 🔥 NOTHING TO UPDATE — prevent Mongo crash
      return res.json({ success: true, cartData: current });
    }

    const path = `cartData.${itemId}.${size}`;

    if (q === 0) {
      await userModel.findByIdAndUpdate(userId, {
        $unset: { [path]: "" }
      });
    } else {
      await userModel.findByIdAndUpdate(userId, {
        $set: { [path]: q }
      });
    }

    const fresh = await userModel.findById(userId).lean();
    return res.json({ success: true, cartData: fresh.cartData || {} });

  } catch (err) {
    console.error("updateCart crash:", err);
    return res.status(500).json({ success: false, message: "Cart update failed" });
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
