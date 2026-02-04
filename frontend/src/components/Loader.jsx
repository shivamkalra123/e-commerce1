import React, { useState, useEffect } from "react";
import { Heart, ShoppingBag, Star, Sparkles, Package, Gift } from "lucide-react";

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Starting up your shopping experience...");

  // Simulate loading progress - Slower timing (total ~6 seconds)
  useEffect(() => {
    const steps = [
      { progress: 15, status: "Initializing shopping platform..." },
      { progress: 30, status: "Warming up wishlist services..." },
      { progress: 45, status: "Loading product catalog..." },
      { progress: 60, status: "Preparing your shopping cart..." },
      { progress: 75, status: "Setting up secure checkout..." },
      { progress: 85, status: "Optimizing performance..." },
      { progress: 95, status: "Final touches..." },
      { progress: 98, status: "Almost ready..." },
    ];

    let currentStep = 0;
    
    // Function to advance steps
    const advanceStep = () => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].progress);
        setStatus(steps[currentStep].status);
        currentStep++;
      } else {
        // Final step - show 100% for a moment
        setProgress(100);
        setStatus("Ready to shop!");
        clearInterval(interval);
      }
    };

    // Slower interval (650ms per step = ~5.2 seconds total)
    const interval = setInterval(advanceStep, 650);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-white via-gray-50 to-blue-50 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating circles - slower animation */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-100 rounded-full animate-float-slower opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-100 rounded-full animate-float-delayed-slower opacity-20"></div>
        <div className="absolute top-1/3 right-1/3 w-28 h-28 bg-pink-100 rounded-full animate-float-slowest opacity-20"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-indigo-100 rounded-full animate-float-slow opacity-20"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/50 via-transparent to-blue-50/30"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(90deg,#000_1px,transparent_1px),linear-gradient(180deg,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 max-w-2xl">
        
        {/* Logo with glow effect */}
        <div className="mb-12 relative">
          <div className="absolute -inset-6 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl rounded-full animate-pulse-slow"></div>
          <div className="relative z-10">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-56 h-auto transform transition-transform duration-700 hover:scale-105"
            />
          </div>
          {/* Animated rings around logo */}
          <div className="absolute -inset-8 border-2 border-blue-200/30 rounded-full animate-ping-slow"></div>
          <div className="absolute -inset-12 border-2 border-purple-200/20 rounded-full animate-ping-slower"></div>
        </div>

        {/* Animated product icons ring - slower rotation */}
        <div className="relative w-48 h-48 mb-12">
          {/* Outer ring with gradient progress */}
          <div className="absolute inset-0 rounded-full border-10 border-gray-100/50 shadow-inner"></div>
          
          {/* Progress ring with smooth gradient */}
          <div 
            className="absolute inset-0 rounded-full border-10 border-transparent transition-all duration-1000 ease-out"
            style={{
              background: `conic-gradient(
                #4f46e5 0%, 
                #7c3aed ${progress}%, 
                #e5e7eb ${progress}%, 
                #e5e7eb 100%
              )`,
              mask: 'radial-gradient(transparent 65%, black 66%)',
              WebkitMask: 'radial-gradient(transparent 65%, black 66%)',
            }}
          ></div>
          
          {/* Rotating icons - slower rotation */}
          <div className="absolute inset-0 animate-spin-very-slow">
            <Heart className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 text-red-500 drop-shadow-lg" />
            <ShoppingBag className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-7 h-7 text-blue-600 drop-shadow-lg" />
            <Package className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-7 h-7 text-green-600 drop-shadow-lg" />
            <Star className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 text-yellow-500 drop-shadow-lg" />
          </div>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative">
              <Sparkles className="w-10 h-10 text-purple-500 mb-2 animate-sparkle" />
              <div className="absolute -inset-2 bg-purple-500/10 blur-sm rounded-full"></div>
            </div>
            <span className="text-2xl font-bold text-gray-800 mt-2">
              {progress}%
            </span>
            <p className="text-xs text-gray-500 mt-1">Loading complete</p>
          </div>
        </div>

        {/* Status and progress */}
        <div className="text-center w-full max-w-xl">
          <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            {status}
          </h3>
          
          {/* Progress bar with glow - slower transition */}
          <div className="relative mb-10">
            <div className="w-full h-4 bg-gray-200/50 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {/* Glow effect */}
            <div 
              className="absolute top-0 h-4 bg-gradient-to-r from-blue-400/40 via-purple-400/40 to-pink-400/40 rounded-full blur transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
            
            {/* Progress markers */}
            <div className="flex justify-between mt-2 px-1">
              <span className="text-xs text-gray-400">0%</span>
              <span className="text-xs text-gray-400">25%</span>
              <span className="text-xs text-gray-400">50%</span>
              <span className="text-xs text-gray-400">75%</span>
              <span className="text-xs text-gray-400">100%</span>
            </div>
          </div>

          {/* Loading tips with staggered animation */}
          <div className="space-y-4 text-base text-gray-700 mb-10">
            <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0s' }}>
              <div className="relative">
                <Gift className="w-5 h-5 text-blue-500 animate-bounce-slow" />
                <div className="absolute -inset-1 bg-blue-100 rounded-full blur-sm"></div>
              </div>
              <span className="font-medium">Discover amazing deals and offers</span>
            </div>
            <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                <Heart className="w-5 h-5 text-red-500 animate-bounce-slow" style={{ animationDelay: '0.2s' }} />
                <div className="absolute -inset-1 bg-red-100 rounded-full blur-sm"></div>
              </div>
              <span className="font-medium">Save items to your personal wishlist</span>
            </div>
            <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-green-500 animate-bounce-slow" style={{ animationDelay: '0.4s' }} />
                <div className="absolute -inset-1 bg-green-100 rounded-full blur-sm"></div>
              </div>
              <span className="font-medium">Fast, secure, and seamless checkout</span>
            </div>
          </div>

          {/* Decorative message */}
          <div className="relative">
            <p className="text-sm text-gray-500 italic px-8 py-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
              <span className="block mb-1">✨ Premium shopping experience loading...</span>
              <span className="text-xs">Sit back while we prepare everything for you. This ensures optimal performance on your first visit.</span>
            </p>
            {/* Corner accents */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-blue-400 rounded-tl-lg"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-purple-400 rounded-tr-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-pink-400 rounded-bl-lg"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-400 rounded-br-lg"></div>
          </div>
        </div>

        {/* Floating particles - more particles, slower */}
        <div className="absolute -bottom-24 left-0 right-0 flex justify-center">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                opacity: 0.3 + Math.random() * 0.4,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="absolute bottom-6 text-sm text-gray-500 font-light">
        © {new Date().getFullYear()} Premium E-Commerce Store. Crafting exceptional shopping experiences.
      </div>
      
      {/* Load time indicator */}
      <div className="absolute top-6 right-6 text-xs text-gray-400 bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full">
        Optimizing for your first visit
      </div>
    </div>
  );
};

export default Loader;