import { useEffect } from "react";
import AOS from "aos";

import Hero from "../components/Hero";
import FlashSale from "../components/FlashSale";
import BestSeller from "../components/BestSeller";
import NewsletterBox from "../components/NewsLetterBox";
import WhyUs from "../components/WhyUs";
import StatsCounter from "../components/StatsCounter";

const Home = () => {



  return (
    <div className="w-full">
      
      <Hero />

      <section
        data-aos="fade-up"
        className="max-w-7xl mx-auto px-4 py-14"
      >
        <FlashSale />
      </section>

      
        <div data-aos="fade-up">
  <WhyUs />
</div>
    
      

      <section
        data-aos="fade-up"
        className="max-w-7xl mx-auto px-4 py-24"
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
