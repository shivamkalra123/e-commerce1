import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { Trans, t } from "@lingui/macro";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [sortType, setSortType] = useState("relavent");

  useEffect(() => {
    const cats = searchParams.get("categories");
    const subs = searchParams.get("subcategories");
    const sort = searchParams.get("sort");

    if (cats) setSelectedCategories(cats.split(","));
    if (subs) setSelectedSubCategories(subs.split(","));
    if (sort) setSortType(sort);
    // eslint-disable-next-line
  }, []);

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

    if (sortType === "low-high") sorted.sort((a, b) => a.price - b.price);
    else if (sortType === "high-low") sorted.sort((a, b) => b.price - a.price);

    setFilterProducts(sorted);
    // eslint-disable-next-line
  }, [sortType]);

  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line
  }, [selectedCategories, selectedSubCategories, products, search, showSearch]);

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
    setSearchParams,
  ]);

  return (
    // ✅ page scroll enabled
    <div className="min-h-screen overflow-y-auto pb-20 flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* PRODUCTS */}
      <div className="flex-1 pr-2">
        <div className="flex justify-between mb-4">
          <Title text1={t`ALL`} text2={t`COLLECTIONS`} />

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">{t`Sort by: Relavent`}</option>
            <option value="low-high">{t`Sort by: Low to High`}</option>
            <option value="high-low">{t`Sort by: High to Low`}</option>
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
                  discountedPrice={item.discountedPrice}
  discount={item.discount}
  hasDiscount={item.hasDiscount}

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
