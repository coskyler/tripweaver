"use client";

import { useState } from "react";
import Header from "../../components/sections/header";
import Footer from "../../components/sections/footer";
import PlaceAutocomplete from "../../components/map-related/PlaceAutocomplete";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useRouter } from "next/navigation";
import axios from "axios";
import { auth } from "../../lib/firebase";
import ToursSection from "../../components/sections/ToursSection";

export default function Home() {
  const [formData, setFormData] = useState({
    prompt: "",
    startingCoords: { lat: 0, lng: 0 },
    targetCoords: { lat: 0, lng: 0 },
    transportationMethod: "walking", // "Walking" | "Driving"
    searchRadius: 5,                 // miles (UI)
    tourBudget: 1,                   // 0..4
    city: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;            // prevent double submit
    setSubmitting(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error("Not signed in");

      const miles = Number(formData.searchRadius || 5);
      const searchRadiusMeters = Math.max(1, Math.round(miles * 1609.34));

      const payload = {
        userPrompt: formData.prompt,
        startingCoords: {
          lat: Number(formData.startingCoords.lat),
          lng: Number(formData.startingCoords.lng),
        },
        targetCoords: {
          lat: Number(formData.targetCoords.lat),
          lng: Number(formData.targetCoords.lng),
        },
        budget: Number(formData.tourBudget),
        transportationMethod: formData.transportationMethod, // exact casing
        searchRadius: searchRadiusMeters, // meters int
        city: formData.city,
      };

      const url = `${process.env.NEXT_PUBLIC_API_DOMAIN}/tours`;

      const { data } = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      router.push(`/tours/${data.id}`);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || err.message || "Failed to create tour");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartSelect = (place) => {
    setFormData((p) => ({
      ...p,
      startingCoords: { lat: place.lat, lng: place.lng },
      city: place.city || p.city,
    }));
  };

  const handleDestinationSelect = (place) => {
    setFormData((p) => ({
      ...p,
      targetCoords: { lat: place.lat, lng: place.lng },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numeric = name === "searchRadius" || name === "tourBudget";
    setFormData((p) => ({ ...p, [name]: numeric ? Number(value) : value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="relative flex items-center justify-center overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100" />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold text-black mb-4">Design Your Tour</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left">
              <textarea
                id="prompt"
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                placeholder="Show me historic landmarks and coffee shops in downtown, family-friendly activities"
                className="w-full px-4 py-3 bg-white rounded-lg focus:border-green-600 focus:outline-none text-black resize-none"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-left">
                <label className="block text-sm font-semibold text-black mb-2">Starting Location</label>
                <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                  <PlaceAutocomplete
                    type="text"
                    onPlaceSelect={handleStartSelect}
                    placeholder="Starting point"
                    className="w-full bg-white px-4 py-3 rounded-xl focus:border-green-500 focus:outline-none text-gray-800 placeholder:text-gray-400"
                    required
                  />
                </APIProvider>
              </div>

              <div className="text-left">
                <label className="block text-sm font-semibold text-black mb-2">
                  Ending Location <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
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
              <div className="text-left mr-5">
                <label className="block text-sm font-semibold text-black mb-5 tracking-wide">
                  Search Radius in Miles: <span className="text-green-600 font-bold">{formData.searchRadius}</span>
                </label>
                <input
                  type="range"
                  id="searchRadius"
                  name="searchRadius"
                  value={formData.searchRadius}
                  onChange={handleChange}
                  min={3}
                  max={200}
                  step={1}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  required
                />
              </div>

              <div className="text-center">
                <label className="block text-sm font-semibold text-black mb-3 tracking-wide">Tour Type</label>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, transportationMethod: "walking" }))}
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                      formData.transportationMethod === "walking"
                        ? "bg-green-300 text-black shadow-md"
                        : "bg-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    🚶 Walking
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, transportationMethod: "driving" }))}
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                      formData.transportationMethod === "driving"
                        ? "bg-green-300 text-black shadow-md"
                        : "bg-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    🚗 Driving
                  </button>
                </div>
              </div>

              <div className="text-left ml-5">
                <label className="block text-sm font-semibold text-black mb-5 tracking-wide">
                  Budget:{" "}
                  <span className="text-green-600 font-bold text-lg">
                    {"$".repeat(Number(formData.tourBudget) || 1)}
                  </span>
                </label>
                <input
                  type="range"
                  id="tourBudget"
                  name="tourBudget"
                  value={formData.tourBudget}
                  onChange={handleChange}
                  min={0}
                  max={4}
                  step={1}
                  className="w-full h-3 items-end bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mx-auto w-56 bg-green-600 hover:bg-green-700 disabled:hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors duration-200 text-lg block"
            >
              {submitting ? (
                <span className="inline-flex items-center">
                  Preparing
                  <span className="ml-1 inline-block animate-pulse">...</span>
                </span>
              ) : (
                "Generate My Tour"
              )}
            </button>
          </form>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 my-12">
        <ToursSection/>
      </section>
      <Footer />
    </div>
  );
}
