import { Link } from "react-router-dom";

const categoryData = [
  {
    title: "Men",
    query: "Men",
    img: "https://images.unsplash.com/photo-1610384104075-e05c8cf200c3?q=80&w=1064&auto=format&fit=crop",
    className: "md:row-span-2 md:col-span-1",
  },
  {
    title: "Women",
    query: "Women",
    img: "https://images.unsplash.com/photo-1584998316204-3b1e3b1895ae?q=80&w=987&auto=format&fit=crop",
  },
  {
    title: "Fashion",
    query: "Fashion",
    img: "https://plus.unsplash.com/premium_photo-1675186049419-d48f4b28fe7c?q=80&w=987&auto=format&fit=crop",
  },
  {
    title: "Shoes",
    query: "Shoes",
    img: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=900&auto=format&fit=crop&q=60",
    imgClass: "object-bottom",
  },
  {
    title: "Beauty",
    query: "Beauty",
    img: "https://images.unsplash.com/photo-1643185450492-6ba77dea00f6?q=80&w=987&auto=format&fit=crop",
  },
];

const Tile = ({ title, query, img, className = "", imgClass = "" }) => {
  return (
    <Link
      to={`/collection?categories=${encodeURIComponent(query)}`}
      className={`relative overflow-hidden rounded-2xl group ${className}`}
    >
      {/* Image */}
      <img
        src={img}
        alt={title}
        className={`w-full h-full object-cover ${imgClass || "object-center"} 
        group-hover:scale-110 transition duration-700`}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:from-black/80 transition" />

      {/* Text */}
      <div className="absolute bottom-4 left-4">
        <p className="text-white text-lg md:text-xl font-semibold tracking-wide">
          {title}
        </p>
      </div>
    </Link>
  );
};

const CategoryMosaicGrid = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
        SHOP BY CATEGORY
      </h2>

      {/* ✅ GRID */}
      <div className="grid gap-4 auto-rows-[250px] md:auto-rows-[310px] md:grid-cols-3">

        {/* Left Big */}
        <Tile {...categoryData[0]} />

        {/* Right Top Row */}
        <Tile {...categoryData[1]} />
        <Tile {...categoryData[2]} />

        {/* Right Bottom Row */}
        <Tile {...categoryData[3]} />
        <Tile {...categoryData[4]} />
      </div>
    </section>
  );
};

export default CategoryMosaicGrid;
