'use client';

import React, { useState } from 'react';
import PlaceAutocomplete from '../../components/map-related/PlaceAutocomplete';
import { APIProvider } from '@vis.gl/react-google-maps';

function Page() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handlePlaceSelect = (place) => {
    console.log('Selected Place:', place);
    setSelectedPlace(place);
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div style={{ padding: '20px' }}>
        <h1>Place Autocomplete</h1>
        <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} />
        {selectedPlace && (
          <div style={{ marginTop: '20px' }}>
            <h2>Selected Location:</h2>
            <p>Latitude: {selectedPlace.lat}</p>
            <p>Longitude: {selectedPlace.lng}</p>
          </div>
        )}
      </div>
    </APIProvider>
  );
}

export default Page;
