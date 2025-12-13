// pages/AdminBanner.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const AdminBanner = () => {
  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const fileRef = useRef(null);

  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [headline, setHeadline] = useState("");
  const [subtext, setSubtext] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");

  // fetch all banners
  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${backend}/api/banner`);
      if (res.data?.success && Array.isArray(res.data.banners)) {
        setBanners(res.data.banners);
      } else {
        setBanners([]);
      }
    } catch (e) {
      console.error("fetchBanners:", e);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an image");
      return;
    }

    const fd = new FormData();
    fd.append("image", file);
    fd.append("headline", headline);
    fd.append("subtext", subtext);
    fd.append("buttonText", buttonText);
    fd.append("buttonUrl", buttonUrl);

    try {
      const res = await axios.post(`${backend}/api/banner`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        alert("Banner added");

        // reset form
        setFile(null);
        setHeadline("");
        setSubtext("");
        setButtonText("");
        setButtonUrl("");
        if (fileRef.current) fileRef.current.value = "";

        fetchBanners();
      }
    } catch (err) {
      console.error("upload failed:", err);
      alert("Upload failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;

    try {
      await axios.delete(`${backend}/api/banner/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBanners();
    } catch (err) {
      console.error("delete failed:", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4 border-b pb-6">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <input
          placeholder="Headline"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="w-full border p-2"
        />

        <input
          placeholder="Subtext"
          value={subtext}
          onChange={(e) => setSubtext(e.target.value)}
          className="w-full border p-2"
        />

        <input
          placeholder="Button Text"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          className="w-full border p-2"
        />

        <input
          placeholder="Button URL"
          value={buttonUrl}
          onChange={(e) => setButtonUrl(e.target.value)}
          className="w-full border p-2"
        />

        <button className="px-4 py-2 bg-black text-white rounded">
          Add Banner
        </button>
      </form>

      {/* Existing banners */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        {banners.map((b) => (
          <div key={b._id} className="relative border">
            {b.imageUrl ? (
              <img
                src={b.imageUrl}
                alt="banner"
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                No image
              </div>
            )}

            <button
              onClick={() => handleDelete(b._id)}
              className="absolute top-2 right-2 bg-white text-xs px-2 py-1 border"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBanner;
