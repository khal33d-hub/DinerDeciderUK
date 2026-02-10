import React from 'react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  selected?: boolean;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, selected }) => {
  return (
    <a 
      href={restaurant.uri}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-4 rounded-xl border transition-all duration-300 group
        ${selected 
          ? 'bg-orange-50 border-orange-500 shadow-orange-200 shadow-lg scale-105 ring-2 ring-orange-400' 
          : 'bg-white border-slate-200 hover:border-orange-300 hover:shadow-md'
        }
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className={`font-bold text-lg mb-1 group-hover:text-orange-600 transition-colors ${selected ? 'text-orange-700' : 'text-slate-800'}`}>
            {restaurant.name}
          </h3>
          <p className="text-sm text-slate-400 flex items-center gap-1">
             <i className="fa-solid fa-map-pin text-xs"></i> View on Google Maps
          </p>
        </div>
        <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <i className="fa-solid fa-arrow-up-right-from-square"></i>
        </div>
      </div>
    </a>
  );
};
