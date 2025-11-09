"use client"
import React, { useState, useEffect } from 'react';
import Header from '../../../components/sections/header';
import ProgressSection from '../../../components/sections/progressSection'
import Map from '../../../components/map-related/map'
import DestinationCard from '../../../components/sections/Destination';
import { AdvancedMarker, Pin, APIProvider } from '@vis.gl/react-google-maps';
import RouteComponent from "../../../components/map-related/RouteComponent";

// Helper function to get pin colors based on position
const getPinColor = (index, totalCount) => {
  if (index === 0) {
    // First destination - green (start)
    return { background: '#22c55e', glyphColor: '#fff', borderColor: '#16a34a' };
  } else if (index === totalCount - 1) {
    // Last destination - red (end)
    return { background: '#ef4444', glyphColor: '#fff', borderColor: '#dc2626' };
  } else {
    // Middle destinations - blue
    return { background: '#3b82f6', glyphColor: '#fff', borderColor: '#2563eb' };
  }
};
import axios from 'axios';
import { useParams } from 'next/navigation';
import { auth } from "../../../lib/firebase";

function Page() {
  const [currentStep, setCurrentStep] = useState(0);
  const [destinations, setDestinations] = useState([]);
  const { tourId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      let user = auth.currentUser;

      // wait until Firebase finishes loading the user

      while (!user) {
        await new Promise((r) => setTimeout(r, 100));
        user = auth.currentUser;
      }
      console.log("user loaded!");

      const token = await user.getIdToken();
      const base = process.env.NEXT_PUBLIC_API_DOMAIN;
      const res = await axios.get(`${base}/tours/${tourId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDestinations(res.data || []);
    };

    fetchData();
  }, [tourId]);



  return (
    <div className="flex h-dvh min-h-0 min-w-0 flex-col">
      <Header className="shrink-0" />

      <div className="flex flex-1 min-h-0 min-w-0">
        {/* Left pane: scrolls internally */}
        <div className="flex flex-col min-w-0 min-h-0 overflow-auto pt-8 px-4">
          {/* Title + description */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Your Tour Plan</h1>
            <p className="text-gray-600 text-sm">
              Explore your personalized itinerary below. Each stop is ordered for an optimal route.
            </p>
          </div>

          {/* Destination list */}
          {destinations.map((destination) => (
            <div key={destination.seq} className="relative py-2">
              <DestinationCard
                number={destination.seq}
                name={destination.name}
                address={destination.address}
                description={destination.description}
                rating={destination.rating}
                priceLevel={destination.price}
                category="Attraction"
                imageUrl={destination.photo}
              />
            </div>
          ))}
        </div>

        {/* Right pane: map */}
        <div className="flex-1 min-w-0 relative">

          <div className="absolute inset-0">
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <Map />
            </APIProvider>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Page;
