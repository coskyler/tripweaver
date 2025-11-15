"use client"
import React, { useState, useEffect } from 'react';
import Header from '../../../components/sections/header';
import ProgressSection from '../../../components/sections/progressSection'
import Map from '../../../components/map-related/map'
import DestinationCard from '../../../components/sections/Destination';
import { AdvancedMarker, Pin, APIProvider } from '@vis.gl/react-google-maps';
import RouteComponent from "../../../components/map-related/RouteComponent";
import axios from 'axios';
import { useParams } from 'next/navigation';
import { auth } from "../../../lib/firebase";
import LoadingTour from '../../../components/sections/LoadingTour';

// Helper function to get pin colors based on position
const getPinColor = (index, totalCount) => {
  if (index === 0) {
    return { background: '#22c55e', glyphColor: '#fff', borderColor: '#16a34a' };
  } else if (index === totalCount - 1) {
    return { background: '#ef4444', glyphColor: '#fff', borderColor: '#dc2626' };
  } else {
    return { background: '#3b82f6', glyphColor: '#fff', borderColor: '#2563eb' };
  }
};

function Page() {
  const [routeDurations, setRouteDurations] = useState({});
  const [destinations, setDestinations] = useState([]);
  const [tourStatus, setTourStatus] = useState("loading");
  const [tourTitle, setTourTitle] = useState("");
  const [tourDescription, setTourDescription] = useState("");
  const { tourId } = useParams();

useEffect(() => {
  let timeout = null;

  const fetchData = async () => {
    const base = process.env.NEXT_PUBLIC_API_DOMAIN;

    const res = await axios.get(`${base}/tours/${tourId}`);
    const data = res.data;

    console.log(data);

    setTourTitle(data.tourName || "Curating your tour...");
    setTourStatus(data.status || "failed");
    setTourDescription(data.tourDescription || "");
    setDestinations(data.stops || []);

    // retry every 6s while generating
    if (data.status === "generating") {
      timeout = setTimeout(fetchData, 6000);
    }
  };

  fetchData();

  return () => {
    if (timeout) clearTimeout(timeout);
  };
}, [tourId]);



  return (
    <div className="flex h-dvh min-h-0 min-w-0 flex-col bg-[#FFF7E6]">
      <Header className="shrink-0" />

      <div className="flex flex-1 min-h-0 min-w-0">
        {/* Left pane: scrolls internally */}
        <div className="flex flex-col min-w-0 min-h-0 overflow-auto pt-8 px-4 w-full max-w-150">
          {/* Title + description */}
          <div className="mb-8 px-6 py-4">
            <h1 className="text-3xl font-semibold text-green-900 mb-2 tracking-tight">
              {tourTitle}
            </h1>
            {tourStatus !== "complete" && tourStatus !== "loading" ? (
              <LoadingTour />
            ) : (
              <p className="text-black text-sm leading-relaxed">
                {tourDescription}
              </p>
            )}
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
              <Map mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                {destinations.map((destination, index) => (
                  <React.Fragment key={destination.seq}>
                    {index < destinations.length - 1 && (
                      <RouteComponent
                        origin={{ lat: destination.lat, lng: destination.lng }}
                        destination={{
                          lat: destinations[index + 1].lat,
                          lng: destinations[index + 1].lng
                        }}
                        onRouteCalculated={(routeInfo) => {
                          setRouteDurations(prev => ({
                            ...prev,
                            [`${destination.seq}-${destinations[index + 1].seq}`]: routeInfo
                          }));
                        }}
                      />
                    )}

                    <AdvancedMarker position={{ lat: destination.lat, lng: destination.lng }}>
                      <Pin
                        {...getPinColor(index, destinations.length)}
                        glyph={destination.seq.toString()}
                      />
                    </AdvancedMarker>
                  </React.Fragment>
                ))}

                {Object.entries(routeDurations).map(([key, info]) => (
                  <div key={key}>
                    Route {key}: {info.duration} ({info.distance})
                  </div>
                ))}
              </Map>
            </APIProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
