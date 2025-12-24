import React from "react";

const Hero = () => {
  return (
<div className="relative w-screen overflow-hidden -mt-20 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">

      
      {/* VIDEO */}
      <video
        src="/commercial.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-auto block"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* TEXT OVER VIDEO */}
      
    </div>
  );
};

export default Hero;
