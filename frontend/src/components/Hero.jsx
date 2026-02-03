import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "Effortless Style",
    desc: "Discover pieces made to move with you.",
    query: "Fashion",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "New Season Edit",
    desc: "Fresh arrivals curated for everyday luxury.",
    query: "Women",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Modern Essentials",
    desc: "Minimal. Timeless. You.",
    query: "Men",
    img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1600&auto=format&fit=crop",
  },
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
  <section className="relative w-screen overflow-hidden -mt-20 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] min-h-[110vh] md:min-h-[110vh]">

    {slides.map((slide, i) => (
      <div
        key={i}
        className={`absolute inset-0 transition-opacity duration-1000 ${
          i === index ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Image */}
        <img
          src={slide.img}
          alt={slide.title}
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center md:justify-start">
          <div className="px-4 text-center md:text-left md:ml-24 max-w-md">

            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight">
              {slide.title}
            </h1>

            <p className="text-white/80 mt-3 text-xs sm:text-sm md:text-lg font-light tracking-wide">
              {slide.desc}
            </p>

            <Link
              to={`/collection?categories=${encodeURIComponent(slide.query)}`}
              className="mt-6 inline-flex rounded-full bg-white px-6 py-2 text-xs sm:text-sm md:text-base font-medium tracking-wide text-black hover:bg-black hover:text-white transition-all"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    ))}

    {/* Dots */}
    <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
      {slides.map((_, i) => (
        <button
          key={i}
          onClick={() => setIndex(i)}
          className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition ${
            i === index ? "bg-white" : "bg-white/40"
          }`}
        />
      ))}
    </div>
  </section>
);
}
export default Hero;
