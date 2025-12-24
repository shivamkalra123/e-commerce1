import Hero from "../components/Hero";
import FlashSale from "../components/FlashSale";
import ShopByMood from "../components/ShopByMood";

import NewsletterBox from "../components/NewsLetterBox";

import BestSeller from "../components/BestSeller";



const Home = () => {
  return (
    <div className="w-full">

      <Hero />

      <section className="max-w-7xl mx-auto px-4 py-14">
        <FlashSale />
      </section>

  

      <section className="max-w-7xl mx-auto px-4 py-24">
        <ShopByMood />
      </section>
       <section className="max-w-7xl mx-auto px-4 py-24">
        <BestSeller />
      </section>

    



      <section className="py-20">
        <NewsletterBox />
      </section>

    </div>
  );
};

export default Home;
