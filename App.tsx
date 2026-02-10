import React, { useState, useCallback } from 'react';
import { Hero } from './components/Hero';
import { RestaurantCard } from './components/RestaurantCard';
import { PickerOverlay } from './components/PickerOverlay';
import { findRestaurantsNearLocation } from './services/gemini';
import { AppState, Restaurant } from './types';

function App() {
  const [state, setState] = useState<AppState>('IDLE');
  const [statusText, setStatusText] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [summaryText, setSummaryText] = useState('');
  const [winner, setWinner] = useState<Restaurant | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentPostcode, setCurrentPostcode] = useState('');

  const handleStart = useCallback(async (postcode: string) => {
    setState('SEARCHING');
    setStatusText(`Searching for restaurants near ${postcode}...`);
    setCurrentPostcode(postcode);
    
    try {
      const { text, restaurants: foundRestaurants } = await findRestaurantsNearLocation(postcode);
      if (foundRestaurants.length === 0) {
          throw new Error("No restaurants found via Google Maps. Try a different postcode.");
      }
      setSummaryText(text);
      setRestaurants(foundRestaurants);
      setState('RESULTS');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to find restaurants.');
      setState('ERROR');
    }
  }, []);

  const handlePickForMe = () => {
    setState('PICKING');
  };

  const handlePickComplete = (restaurant: Restaurant) => {
    setWinner(restaurant);
    setState('RESULTS'); // Go back to results, but with a winner highlighted
  };

  const handleReset = () => {
    setWinner(null);
    setState('IDLE');
    setRestaurants([]);
    setSummaryText('');
    setCurrentPostcode('');
  };

  // -- RENDER HELPERS --

  if (state === 'IDLE' || state === 'LOCATING' || state === 'SEARCHING') {
    return <Hero onStart={handleStart} isLoading={state === 'SEARCHING'} statusText={statusText} />;
  }

  if (state === 'ERROR') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-red-50">
        <div className="text-red-500 text-5xl mb-4">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
        <p className="text-slate-600 mb-6">{errorMsg}</p>
        <button
          onClick={handleReset}
          className="bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 text-orange-600">
          <i className="fa-solid fa-utensils"></i>
          <span className="font-bold text-lg tracking-tight">DineDecider</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-medium">
             <i className="fa-solid fa-location-dot mr-1"></i> {currentPostcode}
          </span>
          <button onClick={handleReset} className="text-sm text-slate-500 hover:text-orange-600">
            New Search
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-3xl mx-auto w-full">
        
        {/* AI Summary Section */}
        <div className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-3 text-orange-600 font-semibold text-sm uppercase tracking-wide">
            <i className="fa-solid fa-robot"></i>
            <span>AI Chef's Summary</span>
          </div>
          <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed">
             {/* Simple rendering of the text summary - usually markdown from Gemini */}
             {summaryText.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
             ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-8 sticky top-[80px] z-20">
           {winner ? (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white text-center animate-pulse-fast">
                <p className="text-green-100 text-sm font-bold uppercase mb-1">We Chose For You</p>
                <h2 className="text-3xl font-extrabold mb-4">{winner.name}</h2>
                <a 
                  href={winner.uri} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block bg-white text-green-600 px-6 py-2 rounded-full font-bold hover:bg-green-50 transition shadow-md"
                >
                  Get Directions <i className="fa-solid fa-arrow-right ml-1"></i>
                </a>
              </div>
           ) : (
            <button
              onClick={handlePickForMe}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xl font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-shuffle"></i>
              Pick a Restaurant For Me!
            </button>
           )}
        </div>

        {/* List */}
        <div className="space-y-4">
          <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider pl-1">
            Found {restaurants.length} Places Nearby
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurants.map((place) => (
              <RestaurantCard 
                key={place.id} 
                restaurant={place} 
                selected={winner?.id === place.id}
              />
            ))}
          </div>
        </div>
        
        <div className="h-10"></div> {/* Spacer */}
      </main>

      {/* Overlay Modal */}
      {state === 'PICKING' && (
        <PickerOverlay 
          restaurants={restaurants} 
          onComplete={handlePickComplete}
          onCancel={() => setState('RESULTS')} 
        />
      )}
    </div>
  );
}

export default App;