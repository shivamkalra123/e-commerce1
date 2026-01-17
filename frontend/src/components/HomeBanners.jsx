import { Link } from "react-router-dom";

const banners = [
  {
    title: "New Season Arrivals",
    desc: "Explore trending outfits curated for you.",
    btnText: "Shop Fashion",
    query: "Fashion",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&auto=format&fit=crop",
  },
];

const HomeBanners = () => {
  return (
    <section className="py-12">
      {banners.map((item, idx) => (
        <div
          key={idx}
          className="relative w-full overflow-hidden group h-[340px] md:h-[520px]"

        >
          {/* Image */}
          <img
            src={item.img}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16">
            <h3 className="text-white text-2xl md:text-5xl font-bold leading-tight max-w-2xl">
              {item.title}
            </h3>

            <p className="text-white/85 mt-3 text-sm md:text-lg max-w-xl">
              {item.desc}
            </p>

            {/* ✅ Button */}
            <Link
              to={`/collection?categories=${encodeURIComponent(item.query)}`}
              className="mt-6 inline-flex w-fit items-center justify-center rounded-full bg-white px-7 py-3 text-sm md:text-base font-semibold text-black hover:bg-black hover:text-white transition"
            >
              {item.btnText}
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
};

export default HomeBanners;
