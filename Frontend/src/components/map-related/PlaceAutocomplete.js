'use client';

import React, { useRef, useEffect } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

export default function PlaceAutocomplete({ onPlaceSelect, className }) {
  const inputRef = useRef(null);
  const places = useMapsLibrary('places');
  const autocomplete = useRef(null);

  useEffect(() => {
    if (!places || !inputRef.current) {
      return;
    }

    const options = {
      fields: ['geometry', 'name', 'formatted_address']
    };

    autocomplete.current = new places.Autocomplete(inputRef.current, options);

    autocomplete.current.addListener('place_changed', () => {
      const place = autocomplete.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        if (onPlaceSelect) {
          onPlaceSelect({ lat, lng });
        }
      }
    });

  }, [places, onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Enter a location"
      className={`${className} pac-input`}
    />
  );
}
