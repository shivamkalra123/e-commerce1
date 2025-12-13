import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { getCategories } from '../api/categoriesApi';
import { toast } from 'react-toastify';

const Collection = () => {
  const { products , search , showSearch, token } = useContext(ShopContext); // token optional
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [selectedCategories,setSelectedCategories] = useState([]); // names
  const [selectedSubCategories,setSelectedSubCategories] = useState([]); // names
  const [sortType,setSortType] = useState('relavent')

  const [categories, setCategories] = useState([]); // [{ _id, name, subcategories: [] }]
  const [loadingCategories, setLoadingCategories] = useState(false);

  // fetch categories from backend on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingCategories(true);
        const res = await getCategories(token); // if your GET requires token, pass it; else it's optional
        const list = res.data.categories || [];
        setCategories(list);
      } catch (err) {
        console.error('Failed to load categories', err);
        toast.error('Could not load categories');
      } finally {
        setLoadingCategories(false);
      }
    }
    load();
  }, [token]);

  // helper: find category object by name
  const findCategoryByName = (name) => categories.find(c => c.name === name);

  const toggleCategory = (value) => {
    if (selectedCategories.includes(value)) {
        // when unchecking a category, also remove its subcategories from selectedSubCategories
        setSelectedCategories(prev=> prev.filter(item => item !== value));
        const cat = findCategoryByName(value);
        if (cat && Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
          setSelectedSubCategories(prev => prev.filter(s => !cat.subcategories.includes(s)));
        }
    }
    else{
      setSelectedCategories(prev => [...prev,value])
    }
  }

  const toggleSubCategory = (value) => {
    if (selectedSubCategories.includes(value)) {
      setSelectedSubCategories(prev=> prev.filter(item => item !== value))
    }
    else{
      setSelectedSubCategories(prev => [...prev,value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products ? products.slice() : [];

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (selectedCategories.length > 0) {
      productsCopy = productsCopy.filter(item => selectedCategories.includes(item.category));
    }

    if (selectedSubCategories.length > 0 ) {
      productsCopy = productsCopy.filter(item => selectedSubCategories.includes(item.subCategory))
    }

    setFilterProducts(productsCopy)
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
        break;

      default:
        applyFilter();
        break;
    }
  }

  useEffect(()=>{
      applyFilter();
  },[selectedCategories, selectedSubCategories, search, showSearch, products])

  useEffect(()=>{
    sortProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      
      {/* Filter Options */}
      <div className='min-w-60'>
        <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {loadingCategories ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : categories.length > 0 ? (
              categories.map(cat => {
                const isCatSelected = selectedCategories.includes(cat.name);
                return (
                  <div key={cat._id} className=''>
                    <p className='flex gap-2 items-center'>
                      <input
                        className='w-3'
                        type="checkbox"
                        value={cat.name}
                        checked={isCatSelected}
                        onChange={() => toggleCategory(cat.name)}
                      />
                      <span className='ml-2'>{cat.name}</span>
                    </p>

                    {/* show subcategories for this category only when it is selected */}
                    {isCatSelected && Array.isArray(cat.subcategories) && cat.subcategories.length > 0 && (
                      <div className='ml-6 mt-2 mb-2'>
                        {cat.subcategories.map(sub => (
                          <p className='flex gap-2 text-sm' key={sub}>
                            <input
                              className='w-3'
                              type="checkbox"
                              value={sub}
                              checked={selectedSubCategories.includes(sub)}
                              onChange={() => toggleSubCategory(sub)}
                            />
                            <span className='ml-2'>{sub}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              // fallback (if no categories loaded)
              <>
                <p className='flex gap-2'>
                  <input className='w-3' type="checkbox" value={'Men'} checked={selectedCategories.includes('Men')} onChange={()=>toggleCategory('Men')}/> Men
                </p>
                <p className='flex gap-2'>
                  <input className='w-3' type="checkbox" value={'Women'} checked={selectedCategories.includes('Women')} onChange={()=>toggleCategory('Women')}/> Women
                </p>
                <p className='flex gap-2'>
                  <input className='w-3' type="checkbox" value={'Kids'} checked={selectedCategories.includes('Kids')} onChange={()=>toggleCategory('Kids')}/> kids
                </p>
              </>
            )}
          </div>
        </div>

        {/* NOTE: removed the separate SubCategory Filter panel; subcategories are now visible under each selected category */}
      </div>

      {/* Right Side */}
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
            <Title text1={'ALL'} text2={'COLLECTIONS'} />
            {/* Product Sort */}
            <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
              <option value="relavent">Sort by: Relavent</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.length > 0 ? (
              filterProducts.map((item,index)=>(
                <ProductItem key={item._id || index} name={item.name} id={item._id} price={item.price} image={item.image} />
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">No products found.</p>
            )
          }
        </div>
      </div>

    </div>
  )
}

export default Collection
