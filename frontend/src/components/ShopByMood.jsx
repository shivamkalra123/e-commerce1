import { Link } from "react-router-dom";
import { Trans } from "@lingui/macro";

import chill from "../assets/mood-chill.jpg";
import work from "../assets/mood-work.jpg";
import night from "../assets/mood-night.jpg";
import everyday from "../assets/mood-everyday.jpg";

const moods = [
  { id: "chill", img: chill, link: "/collection?mood=chill" },
  { id: "work", img: work, link: "/collection?mood=work" },
  { id: "night", img: night, link: "/collection?mood=night" },
  { id: "everyday", img: everyday, link: "/collection" },
];

const ShopByMood = () => {
  return (
    <div>
      <h2 className="text-3xl font-light text-center mb-16">
        <Trans>Shop by Mood</Trans>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {moods.map((mood) => (
          <Link
            key={mood.id}
            to={mood.link}
            className="group relative h-[340px] overflow-hidden rounded-2xl"
          >
            <img
              src={mood.img}
              alt={mood.id}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-medium">
                <Trans id={`mood.${mood.id}`}>
                  {mood.id}
                </Trans>
              </h3>

              <p className="text-sm opacity-80 mt-1">
                <Trans>Explore →</Trans>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopByMood;
