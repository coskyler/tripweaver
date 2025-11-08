import React, { useState } from 'react';
import { MapPin, Clock, Star, DollarSign, Navigation } from 'lucide-react';

const DestinationCard = ({ destination, index, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-lg shadow-md hover:shadow-xl 
        transition-all duration-300 cursor-pointer mb-4 p-4 border-l-4
        ${isSelected ? 'border-l-green-500 shadow-xl scale-102' : 'border-l-gray-300'}
      `}
    >
      {/* Destination Number Badge */}
      <div className="absolute -top-2 -left-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
        {index + 1}
      </div>

      {/* Main Content */}
      <div className="ml-2">
        {/* Destination Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-1 pr-8">
          {destination.name}
        </h3>

        {/* Address */}
        <div className="flex items-start text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{destination.address}</span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          {/* Rating */}
          {destination.rating && (
            <div className="flex items-center text-gray-700">
              <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{destination.rating}</span>
              <span className="text-gray-500 ml-1">
                ({destination.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price Level */}
          {destination.priceLevel && (
            <div className="flex items-center text-gray-700">
              <DollarSign className="w-4 h-4 mr-1 text-green-600" />
              <span className="font-semibold">
                {'$'.repeat(destination.priceLevel)}
              </span>
            </div>
          )}

          {/* Distance */}
          {destination.distance && (
            <div className="flex items-center text-gray-700">
              <Navigation className="w-4 h-4 mr-1 text-blue-600" />
              <span>{destination.distance}</span>
            </div>
          )}

          {/* Duration */}
          {destination.duration && (
            <div className="flex items-center text-gray-700">
              <Clock className="w-4 h-4 mr-1 text-purple-600" />
              <span>{destination.duration}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {destination.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {destination.description}
          </p>
        )}

        {/* Tags/Categories */}
        {destination.types && destination.types.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {destination.types.slice(0, 3).map((type, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
