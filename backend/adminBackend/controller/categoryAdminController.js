import Category from "../models/categoryModel.js";

/* ================================
   GET ALL CATEGORIES (ADMIN)
   GET /api/admin/categories
================================ */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });

    res.json({
      success: true,
      categories,
    });
  } catch (err) {
    console.error("getCategories error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================================
   CREATE CATEGORY (ADMIN)
   POST /api/admin/categories
================================ */
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const normalized = name.trim();

    const exists = await Category.findOne({
      name: new RegExp(`^${normalized}$`, "i"),
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: normalized,
    });

    res.json({ success: true, category });
  } catch (err) {
    console.error("createCategory error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================================
   ADD SUBCATEGORY(S) (ADMIN)
   POST /api/admin/categories/:id/subcategories
================================ */
export const addSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, names } = req.body;

    let incoming = [];

    if (Array.isArray(names)) incoming = names;
    else if (typeof name === "string") incoming = [name];

    incoming = [...new Set(incoming.map((s) => s.trim()))];

    if (!incoming.length) {
      return res.status(400).json({
        success: false,
        message: "No subcategory provided",
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const existing = new Set(
      category.subcategories.map((s) => s.toLowerCase())
    );

    const toAdd = incoming.filter(
      (s) => !existing.has(s.toLowerCase())
    );

    if (!toAdd.length) {
      return res.status(400).json({
        success: false,
        message: "No new subcategories to add",
      });
    }

    category.subcategories.push(...toAdd);
    await category.save();

    res.json({
      success: true,
      added: toAdd,
      category,
    });
  } catch (err) {
    console.error("addSubcategory error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================================
   UPDATE CATEGORY (ADMIN)
   PUT /api/admin/categories/:id
================================ */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid category name",
      });
    }

    const exists = await Category.findOne({
      _id: { $ne: id },
      name: new RegExp(`^${name}$`, "i"),
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category with same name exists",
      });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({ success: true, category });
  } catch (err) {
    console.error("updateCategory error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================================
   DELETE CATEGORY (ADMIN)
   DELETE /api/admin/categories/:id
================================ */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted",
    });
  } catch (err) {
    console.error("deleteCategory error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================================
   DELETE SUBCATEGORY (ADMIN)
   DELETE /api/admin/categories/:id/subcategories/:sub
================================ */
export const deleteSubcategory = async (req, res) => {
  try {
    const { id, sub } = req.params;
    const decodedSub = decodeURIComponent(sub);

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const before = category.subcategories.length;

    category.subcategories = category.subcategories.filter(
      (s) => s.toLowerCase() !== decodedSub.toLowerCase()
    );

    if (before === category.subcategories.length) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    await category.save();

    res.json({
      success: true,
      category,
    });
  } catch (err) {
    console.error("deleteSubcategory error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
