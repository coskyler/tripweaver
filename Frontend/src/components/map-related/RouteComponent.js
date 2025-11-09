'use client'
import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

function RouteComponent({ origin, destination, onRouteCalculated }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true, // Use custom markers
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 5,
        strokeOpacity: 0.7
      }
    });

    directionsService.route(
      {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
          
          // Get route info
          const route = result.routes[0];
          const leg = route.legs[0];
          
          console.log('Distance:', leg.distance.text);
          console.log('Duration:', leg.duration.text);
          
          // Call the callback with route info
          if (onRouteCalculated) {
            onRouteCalculated({
              duration: leg.duration.text,        // e.g., "3 hours 30 mins"
              distance: leg.distance.text,        // e.g., "235 mi"
              durationValue: leg.duration.value,  // in seconds
              distanceValue: leg.distance.value   // in meters
            });
          }
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );

    return () => {
      directionsRenderer.setMap(null);
    };
  }, [map, origin, destination, onRouteCalculated]);

  return null;
}

export default RouteComponent;