import { Link } from "react-router-dom";

const banners = [
  {
    title: "New Summer Collections",
    desc: "Explore trending outfits curated for you.",
    btnText: "Shop Fashion",
    query: "Fashion",
    img: "https://images.unsplash.com/photo-1564463836257-f028d0ff4446?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const SecondHome = () => {
  return (
    <section className="py-12">
      {banners.map((item, idx) => (
        <div
          key={idx}
          className="relative w-full overflow-hidden group h-[700px] md:h-[800px]"
        >
          {/* Image */}
          <img
            src={item.img}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-16 left-6 md:left-16 max-w-xl">
            <h3 className="text-white text-3xl md:text-5xl font-semibold tracking-tight leading-tight font-serif">
              {item.title}
            </h3>

            <p className="text-white/90 mt-4 text-sm md:text-lg font-light tracking-wide">
              {item.desc}
            </p>

            {/* Button */}
            <Link
              to={`/collection?categories=${encodeURIComponent(item.query)}`}
              className="mt-8 inline-flex items-center justify-center rounded-full border border-white/70 bg-white/90 px-8 py-3 text-sm md:text-base font-medium tracking-wide text-black backdrop-blur hover:bg-black hover:text-white hover:border-black transition-all duration-300"
            >
              {item.btnText}
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
};

export default SecondHome;
