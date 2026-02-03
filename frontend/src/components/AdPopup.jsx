import { useEffect, useState } from "react";

const AdPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenPopup");

    if (!hasSeenPopup) {
      setTimeout(() => setOpen(true), 600);
    }
  }, []);

  const closePopup = () => {
    localStorage.setItem("hasSeenPopup", "true");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      {/* Card */}
      <div className="relative w-[90%] max-w-lg animate-[scaleIn_.3s_ease]">

        {/* Close floating */}
        <button
          onClick={closePopup}
          className="absolute -top-4 -right-4 bg-white w-10 h-10 rounded-full shadow flex items-center justify-center text-lg hover:scale-110 transition"
        >
          ✕
        </button>

        <div className="bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 rounded-3xl p-[2px] shadow-2xl">
          <div className="bg-white rounded-3xl overflow-hidden">

            {/* Banner */}
            <img
              src="/banner.png"
              alt="Offer"
              className="w-full h-[240px] object-cover"
            />

            {/* Content */}
            <div className="p-6 text-center">

              <span className="inline-block mb-2 px-4 py-1 text-sm rounded-full bg-red-100 text-red-600 font-medium">
                Limited Time
              </span>

              <h2 className="text-3xl font-bold tracking-tight">
                Flat 30% OFF
              </h2>

              <p className="text-gray-500 mt-2">
                On your first order — don’t miss out 🔥
              </p>

              <button
                onClick={closePopup}
                className="mt-5 px-8 py-3 rounded-full bg-black text-white font-medium hover:scale-105 transition shadow-lg"
              >
                Shop Now →
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* animation */}
      <style>
        {`
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(.85);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>

    </div>
  );
};

export default AdPopup;
