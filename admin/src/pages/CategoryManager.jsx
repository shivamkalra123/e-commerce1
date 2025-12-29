// src/components/CategoryManager.jsx
import React, { useEffect, useState } from "react";
import { getCategories, addCategory as apiAddCategory, addSubcategory as apiAddSubcategory,deleteCategory as apiDeleteCategory,
  deleteSubcategory as apiDeleteSubcategory } from "../api/categoriesApi";
import { toast } from "react-toastify";

/**
 * Admin UI:
 * - Add category (input + button) -> creates and auto-selects category
 * - Select existing category from dropdown
 * - Add subcategory input (single or multiple comma/newline)
 * - Add Subcategory(s) button -> sends as array if multiple
 *
 * Props: token (string) - auth token used in api calls
 */
const parseBulk = (str) => {
  if (!str) return [];
  return Array.from(new Set(
    str.split(/[\n,]+/)
       .map(s => s.trim())
       .filter(Boolean)
  ));
};

const CategoryManager = ({ token }) => {
  const [categories, setCategories] = useState([]); // { _id, name }
  const [selectedCatId, setSelectedCatId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubInput, setNewSubInput] = useState(""); // single or bulk
  const [subPreview, setSubPreview] = useState([]); // parsed preview of newSubInput
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories(token);
      const list = res.data.categories || [];
      setCategories(list);
      // auto-select first if none selected
      if (!selectedCatId && list.length) setSelectedCatId(list[0]._id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };
const handleDeleteCategory = async () => {
  if (!selectedCatId) return;

  const cat = categories.find(c => c._id === selectedCatId);
  if (!window.confirm(`Delete category "${cat?.name}"? This cannot be undone.`)) return;

  try {
    setLoading(true);
    await apiDeleteCategory(selectedCatId, token);
    toast.success("Category deleted");
    setSelectedCatId("");
    await loadCategories();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to delete category");
  } finally {
    setLoading(false);
  }
};
const handleDeleteSubcategory = async (sub) => {
  if (!window.confirm(`Delete subcategory "${sub}"?`)) return;

  try {
    setLoading(true);
    await apiDeleteSubcategory(selectedCatId, sub, token);
    toast.success(`Deleted ${sub}`);
    await loadCategories();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to delete subcategory");
  } finally {
    setLoading(false);
  }
};

  const handleAddCategory = async () => {
    const name = (newCategoryName || "").trim();
    if (!name) return toast.error("Enter a category name");
    try {
      setLoading(true);
      const res = await apiAddCategory(name, token);
      const created = res.data.category;
      toast.success(`Category added: ${created.name}`);
      setNewCategoryName("");
      await loadCategories();
      // select the newly created category (by id)
      setSelectedCatId(created._id);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleSubInputChange = (val) => {
    setNewSubInput(val);
    setSubPreview(parseBulk(val));
  };

  const handleAddSubcategories = async () => {
    if (!selectedCatId) return toast.error("Select or create a category first");
    const items = parseBulk(newSubInput);
    if (items.length === 0) return toast.error("Enter at least one subcategory (single or multiple separated by comma/newline)");
    try {
      setLoading(true);
      // apiAddSubcategory expects (categoryId, subOrSubs, token)
      const res = await apiAddSubcategory(selectedCatId, items.length === 1 ? items[0] : items, token);
      const added = res.data.added || [];
      toast.success(added.length ? `Added: ${added.join(", ")}` : "No new subcategories added");
      setNewSubInput("");
      setSubPreview([]);
      await loadCategories();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to add subcategory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4">Category Manager</h2>

      {/* Add new category */}
      <div className="mb-6">
        <label className="block mb-1">Add new category</label>
        <div className="flex gap-2">
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="border px-3 py-2 flex-1"
            placeholder="Type category name (e.g. Kids)"
          />
          <button onClick={handleAddCategory} className="bg-black text-white px-4 py-2" disabled={loading}>
            Add Category
          </button>
        </div>
      </div>

      {/* Select existing category */}
      <div className="mb-6">
        <label className="block mb-1">Select category</label>
        <select
          className="border px-3 py-2 w-full max-w-sm"
          value={selectedCatId}
          onChange={(e) => setSelectedCatId(e.target.value)}
        >
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
          {categories.length === 0 && <option value="">-- no categories yet --</option>}
        </select>
      </div>

      {/* Add subcategory (single or bulk) */}
      <div className="mb-6">
        <label className="block mb-1">Add subcategory (single or multiple)</label>
        <textarea
          value={newSubInput}
          onChange={(e) => handleSubInputChange(e.target.value)}
          className="border px-3 py-2 w-full max-w-2xl"
          placeholder="Type one subcategory, or multiple separated by commas or new lines. e.g. Jackets, Blazers or one per line"
          rows={3}
        />

        <div className="flex items-center gap-3 mt-2">
          <button onClick={handleAddSubcategories} className="bg-black text-white px-4 py-2" disabled={loading}>
            Add Subcategory(s)
          </button>
          <button onClick={() => { setNewSubInput(""); setSubPreview([]); }} className="px-3 py-2 border">
            Clear
          </button>
          <span className="text-sm text-slate-500">Parsed: {subPreview.length} item(s)</span>
        </div>

        {/* preview parsed */}
        {subPreview.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-1">Preview</p>
            <div className="flex flex-wrap gap-2">
              {subPreview.map(s => (
                <span key={s} className="px-3 py-1 bg-slate-100 rounded">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* show existing subcategories for selected category */}
      <div>
        <h3 className="font-semibold mb-2">Existing subcategories</h3>
        <div className="p-3 border rounded max-w-2xl">
          {selectedCatId ? (
            (categories.find(c => c._id === selectedCatId)?.subcategories || []).length > 0 ? (
              <ul className="list-disc ml-6">
                {(categories.find(c => c._id === selectedCatId)?.subcategories || []).map(s => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : <p className="text-sm text-slate-500">No subcategories yet for this category.</p>
          ) : <p className="text-sm text-slate-500">Select a category to view subcategories.</p>}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
