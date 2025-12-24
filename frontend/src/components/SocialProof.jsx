const images = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=987&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=987&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=987&auto=format&fit=crop",
];

const SocialProof = () => {
  return (
    <div>
      <h2 className="text-3xl font-light text-center mb-16">
        Worn by real people
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        {images.map((img, i) => (
          <div key={i} className="text-center">
            <img
              src={img}
              alt="Customer"
              className="w-full h-[300px] object-cover rounded-xl mb-4"
            />
            <p className="text-sm text-gray-600">
              “Comfortable, clean, and easy to style.”
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialProof;
