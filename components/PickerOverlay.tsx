import React, { useEffect, useState } from 'react';
import { Restaurant } from '../types';

interface PickerOverlayProps {
  restaurants: Restaurant[];
  onComplete: (winner: Restaurant) => void;
  onCancel: () => void;
}

export const PickerOverlay: React.FC<PickerOverlayProps> = ({ restaurants, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(50);
  const [isStopping, setIsStopping] = useState(false);
  
  // Choose winner on mount
  const [winnerIndex] = useState(() => Math.floor(Math.random() * restaurants.length));

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let currentSpeed = speed;

    const cycle = () => {
      setCurrentIndex((prev) => (prev + 1) % restaurants.length);

      if (isStopping) {
        // Decelerate
        currentSpeed *= 1.1; 
        if (currentSpeed > 400) {
            // Snap to winner if we are slow enough and close
            if (currentIndex === winnerIndex) {
                 setTimeout(() => onComplete(restaurants[winnerIndex]), 500);
                 return; 
            }
        }
      }

      timeoutId = setTimeout(cycle, currentSpeed);
    };

    timeoutId = setTimeout(cycle, currentSpeed);

    // Start stopping process after 2 seconds
    const stopTimeout = setTimeout(() => {
      setIsStopping(true);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(stopTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStopping, speed]); // Intentionally simplified dep array for the roulette effect

  const currentRestaurant = restaurants[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 text-center shadow-2xl border-4 border-orange-500 relative overflow-hidden">
        
        {/* Confetti or decorative elements could go here */}
        
        <h2 className="text-2xl font-bold text-slate-700 mb-8 uppercase tracking-wider">
          Choosing your meal...
        </h2>

        <div className="h-40 flex items-center justify-center mb-8">
           <div className="transform transition-all duration-100 scale-110">
              <h3 className="text-4xl font-black text-orange-600 leading-tight">
                {currentRestaurant.name}
              </h3>
           </div>
        </div>

        <button 
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 text-sm font-semibold underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};