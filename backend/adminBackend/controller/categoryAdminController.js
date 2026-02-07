import { ObjectId } from "mongodb";

const COLLECTION = "categories";

/**
 * Normalize category name (Title Case)
 */
function normalizeName(name) {
  const parts = String(name || "")
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return parts.map(p => p[0].toUpperCase() + p.slice(1)).join(" ");
}

/**
 * Normalize subcategory
 */
function normalizeSubcategory(s) {
  const parts = String(s)
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  return parts.map(p => p[0].toUpperCase() + p.slice(1)).join(" ");
}

/**
 * Helper: escape regex chars
 */
function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * ADMIN: Create category
 * POST /api/categories
 */
export async function createCategory(db, request) {
  try {
    const { name } = await request.json();

    const normalized = normalizeName(name);
    if (!normalized) {
      return Response.json(
        { success: false, message: "Invalid name" },
        { status: 400 }
      );
    }

    const exists = await db.collection(COLLECTION).findOne({
      name: { $regex: `^${escapeRegExp(normalized)}$`, $options: "i" },
    });

    if (exists) {
      return Response.json(
        { success: false, message: "Category exists" },
        { status: 400 }
      );
    }

    const doc = {
      name: normalized,
      subcategories: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION).insertOne(doc);
    const category = await db
      .collection(COLLECTION)
      .findOne({ _id: result.insertedId });

    return Response.json({ success: true, category });
  } catch (err) {
    console.error("createCategory error:", err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
/**
 * ADMIN: Get all categories
 * GET /api/admin/categories
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await req.db
      .collection(COLLECTION)
      .find({})
      .sort({ name: 1 })
      .toArray();

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

/**
 * ADMIN: Add subcategory(s)
 * POST /api/categories/:id/subcategories
 */
export async function addSubcategory(db, request, env, categoryId) {
  try {
    const body = await request.json();
    let { name, names } = body;

    let incoming = [];
    if (Array.isArray(names)) incoming = names;
    else if (typeof name === "string" && name.trim()) incoming = [name];
    else {
      return Response.json(
        { success: false, message: "No subcategory provided" },
        { status: 400 }
      );
    }

    incoming = [...new Set(incoming.map(normalizeSubcategory))];

    const cat = await db
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(categoryId) });

    if (!cat) {
      return Response.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const existingLower = new Set(
      (cat.subcategories || []).map(s => s.toLowerCase())
    );

    const toAdd = incoming.filter(
      s => !existingLower.has(s.toLowerCase())
    );

    if (toAdd.length === 0) {
      return Response.json(
        { success: false, message: "No new subcategories to add" },
        { status: 400 }
      );
    }

    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(categoryId) },
      {
        $push: { subcategories: { $each: toAdd } },
        $set: { updatedAt: new Date() },
      }
    );

    const fresh = await db
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(categoryId) });

    return Response.json({ success: true, added: toAdd, category: fresh });
  } catch (err) {
    console.error("addSubcategory error:", err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/**
 * ADMIN: Update category name
 * PUT /api/categories/:id
 */
export async function updateCategory(db, request, env, id) {
  try {
    const { name } = await request.json();

    const newName = normalizeName(name);
    if (!newName) {
      return Response.json(
        { success: false, message: "Invalid name" },
        { status: 400 }
      );
    }

    const existing = await db.collection(COLLECTION).findOne({
      _id: { $ne: new ObjectId(id) },
      name: { $regex: `^${escapeRegExp(newName)}$`, $options: "i" },
    });

    if (existing) {
      return Response.json(
        { success: false, message: "Another category with same name exists" },
        { status: 400 }
      );
    }

    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name: newName, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return Response.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, category: result.value });
  } catch (err) {
    console.error("updateCategory error:", err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/**
 * ADMIN: Delete category
 * DELETE /api/categories/:id
 */
export async function deleteCategory(db, request, env, id) {
  try {
    const result = await db
      .collection(COLLECTION)
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, message: "Category deleted" });
  } catch (err) {
    console.error("deleteCategory error:", err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/**
 * ADMIN: Delete subcategory
 * DELETE /api/categories/:id/subcategories/:sub
 */
export async function deleteSubcategory(db, request, env, id, sub) {
  try {
    const decodedSub = decodeURIComponent(sub);

    const cat = await db
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(id) });

    if (!cat) {
      return Response.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const subs = cat.subcategories || [];
    const idx = subs.findIndex(
      s => s.toLowerCase() === decodedSub.toLowerCase()
    );

    if (idx === -1) {
      return Response.json(
        { success: false, message: "Subcategory not found" },
        { status: 404 }
      );
    }

    subs.splice(idx, 1);

    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: { subcategories: subs, updatedAt: new Date() } }
    );

    const fresh = await db
      .collection(COLLECTION)
      .findOne({ _id: new ObjectId(id) });

    return Response.json({ success: true, category: fresh });
  } catch (err) {
    console.error("deleteSubcategory error:", err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
