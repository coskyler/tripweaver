"use client"

import Map from "../../components/map-related/map";
import DestinationCard from "../../components/sections/Destination"
import React, {useState} from 'react';

// Demo component showing usage
const DestinationCardDemo = () => {

  const sampleDestinations = [
    {
      id: 1,
      name: "The Wharf Marina",
      address: "401 Biscayne Blvd, Miami, FL 33132",
      description: "Scenic waterfront destination perfect for evening strolls and sunset views. Features multiple dining options and boat tours.",
      rating: 4.7,
      reviewCount: 342,
      priceLevel: 2,
      category: "Attraction",
      estimatedTime: "30 min",
      distance: "0.3 mi",
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Café Lumière",
      address: "1250 Collins Ave, Miami Beach, FL 33139",
      description: "Charming French-inspired café serving artisanal pastries and specialty coffee in a cozy atmosphere.",
      rating: 4.5,
      reviewCount: 189,
      priceLevel: 2,
      category: "Restaurant",
      estimatedTime: "20 min",
      distance: "0.8 mi",
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Ocean View Park",
      address: "500 Ocean Drive, Miami Beach, FL 33139",
      description: "Beautiful beachside park with walking trails, picnic areas, and stunning ocean panoramas. Great for relaxation and photography.",
      rating: 4.8,
      reviewCount: 521,
      priceLevel: 1,
      category: "Park",
      estimatedTime: "45 min",
      distance: "1.2 mi",
    },
    {
      id: 4,
      name: "Artisan Market Square",
      address: "789 Lincoln Road, Miami Beach, FL 33139",
      description: "Vibrant marketplace featuring local artisans, handcrafted goods, and live entertainment every weekend.",
      rating: 4.4,
      reviewCount: 267,
      priceLevel: 2,
      category: "Shopping",
      estimatedTime: "40 min",
      distance: "0.6 mi",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">


        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Destination Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                {sampleDestinations.length}
              </span>
              Tour Stops
            </h2>
            
            {sampleDestinations.map((name, destination, index) => (
              <div key={destination.id} className="relative">
                {/* Stop Number Badge */}
                <div className="absolute -left-3 top-4 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-10">
                  {index + 1}
                </div>
                <DestinationCard
                  {...destination}
                  onClick={() => setActiveCard(destination.id)}
                />
              </div>
            ))}
          </div>

          {/* Right Column - Map Placeholder */}
            <Map>
            </Map>
        </div>

        {/* Tour Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Miami Beach Explorer Tour</h3>
              <p className="text-sm text-gray-600">Walking tour • 3.2 miles • ~2.5 hours</p>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
              Start Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationCardDemo;