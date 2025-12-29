import React, { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { Trans } from "@lingui/macro";

const stats = [
  { value: 50000, suffix: "+", label: "Happy customers" },
  { value: 1000000, suffix: "+", label: "Orders delivered" },
  { value: 24, suffix: "/7", label: "Customer support" },
  { value: 4.9, suffix: "★", decimals: 1, label: "Average rating" },
];

const StatsCounter = () => {
  const ref = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="max-w-7xl mx-auto px-6 py-24"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {stats.map((stat, index) => (
          <div key={index}>
            <h3 className="text-4xl md:text-5xl font-light mb-2">
              {start && (
                <CountUp
                  end={stat.value}
                  duration={2.2}
                  decimals={stat.decimals || 0}
                />
              )}
              {stat.suffix}
            </h3>

            <p className="text-gray-500 text-sm uppercase tracking-wide">
              <Trans>{stat.label}</Trans>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsCounter;
