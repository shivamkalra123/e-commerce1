import { Link } from "react-router-dom";

const OneProductManyWays = () => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-light mb-6">
        One product. Many moments.
      </h2>

      <p className="text-gray-600 max-w-xl mx-auto mb-16">
        Designed to fit seamlessly into your day — no matter where it takes you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-16">
        <div>
          <h4 className="font-medium">Casual</h4>
          <p className="text-sm text-gray-500 mt-2">
            Easy, breathable, relaxed.
          </p>
        </div>
        <div>
          <h4 className="font-medium">Work</h4>
          <p className="text-sm text-gray-500 mt-2">
            Clean and structured.
          </p>
        </div>
        <div>
          <h4 className="font-medium">Night</h4>
          <p className="text-sm text-gray-500 mt-2">
            Sharp with minimal effort.
          </p>
        </div>
      </div>

      <Link
        to="/collection"
        className="inline-block border border-black px-10 py-3 text-sm hover:bg-black hover:text-white transition"
      >
        View Product
      </Link>
    </div>
  );
};

export default OneProductManyWays;
