import { useEffect } from "react";
import AOS from "aos";

import Hero from "../components/Hero";
import FlashSale from "../components/FlashSale";
import BestSeller from "../components/BestSeller";
import NewsletterBox from "../components/NewsLetterBox";
import WhyUs from "../components/WhyUs";
import StatsCounter from "../components/StatsCounter";
import CategoriesGrid from "../components/categoriesGrid";
import CategoryMosaicGrid from "../components/categoriesGrid";
import HomeBanners from "../components/HomeBanners";
import LatestCollection from "../components/LatestCollection";

const Home = () => {



  return (
    <div className="w-full">
      
      <Hero />

     

     
    <LatestCollection/>

      

<CategoryMosaicGrid/>
<HomeBanners/>
      <section
        data-aos="fade-up"
        className="max-w-7xl mx-auto py-10"
      >
        <BestSeller />
      </section>
      

      <div data-aos="zoom-in">
        <StatsCounter />
      </div>

      <section
        data-aos="fade-up"
        className="py-20"
      >
        <NewsletterBox />
      </section>

    </div>
  );
};

export default Home;
