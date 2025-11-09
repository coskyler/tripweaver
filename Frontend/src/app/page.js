
"use client"

import { useState } from 'react';
import Header from '../components/sections/header'
import Footer from '../components/sections/footer';

export default function Home() {
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

      {/* Hero Section with Centered Form */}
      <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden py-12">
        {/* Background Image Placeholder - Replace with actual image */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100"></div>
        
        {/* Overlay Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold text-black mb-4">
              Discover Your Perfect Tour
            </h2>
            <p className="text-xl text-gray-700">
              Plan smarter with AI-powered personalized travel experiences
            </p>
          </div>

          {/* Main Search Form - Centered in Hero */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Natural Language Input - PRIMARY INPUT */}
              <div className="text-left">
                <label htmlFor="prompt" className="block text-sm font-semibold text-black mb-2">
                  Describe Your Tour
                </label>
                <textarea
                  id="prompt"
                  name="prompt"
                  value={formData.prompt}
                  onChange={handleChange}
                  placeholder="E.g., 'Show me historic landmarks and coffee shops in downtown, family-friendly activities'"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-black resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Grid Layout for Other Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Start Location */}
                <div className="text-left">
                  <label htmlFor="startCoords" className="block text-sm font-semibold text-black mb-2">
                    Starting Location
                  </label>
                  <input
                    type="text"
                    id="startCoords"
                    name="startCoords"
                    value={formData.startCoords}
                    onChange={handleChange}
                    placeholder="Enter address or landmark"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-black"
                    required
                  />
                </div>

                {/* Target Location (Optional) */}
                <div className="text-left">
                  <label htmlFor="targetCoords" className="block text-sm font-semibold text-black mb-2">
                    Ending Location <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="targetCoords"
                    name="targetCoords"
                    value={formData.targetCoords}
                    onChange={handleChange}
                    placeholder="Leave blank for round trip"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-black"
                  />
                </div>

                {/* Tour Type */}
                <div className="text-left">
                  <label htmlFor="transportationMethod" className="block text-sm font-semibold text-black mb-2">
                    Tour Type
                  </label>
                  <select
                    id="transportationMethod"
                    name="transportationMethod"
                    value={formData.transportationMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-black bg-white"
                    required
                  >
                    <option value="walking">Walking Tour</option>
                    <option value="driving">Driving Tour</option>
                  </select>
                </div>

                {/* Trip Length */}
                <div className="text-left">
                  <label htmlFor="tourMinutes" className="block text-sm font-semibold text-black mb-2">
                    Desired Trip Length (miles)
                  </label>
                  <input
                    type="number"
                    id="tourMinutes"
                    name="tourMinutes"
                    value={formData.tourMinutes}
                    onChange={handleChange}
                    placeholder="E.g., 5"
                    min="0.1"
                    step="0.1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none text-black"
                    required
                  />
                </div>

              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition-colors duration-200 text-lg"
              >
                Generate My Tour
              </button>

            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
}