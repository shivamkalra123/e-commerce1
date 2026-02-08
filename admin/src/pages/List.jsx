import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  // 📝 edit state
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    discount: "",
    bestseller: false,
  });

  // 🌍 Currency from Redux
  const { selectedCurrency, supportedCurrencies } = useSelector(
    (state) => state.currency || {}
  );

  const currencyMeta = useMemo(
    () =>
      supportedCurrencies?.find((c) => c.code === selectedCurrency) || {
        code: "USD",
        symbol: "$",
      },
    [selectedCurrency, supportedCurrencies]
  );

  // 🔐 Admin auth header
  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  /* ================= FETCH PRODUCTS ================= */
  const fetchList = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/admin/products`,
        authHeader
      );

      if (res.data.success) {
        setList(res.data.products);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  /* ================= DELETE PRODUCT ================= */
  const removeProduct = async (id) => {
    try {
      const res = await axios.delete(
        `${backendUrl}/api/admin/products/${id}`,
        authHeader
      );

      if (res.data.success) {
        toast.success("Product removed");
        fetchList();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  /* ================= OPEN EDIT ================= */
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      price: item.price,
      discount: item.discount || 0,
      bestseller: item.bestseller || false,
    });
  };

  /* ================= UPDATE PRODUCT ================= */
  const updateProduct = async () => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/admin/products/${editing._id}`,
        form,
        authHeader
      );

      if (res.data.success) {
        toast.success("Product updated");
        setEditing(null);
        fetchList();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    if (token) fetchList();
  }, [token]);

  return (
    <>
      <p className="mb-2 font-semibold">All Products</p>

      <div className="flex flex-col gap-2">
        {/* HEADER */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] bg-gray-100 p-2 text-sm font-semibold">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price ({currencyMeta.code})</span>
          <span className="text-center">Action</span>
        </div>

        {/* ROWS */}
        {list.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 p-2 border text-sm"
          >
            <img
              src={item.image?.[0]}
              alt={item.name}
              className="w-12 h-12 object-cover"
            />

            <p>{item.name}</p>
            <p>{item.category}</p>

            <p>
              {currencyMeta.symbol}
              {item.hasDiscount ? item.discountedPrice : item.price}
              {item.hasDiscount && (
                <span className="ml-2 text-xs text-red-500 line-through">
                  {currencyMeta.symbol}
                  {item.price}
                </span>
              )}
            </p>

            <div className="flex justify-center gap-2">
              <button
                onClick={() => openEdit(item)}
                className="text-blue-600 text-sm hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => removeProduct(item._id)}
                className="text-red-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-[320px] flex flex-col gap-3">
            <h3 className="font-semibold">Edit Product</h3>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="border px-2 py-1"
              placeholder="Name"
            />

            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="border px-2 py-1"
              placeholder="Price"
            />

            <input
              type="number"
              min="0"
              max="100"
              value={form.discount}
              onChange={(e) =>
                setForm({ ...form, discount: e.target.value })
              }
              className="border px-2 py-1"
              placeholder="Discount %"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.bestseller}
                onChange={() =>
                  setForm({
                    ...form,
                    bestseller: !form.bestseller,
                  })
                }
              />
              Bestseller
            </label>

            <div className="flex justify-between mt-2">
              <button
                onClick={() => setEditing(null)}
                className="text-sm text-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={updateProduct}
                className="bg-black text-white px-4 py-1 text-sm"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
