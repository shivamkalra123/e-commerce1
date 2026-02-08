import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="px-4 sm:px-[5vw]">
      <div className="text-center text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
      </div>

      {/* Rendering Products */}
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-5">
        {latestProducts.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
            discount={item.discount}     // ✅ THIS IS THE MAGIC LINE
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
