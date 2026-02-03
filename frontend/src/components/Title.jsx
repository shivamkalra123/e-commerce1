import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="mb-8">
      <p className="text-xs tracking-[0.25em] text-gray-500 uppercase">
        Featured
      </p>
      <h2 className="title-font mt-2 text-3xl sm:text-4xl font-semibold text-gray-900">
        {text1} {text2}
      </h2>
    </div>
  );
};

export default Title;
