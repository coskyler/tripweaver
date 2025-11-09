"use client"

import { useState } from 'react';
import Header from '../components/sections/header'
import Footer from '../components/sections/footer';
import PlaceAutocomplete from '../components/map-related/PlaceAutocomplete';
import { APIProvider } from '@vis.gl/react-google-maps';

export default function Home() {
  const [startPlace, setStartPlace] = useState(null);
  const [destinationPlace, setDestinationPlace] = useState(null);

  const [formData, setFormData] = useState({
    prompt: '',
    startingCoords: {lat: 0, long: 0},
    targetCoords: {lat: 0, long: 0},
    transportationMethod: 'walking',
    tourMinutes: '', 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // TODO: Send to backend API
    const response = await fetch('/api/create-tour', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    console.log('Job ID:', data.jobId);
    
    // TODO: Navigate to results page or show loading state
  };

    const handleStartSelect = (place) => {
    setStartPlace(place);
    setFormData(prevFormData => ({
        ...prevFormData,
        startingCoords: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
        }
    }));
    };

    const handleDestinationSelect = (place) => {
    setDestinationPlace(place);
    setFormData(prevFormData => ({
        ...prevFormData,
        destinationCoords: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
        }
    }));
    };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section with Centered Horizontal Form */}
      <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden py-12">
        {/* Background Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-emerald-800/50 to-teal-900/60"></div>
        
        {/* Overlay Content */}
        <div className="relative z-10 w-[75%] max-w-7xl mx-auto px-6">
          {/* Main Search Form - Horizontal Layout */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 max-w-6xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Top Row - Natural Language Input (Full Width) */}
              <div className="w-full">
                <textarea
                  id="prompt"
                  name="prompt"
                  value={formData.prompt}
                  onChange={handleChange}
                  placeholder="Describe your tour (e.g., 'Historic landmarks and coffee shops, family-friendly activities')"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 resize-none placeholder:text-gray-400"
                  rows={2}
                  required
                />
              </div>

              {/* Bottom Row - Horizontal Fields */}
              <div className="flex flex-col lg:flex-row items-end gap-3">
                
                {/* Starting Location */}
                <div className="flex-1 w-full lg:w-auto">
                  <label htmlFor="startCoords" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    From
                  </label>
                    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>

                  <PlaceAutocomplete
                    type="text"
                    value={formData.startPlace}
                    onPlaceSelect={setStartPlace}
                    placeholder="Starting point"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 placeholder:text-gray-400"
                    required
                  />
                  </APIProvider>
                </div>

                {/* Ending Location */}
                <div className="flex-1 w-full lg:w-auto">
                  <label htmlFor="targetCoords" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    To <span className="text-gray-400 font-normal normal-case">(Optional)</span>
                  </label>
                                      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>

                  <PlaceAutocomplete
                    type="text"
                    value={formData.startPlace}
                    onPlaceSelect={setDestinationPlace}
                    placeholder="Round Trip or Destination"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 placeholder:text-gray-400"
                    required
                  />
                  </APIProvider>
                </div>

                {/* Tour Type */}
                <div className="w-full lg:w-48">
                  <label htmlFor="transportationMethod" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Tour Type
                  </label>
                  <select
                    id="transportationMethod"
                    name="transportationMethod"
                    value={formData.transportationMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 bg-white appearance-none cursor-pointer"
                    required
                  >
                    <option value="walking">Walking</option>
                    <option value="driving">Driving</option>
                  </select>
                </div>

                {/* Trip Length Slider */}
                <div className="w-full lg:w-48">
                  <label htmlFor="tourMinutes" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                    Miles: <span className="text-green-600 font-bold">{formData.tourMinutes || 5}</span>
                  </label>
                  <input
                    type="range"
                    id="tourMinutes"
                    name="tourMinutes"
                    value={formData.tourMinutes}
                    onChange={handleChange}
                    min="0.5"
                    max="50"
                    step="0.5"
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full lg:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-10 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  Explore
                </button>

              </div>

            </form>
          </div>
        </div>
      </section>

      {/* My past Tours */}
        

      {/* Footer */}
      <Footer />

    </div>
  );
}