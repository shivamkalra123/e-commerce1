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
import ShopByMood from "../components/ShopByMood";
import AdPopup from "../components/AdPopup";
import SecondHome from "../components/HomeBanner2";

const Home = () => {



  return (
    <div className="w-full">
      <AdPopup />

      <Hero />

     <CategoryMosaicGrid/>

     <section
        data-aos="fade-up"
        className="max-w-7xl mx-auto"
      >
       <BestSeller/>
      </section>
<SecondHome/>

      



      <section
        data-aos="fade-up"

      >
      <LatestCollection/>
      </section>
      
<HomeBanners/>
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
