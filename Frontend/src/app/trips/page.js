"use client";

import { useState } from "react";
import Header from "../../components/sections/header";
import Footer from "../../components/sections/footer";
import PlaceAutocomplete from "../../components/map-related/PlaceAutocomplete";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useRouter } from "next/navigation"
import axios from "axios"

export default function Home() {


  const [formData, setFormData] = useState({
    prompt: "",
    startingCoords: { lat: 0, lng: 0 },
    targetCoords: { lat: 0, lng: 0 },
    transportationMethod: "walking",
    searchRadius: "",
    tourBudget: "",
    city: "",
  });

  const router = useRouter()

  {/* still working
  useEffect( () => {
      const fetchTours = async () => {
    try {
      const ownerId = "some-user-id"; // Replace with actual user ID
      const response = await axios.get(`http://localhost:8085/tours?owner=${ownerId}`);
      setTours(response.data);
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false);
    }
  })
    */

    const handleSubmit = async (e) => {
      e.preventDefault();
      // This is a placeholder. You'll need to get the actual logged-in user's ID.
      const ownerId = "some-user-id";

      try {
        const response = await axios.post("http://localhost:8085/tours", {
          userPrompt: formData.prompt,
          startingCoords: formData.startingCoords,
          targetCoords: formData.targetCoords,
          budget: formData.tourBudget,
          transportationMethod: formData.transportationMethod,
          searchRadius: formData.searchRadius,
          city: formData.city,
          owner: ownerId, // Add the owner ID here
        });

        const tourId = response.data.id;
        console.log("Tour ID:", tourId);

        // Navigate to the new trip page on success
        router.push(`/trips/${tourId}`);
      } catch (error) {
        console.error("Error creating tour:", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Data:", error.response.data);
          console.error("Status:", error.response.status);
          console.error("Headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Request:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error Message:", error.message);
        }
      }
    };


    /*
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log(formData);
        // TODO: Send to backend API
        const response = await fetch("/api/create-tour", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
    
        const data = await response.json();
        console.log("Job ID:", data.jobId);
    
        // TODO: Navigate to results page or show loading state
      };*/

    const handleStartSelect = (place) => {
      console.log("startplace", place);
      console.log("startplace", place.city);
      setFormData((prevFormData) => ({
        ...prevFormData,
        startingCoords: {
          lat: place.lat,
          lng: place.lng,
        },
        city: place.city,
      }));
    };

    const handleDestinationSelect = (place) => {
      console.log("destplace", place);
      setFormData((prevFormData) => ({
        ...prevFormData,
        targetCoords: {
          lat: place.lat,
          lng: place.lng,
        },
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

        {/* Hero Section with Centered Form */}
        <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden py-12">
          {/* Background Image Placeholder - Replace with actual image */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100"></div>

          {/* Overlay Content */}
          <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold text-black mb-4">
                Design Your Tour
              </h2>
            </div>

            {/* Main Search Form
           - Centered in Hero */}
            <div className="">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Natural Language Input - PRIMARY INPUT */}
                <div className="text-left">
                  <textarea
                    id="prompt"
                    name="prompt"
                    value={formData.prompt}
                    onChange={handleChange}
                    placeholder="Show me historic landmarks and coffee shops in downtown, family-friendly activities"
                    className="w-full px-4 py-3 bg-whiterounded-lg bg-white focus:border-green-600 focus:outline-none text-black resize-none"
                    rows={3}
                    required
                  />
                </div>

                {/* Grid Layout for Other Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Location */}
                  <div className="text-left">
                    <label
                      htmlFor="startPlace"
                      className="block text-sm font-semibold text-black mb-2"
                    >
                      Starting Location
                    </label>
                    <APIProvider
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    >
                      <PlaceAutocomplete
                        type="text"
                        onPlaceSelect={handleStartSelect}
                        placeholder="Starting point"
                        className="w-full bg-white px-4 py-3  rounded-xl focus:border-green-500 focus:outline-none text-gray-800 placeholder:text-gray-400"
                        required
                      />
                    </APIProvider>
                  </div>

                  {/* Target Location (Optional) */}
                  <div className="text-left">
                    <label
                      htmlFor="destinationCoords"
                      className="block text-sm font-semibold text-black mb-2"
                    >
                      Ending Location{" "}
                      <span className="text-gray-400 font-normal">
                        (Optional)
                      </span>
                    </label>
                    <APIProvider
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    >
                      <PlaceAutocomplete
                        type="text"
                        onPlaceSelect={handleDestinationSelect}
                        placeholder="Round Trip or Destination"
                        className="w-full bg-white px-4 py-3 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 placeholder:text-gray-400"
                      />
                    </APIProvider>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3">
                  {/* Trip Length */}
                  <div className="text-left mr-5">
                    <label
                      htmlFor="searchRadius"
                      className="block text-sm font-semibold text-black  mb-5 tracking-wide"
                    >
                      Search Radius in Miles:{" "}
                      <span className="text-green-600 font-bold">
                        {formData.searchRadius || 5}
                      </span>
                    </label>
                    <input
                      type="range"
                      id="searchRadius"
                      name="searchRadius"
                      value={formData.searchRadius}
                      onChange={handleChange}
                      min="3"
                      max="200"
                      step="1"
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                      required
                    />
                  </div>

                  {/* Tour Type Toggle */}
                  <div className="text-center">
                    <label className="block text-sm font-semibold text-black mb-3 tracking-wide">
                      Tour Type
                    </label>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            transportationMethod: "walking",
                          })
                        }
                        className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${formData.transportationMethod === "walking"
                            ? "bg-green-300 text-black shadow-md"
                            : "bg-transparent text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        🚶 Walking
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            transportationMethod: "driving",
                          })
                        }
                        className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${formData.transportationMethod === "driving"
                            ? "bg-green-300 text-black shadow-md"
                            : "bg-transparent text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        🚗 Driving
                      </button>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="text-left ml-5">
                    <label
                      htmlFor="tourBudget"
                      className="block text-sm font-semibold text-black  mb-5 tracking-wide"
                    >
                      Budget:{" "}
                      <span className="text-green-600 font-bold text-lg">
                        {"$".repeat(formData.tourBudget || 1)}
                      </span>
                    </label>
                    <input
                      type="range"
                      id="tourBudget"
                      name="tourBudget"
                      value={formData.tourBudget}
                      onChange={handleChange}
                      min="0"
                      max="4"
                      step="1"
                      className="w-full h-3 items-end bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
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
}