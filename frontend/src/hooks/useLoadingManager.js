import { useState, useEffect } from 'react';

const useLoadingManager = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');

  const updateProgress = (value, newStatus) => {
    setProgress(value);
    if (newStatus) setStatus(newStatus);
  };

  useEffect(() => {
    // Simulate loading steps
    const steps = [
      { progress: 10, status: 'Loading application...' },
      { progress: 30, status: 'Initializing services...' },
      { progress: 50, status: 'Warming up APIs...' },
      { progress: 70, status: 'Loading products...' },
      { progress: 90, status: 'Preparing your wishlist...' },
      { progress: 100, status: 'Almost ready...' },
    ];

    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        updateProgress(steps[currentStep].progress, steps[currentStep].status);
        currentStep++;
      } else {
        clearInterval(interval);
        // Final delay before hiding loader
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return { loading, progress, status, setLoading };
};

export default useLoadingManager;