"use client"
import { useState } from 'react';
import RouteComponent from '../../components/map-related/RouteComponent';
import { APILoadingStatus, APIProvider, Map } from '@vis.gl/react-google-maps';

const Page = () => {
  const [routeInfo, setRouteInfo] = useState(null);

  return (
    <div>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <Map>
      <RouteComponent 
        origin={{ lat: 25.761681, lng: -80.191788 }}  // Miami
        destination={{ lat: 28.5384, lng: -81.3789 }}  // Orlando
        onRouteCalculated={(info) => {
          console.log('Route Info:', info);
          console.log('Distance:', info.distance);
          setRouteInfo(info);
        }}
      />
      </Map>
      </APIProvider>
      {routeInfo && (
        <div style={{ 
          position: 'absolute', 
          top: 20, 
          left: 20, 
          background: 'white', 
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          <h3>Route Details:</h3>
          <p><strong>Duration:</strong> {routeInfo.duration}</p>
          <p><strong>Distance:</strong> {routeInfo.distance}</p>
          <p><strong>Duration (seconds):</strong> {routeInfo.durationValue}</p>
          <p><strong>Distance (meters):</strong> {routeInfo.distanceValue}</p>
        </div>
      )}
    </div>
  );
};

export default Page;