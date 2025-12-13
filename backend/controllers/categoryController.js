// controllers/categoryController.js
import Category from "../models/Category.js";

// GET /api/categories
export const getAll = async (req, res) => {
  try {
    const cats = await Category.find({}).sort({ name: 1 }).lean();
    return res.json({ success: true, categories: cats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/categories  { name }
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'Invalid name' });
    }
    const normalized = String(name).trim();
    const exists = await Category.findOne({ name: new RegExp(`^${normalized}$`, 'i') });
    if (exists) return res.status(400).json({ success: false, message: 'Category exists' });

    const cat = new Category({ name: normalized });
    await cat.save();
    return res.json({ success: true, category: cat });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/categories/:id/subcategories  { name }
// controllers/categoryController.js
export const addSubcategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    let { name, names } = req.body;

    // Normalize input into an array of strings
    let incoming = [];
    if (Array.isArray(names)) incoming = names;
    else if (typeof name === 'string' && name.trim()) incoming = [name];
    else return res.status(400).json({ success: false, message: 'No subcategory provided' });

    // Normalize each: trim + collapse whitespace + Title Case
    const normalize = (s) => {
      const parts = String(s).trim().toLowerCase().split(/\s+/).filter(Boolean);
      return parts.map(p => p[0].toUpperCase() + p.slice(1)).join(' ');
    };
    incoming = incoming.map(normalize);

    // unique within payload
    incoming = [...new Set(incoming)];

    const cat = await Category.findById(categoryId);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });

    // filter out existing (case-insensitive)
    const existingLower = new Set(cat.subcategories.map(s => s.toLowerCase()));
    const toAdd = incoming.filter(s => !existingLower.has(s.toLowerCase()));

    if (toAdd.length === 0) {
      return res.status(400).json({ success: false, message: 'No new subcategories to add' });
    }

    cat.subcategories.push(...toAdd);
    await cat.save();

    return res.json({ success: true, added: toAdd, category: cat });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


// PUT /api/categories/:id  { name }
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const id = req.params.id;
    if (!name || !String(name).trim()) return res.status(400).json({ success: false, message: 'Invalid name' });

    const existing = await Category.findOne({ _id: { $ne: id }, name: new RegExp(`^${String(name).trim()}$`, 'i') });
    if (existing) return res.status(400).json({ success: false, message: 'Another category with same name exists' });

    const cat = await Category.findByIdAndUpdate(id, { name: String(name).trim() }, { new: true, runValidators: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({ success: true, category: cat });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const cat = await Category.findByIdAndDelete(id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/categories/:id/subcategories/:sub
export const deleteSubcategory = async (req, res) => {
  try {
    const { id, sub } = req.params;
    const cat = await Category.findById(id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });

    const idx = cat.subcategories.findIndex(s => s.toLowerCase() === decodeURIComponent(sub).toLowerCase());
    if (idx === -1) return res.status(404).json({ success: false, message: 'Subcategory not found' });

    cat.subcategories.splice(idx, 1);
    await cat.save();
    return res.json({ success: true, category: cat });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
