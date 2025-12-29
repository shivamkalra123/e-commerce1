import React from "react";
const Hero = () => {
  return (
    <div className="relative w-screen overflow-hidden -mt-20 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      
      <video
        src="/commercial.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-screen object-cover"
      />

      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

    </div>
  );
};


export default Hero;
