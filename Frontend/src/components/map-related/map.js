'use client'

import React from 'react'
import { APIProvider, Map as GoogleMap } from '@vis.gl/react-google-maps'


export default function Map(style, defaultCenter, defaultZoom) {
  return (
      <div className="w-full">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
            style={{ width: '65vw', height: '100vh' }}
            defaultCenter={{ lat: 40.7128, lng: -74.0060 }}
            defaultZoom={10}
            gestureHandling='greedy'
            disableDefaultUI
        />
        </APIProvider>
        </div>
  )
}
