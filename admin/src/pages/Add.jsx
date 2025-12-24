import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { getCategories } from '../api/categoriesApi'

const TSHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const SHOE_SIZES = ['6', '7', '8', '9', '10', '11', '12']

const Add = ({ token }) => {
  // images
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)

  // product fields
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [bestseller, setBestseller] = useState(false)

  // sizes
  const [sizeType, setSizeType] = useState("none") // none | tshirt | shoes
  const [sizes, setSizes] = useState([])

  // categories
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingCategories(true)
        const res = await getCategories(token)
        const list = res.data.categories || []
        setCategories(list)

        if (list.length) {
          setCategory(list[0].name)
          setSubCategory(list[0].subcategories?.[0] || "")
        }
      } catch (err) {
        toast.error("Could not load categories")
      } finally {
        setLoadingCategories(false)
      }
    }
    load()
  }, [token])

  /* ================= UPDATE SUBCATEGORY ================= */
  useEffect(() => {
    const cat = categories.find(c => c.name === category)
    if (cat?.subcategories?.length) {
      setSubCategory(cat.subcategories[0])
    }
  }, [category, categories])

  /* ================= RESET SIZES WHEN TYPE CHANGES ================= */
  useEffect(() => {
    setSizes([])
  }, [sizeType])

  /* ================= SUBMIT ================= */
  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)

      // ✅ only send sizes if enabled
      if (sizeType !== "none") {
        formData.append("sizes", JSON.stringify(sizes))
      }

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const res = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      )

      if (res.data.success) {
        toast.success("Product added")
        setName("")
        setDescription("")
        setPrice("")
        setSizes([])
        setSizeType("none")
        setBestseller(false)
        setImage1(null)
        setImage2(null)
        setImage3(null)
        setImage4(null)
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    }
  }

  /* ================= RENDER ================= */
  const availableSizes =
    sizeType === "tshirt" ? TSHIRT_SIZES :
    sizeType === "shoes" ? SHOE_SIZES : []

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full gap-3'>

      {/* Images */}
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          {[image1, image2, image3, image4].map((img, i) => (
            <label key={i}>
              <img
                className='w-20'
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt=""
              />
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const setters = [setImage1, setImage2, setImage3, setImage4]
                  setters[i](e.target.files[0])
                }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Name */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product name"
        required
        className='px-3 py-2 max-w-[500px]'
      />

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Product description"
        required
        className='px-3 py-2 max-w-[500px]'
      />

      {/* Category */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {loadingCategories ? (
          <option>Loading...</option>
        ) : (
          categories.map(c => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))
        )}
      </select>

      {/* Subcategory */}
      <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
        {(categories.find(c => c.name === category)?.subcategories || []).map(sub => (
          <option key={sub} value={sub}>{sub}</option>
        ))}
      </select>

      {/* Price */}
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        className='px-3 py-2 w-[120px]'
      />

      {/* ===== SIZE TYPE SELECTOR ===== */}
      <div>
        <p className='mb-2'>Size Type</p>
        <select
          value={sizeType}
          onChange={(e) => setSizeType(e.target.value)}
          className='px-3 py-2'
        >
          <option value="none">No Sizes (Accessories)</option>
          <option value="tshirt">T-Shirt Sizes</option>
          <option value="shoes">Shoe Sizes</option>
        </select>
      </div>

      {/* ===== SIZE BUTTONS ===== */}
      {sizeType !== "none" && (
        <div>
          <p className='mb-2'>Available Sizes</p>
          <div className='flex gap-3 flex-wrap'>
            {availableSizes.map(sz => (
              <div
                key={sz}
                onClick={() =>
                  setSizes(prev =>
                    prev.includes(sz)
                      ? prev.filter(s => s !== sz)
                      : [...prev, sz]
                  )
                }
              >
                <p className={`${sizes.includes(sz) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>
                  {sz}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bestseller */}
      <div className='flex gap-2'>
        <input
          type="checkbox"
          checked={bestseller}
          onChange={() => setBestseller(p => !p)}
        />
        <label>Add to bestseller</label>
      </div>

      <button className='bg-black text-white px-6 py-3 w-28'>
        ADD
      </button>
    </form>
  )
}

export default Add
