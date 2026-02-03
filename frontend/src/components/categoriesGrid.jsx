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
    img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Fashion",
    query: "Fashion",
    img: "https://plus.unsplash.com/premium_photo-1675186049419-d48f4b28fe7c?q=80&w=987&auto=format&fit=crop",
  },
  {
    title: "Shoes",
    query: "Shoes",
    img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    imgClass: "object-bottom",
  },
  {
    title: "Beauty",
    query: "Beauty",
    img: "https://images.unsplash.com/photo-1643185450492-6ba77dea00f6?q=80&w=987&auto=format&fit=crop",
  },

  // ✅ NEW
  {
    title: "Easy Life",
    query: "Easy Life",
    img: "https://images.unsplash.com/photo-1734599317961-d73bb9c2f3ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Style",
    query: "Style",
    img: "https://plus.unsplash.com/premium_photo-1695575593603-1f42ca27bb6d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Kids",
    query: "Kids",
    img: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];


const Tile = ({ title, query, img, className = "", imgClass = "" }) => {
  return (
    <Link
      to={`/collection?categories=${encodeURIComponent(query)}`}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* Image */}
      <img
        src={img}
        alt={title}
        className={`w-full h-full object-cover ${
          imgClass || "object-center"
        } group-hover:scale-110 transition duration-700`}
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
    <section className="w-screen overflow-hidden -ml-[50vw] left-1/2 relative">


      {/* GRID */}
      <div className="grid auto-rows-[250px] md:auto-rows-[310px] md:grid-cols-3">
        {categoryData.map((item, i) => (
          <Tile key={i} {...item} />
        ))}
      </div>

    </section>
  );
};


export default CategoryMosaicGrid;
