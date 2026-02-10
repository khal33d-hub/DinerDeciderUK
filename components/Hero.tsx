import React, { useState } from 'react';

interface HeroProps {
  onStart: (postcode: string) => void;
  isLoading: boolean;
  statusText: string;
}

export const Hero: React.FC<HeroProps> = ({ onStart, isLoading, statusText }) => {
  const [postcode, setPostcode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postcode.trim()) {
      onStart(postcode);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-orange-100 transform transition-all hover:scale-[1.01]">
        <div className="mb-6 bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-orange-500 text-4xl">
          <i className="fa-solid fa-utensils"></i>
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">
          DineDecider UK
        </h1>
        <p className="text-slate-500 mb-8">
          Can't decide where to eat? Enter your postcode and let AI find the best spots and pick a winner.
        </p>

        {isLoading ? (
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-orange-600 font-medium">{statusText}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <i className="fa-solid fa-map-pin"></i>
              </div>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="Enter UK Postcode (e.g. SW1A 1AA)"
                className="w-full pl-10 pr-4 py-4 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-slate-800 placeholder-slate-400 transition-all bg-slate-50 focus:bg-white"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={!postcode.trim()}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-3 text-lg"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
              Find Food
            </button>
          </form>
        )}
        
        <p className="mt-4 text-xs text-slate-400">
          Powered by Gemini & Google Maps.
        </p>
      </div>
    </div>
  );
};