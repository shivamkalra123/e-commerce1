import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";

const Hero = () => {
  const backend = import.meta.env.VITE_BACKEND_URL;

  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${backend}/api/banner`);
        if (mounted && res.data?.success && Array.isArray(res.data.banners)) {
          setBanners(res.data.banners);
        }
      } catch (e) {
        console.warn("fetchBanners:", e);
      }
    };

    fetchBanners();
    return () => {
      mounted = false;
    };
  }, []);

  // auto-rotate banners
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  const banner = banners[current];

  const imageUrl =
    banner?.imageUrl && banner.imageUrl.trim() !== ""
      ? banner.imageUrl
      : assets.hero_img;

  return (
    <div className="relative w-full overflow-hidden z-0">
      <img
        src={imageUrl}
        alt="Hero banner"
        className="w-full h-[420px] object-cover sm:h-[520px]"
      />

      {/* subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none" />

      {/* Text container */}
      <div className="absolute left-6 top-1/3 sm:left-12 sm:top-1/3 max-w-lg text-[#111]">
        <h1 className="text-3xl sm:text-5xl font-semibold leading-tight">
          {banner?.headline || "Latest Arrivals"}
        </h1>

        {banner?.subtext && (
          <p className="mt-4 text-sm sm:text-base text-gray-700">
            {banner.subtext}
          </p>
        )}

        {banner?.buttonText && banner?.buttonUrl && (
          <a
            href={banner.buttonUrl}
            className="inline-block mt-6 px-5 py-3 rounded-md border border-transparent bg-black text-white hover:opacity-90"
            rel="noreferrer"
          >
            {banner.buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

export default Hero;
