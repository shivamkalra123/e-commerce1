import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { getCategories } from "../api/categoriesApi";
import { toast } from "react-toastify";
import { Trans, t } from "@lingui/macro";

const Collection = () => {
  const { products, search, showSearch, token } = useContext(ShopContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);


  useEffect(() => {
    const cats = searchParams.get("categories");
    const subs = searchParams.get("subcategories");
    const sort = searchParams.get("sort");

    if (cats) setSelectedCategories(cats.split(","));
    if (subs) setSelectedSubCategories(subs.split(","));
    if (sort) setSortType(sort);
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    const load = async () => {
      try {
        setLoadingCategories(true);
        const res = await getCategories(token);
        setCategories(res.data.categories || []);
      } catch (err) {
        toast.error(t`Could not load categories`);
      } finally {
        setLoadingCategories(false);
      }
    };
    load();
  }, [token]);

  const findCategoryByName = (name) =>
    categories.find((c) => c.name === name);


  const toggleCategory = (value) => {
    if (selectedCategories.includes(value)) {
      setSelectedCategories((prev) =>
        prev.filter((item) => item !== value)
      );

      const cat = findCategoryByName(value);
      if (cat?.subcategories?.length) {
        setSelectedSubCategories((prev) =>
          prev.filter((s) => !cat.subcategories.includes(s))
        );
      }
    } else {
      setSelectedCategories((prev) => [...prev, value]);
    }
  };

  const toggleSubCategory = (value) => {
    if (selectedSubCategories.includes(value)) {
      setSelectedSubCategories((prev) =>
        prev.filter((item) => item !== value)
      );
    } else {
      setSelectedSubCategories((prev) => [...prev, value]);
    }
  };


  const applyFilter = () => {
    let productsCopy = products ? [...products] : [];

    const urlSearch = searchParams.get("search");

    if (showSearch && (search || urlSearch)) {
      const q = (search || urlSearch).toLowerCase();
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length) {
      productsCopy = productsCopy.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    if (selectedSubCategories.length) {
      productsCopy = productsCopy.filter((item) =>
        selectedSubCategories.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };


  useEffect(() => {
    let sorted = [...filterProducts];

    if (sortType === "low-high") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      sorted.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(sorted);
    // eslint-disable-next-line
  }, [sortType]);


  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line
  }, [
    selectedCategories,
    selectedSubCategories,
    products,
    search,
    showSearch,
  ]);


  useEffect(() => {
    const params = {};

    if (selectedCategories.length)
      params.categories = selectedCategories.join(",");

    if (selectedSubCategories.length)
      params.subcategories = selectedSubCategories.join(",");

    if (sortType !== "relavent") params.sort = sortType;

    if (showSearch && search) params.search = search;

    setSearchParams(params);
  }, [
    selectedCategories,
    selectedSubCategories,
    sortType,
    search,
    showSearch,
  ]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* FILTERS */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          <Trans>FILTERS</Trans>
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">
            <Trans>CATEGORIES</Trans>
          </p>

          {loadingCategories ? (
            <p className="text-sm text-gray-500">
              <Trans>Loading...</Trans>
            </p>
          ) : (
            categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.name);
              return (
                <div key={cat._id}>
                  <label className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCategory(cat.name)}
                    />
                    {cat.name}
                  </label>

                  {isSelected &&
                    cat.subcategories?.map((sub) => (
                      <label
                        key={sub}
                        className="flex gap-2 text-sm ml-6 mt-1"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubCategories.includes(sub)}
                          onChange={() => toggleSubCategory(sub)}
                        />
                        {sub}
                      </label>
                    ))}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="flex-1">
        <div className="flex justify-between mb-4">
          <Title text1={t`ALL`} text2={t`COLLECTIONS`} />

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">
              {t`Sort by: Relavent`}
            </option>
            <option value="low-high">
              {t`Sort by: Low to High`}
            </option>
            <option value="high-low">
              {t`Sort by: High to Low`}
            </option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.length ? (
            filterProducts.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              <Trans>No products found</Trans>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
