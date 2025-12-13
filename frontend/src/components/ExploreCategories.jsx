import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const gradients = [
  'from-orange-100/60 via-white to-orange-50',
  'from-orange-50 via-white to-gray-100',
  'from-gray-50 via-orange-50/40 to-white',
  'from-orange-100/40 via-white to-gray-50'
]

const ExploreCategories = () => {
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/categories`)
        if (res.data?.success) {
          setCategories(res.data.categories)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchCategories()
  }, [])

  if (!categories.length) return null

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat, i) => (
          <div
            key={cat._id}
            onClick={() => navigate(`/category/${cat.slug || cat._id}`)}
            className={`
              group relative overflow-hidden
              rounded-3xl h-[200px]
              cursor-pointer
              bg-gradient-to-br ${gradients[i % gradients.length]}
              shadow-md
              transition-all duration-300
              hover:scale-[1.03]
              hover:shadow-xl
            `}
          >
            {/* BIG BACK TEXT */}
            <p className="absolute -top-6 -left-2 text-[90px] font-bold text-orange-100/60 select-none">
              {cat.name.charAt(0)}
            </p>

            {/* Floating abstract shapes */}
           
            {/* Content */}
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-lg font-semibold text-gray-800 tracking-wide">
                {cat.name}
              </p>

              {/* Animated underline */}
              <div className="mt-3 h-[3px] w-8 bg-orange-300 rounded-full transition-all group-hover:w-14" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExploreCategories
