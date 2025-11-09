"use client"
import React, {useState, useEffect} from 'react';
import Header from '../../../components/sections/header';
import ProgressSection from '../../../components/sections/progressSection'
import Map from '../../../components/map-related/map'
import DestinationCard from '../../../components/sections/Destination';




function page() {
  const [currentStep, setCurrentStep] = useState(0);
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
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop"
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

  // Simulate progress
  /*
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 6) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    return () => {
      clearInterval(stepInterval);
    };
  }, []);
  */

  return (
    <>
    <Header/>
    <div className="flex h-screen">
        <div className="w-1/2 overflow-y-auto pt-8">
            {/*
            <ProgressSection 
            currentStep={currentStep} /> */}
            {sampleDestinations.map((destination) => (
              <div key={destination.id} className="relative px-6 py-1">
                <DestinationCard
                  number={destination.id}

                  {...destination}
                />
              </div>
            ))}
        </div>

        <div className="w-2/3 h-screen overflow-hidden">
            <Map>
            </Map>
        </div>
    </div>
    </>
  )
}

export default page