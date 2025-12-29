import React, { useEffect, useState } from "react";
import { usePageContent } from "../hooks/usePageContent";

const FLASH_SALE_KEY = "flash_sale_end_time";
const SALE_DURATION_HOURS = 5;

const FlashSale = () => {
  const content = usePageContent("flashsale");

  // Get or create sale end time
  const getSaleEndTime = () => {
    const saved = localStorage.getItem(FLASH_SALE_KEY);
    if (saved) return new Date(saved);

    const end = new Date();
    end.setHours(end.getHours() + SALE_DURATION_HOURS);
    localStorage.setItem(FLASH_SALE_KEY, end.toISOString());
    return end;
  };

  const SALE_END = getSaleEndTime();

  const calculateTimeLeft = () => {
    const diff = SALE_END - new Date();
    if (diff <= 0) return null;

    return {
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    localStorage.removeItem(FLASH_SALE_KEY);
    return null;
  }

  const t = (key, fallback = "") => content[key] || fallback;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-lg">
      <div className="absolute inset-0 bg-orange-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-10">
        
        {/* LEFT */}
        <div>
          <p className="text-xs tracking-widest text-orange-400 uppercase">
            {t("flashsale.tag", "Limited Time Offer")}
          </p>

          <h2 className="mt-2 text-2xl sm:text-3xl font-semibold">
            {t("flashsale.title", "Flash Sale")} ⚡{" "}
            <span className="text-orange-400">
              {t("flashsale.discount", "Up to 40% OFF")}
            </span>
          </h2>

          <p className="mt-2 text-sm text-gray-300 max-w-md">
            {t(
              "flashsale.description",
              "Hurry up! Grab your favorites before the timer runs out."
            )}
          </p>
        </div>

        {/* TIMER */}
        <div className="flex gap-4 text-center">
          {Object.entries(timeLeft).map(([key, value]) => (
            <div
              key={key}
              className="min-w-[70px] rounded-xl bg-white/10 backdrop-blur-md px-3 py-3"
            >
              <p className="text-2xl font-semibold">
                {String(value).padStart(2, "0")}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-gray-300">
                {t(`flashsale.${key}`, key)}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href="/collection"
          className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-medium text-black hover:bg-orange-400 transition"
        >
          {t("flashsale.cta", "Shop the Sale")}
        </a>
      </div>
    </div>
  );
};

export default FlashSale;
