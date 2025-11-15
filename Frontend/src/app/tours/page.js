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
import Image from "next/image";

export default function Home() {
  const [formData, setFormData] = useState({
    prompt: "",
    startingCoords: { lat: 0, lng: 0 },
    targetCoords: { lat: 0, lng: 0 },
    transportationMethod: "walking", // "Walking" | "Driving"
    searchRadius: 5,                 // miles (UI)
    tourBudget: 2,                   // 0..4
    city: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // prevent double submit
    setSubmitting(true);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error("Not signed in");

      const miles = Number(formData.searchRadius || 5);
      const searchRadiusMeters = Math.max(1, Math.round(miles * 1609.34));

      const startingCoords = {
        lat: Number(formData.startingCoords.lat),
        lng: Number(formData.startingCoords.lng),
      };

      const payload = {
        userPrompt: formData.prompt,
        startingCoords,
        // send same location for starting and ending so API continues to work
        targetCoords: startingCoords,
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
      // keep targetCoords in sync so backend gets same start/end
      targetCoords: { lat: place.lat, lng: place.lng },
      city: place.city || p.city,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numeric = name === "searchRadius" || name === "tourBudget";
    setFormData((p) => ({ ...p, [name]: numeric ? Number(value) : value }));
  };

  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />
      <section className="relative flex items-center justify-center overflow-hidden py-12 min-h-[90vh]">
        <div className="absolute inset-0">
          <Image
            src="/venice.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold text-white/90 mb-12">Design Your Tour</h2>
          </div>
          <form
            id="tourForm"
            onSubmit={handleSubmit}
            className="backdrop-blur-lg rounded-xl border-white/20 border overflow-hidden py-1"
          >
            {/* 1. Location (starting only) */}
            <div className="text-left border-b border-white/20 py-2">
              <label className="block text-sm font-semibold text-white px-4">
                Location
              </label>
              <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                <PlaceAutocomplete
                  type="text"
                  onPlaceSelect={handleStartSelect}
                  placeholder="Where are you starting from?"
                  className="w-full px-4 py-1 focus:outline-none text-white placeholder:text-neutral-200"
                  required
                />
              </APIProvider>
            </div>

            {/* 2. Describe your tour */}
            <div className="text-left border-b border-white/20 py-2">
              <label
                htmlFor="prompt"
                className="block text-sm font-semibold text-white px-4"
              >
                Describe your tour
              </label>
              <textarea
                id="prompt"
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                placeholder="I want a 5-stop tour that starts at a coffee shop, then includes a historic landmark, a museum, a local shop, and a scenic viewpoint."
                className="w-full px-4 py-1 focus:outline-none text-white placeholder:text-neutral-200"
                rows={3}
                required
              />
            </div>

            {/* 3. Walking or driving */}
            <div className="text-left border-b border-white/20 py-2">
              <label className="block text-sm font-semibold text-white px-4 mb-1">
                Tour Type
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, transportationMethod: "walking" }))
                  }
                  className={`cursor-pointer flex-1 px-4 py-2 font-medium transition-all ${formData.transportationMethod === "walking"
                      ? "bg-white/70 text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                  Walking
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, transportationMethod: "driving" }))
                  }
                  className={`cursor-pointer flex-1 px-4 py-2 font-medium transition-all ${formData.transportationMethod === "driving"
                      ? "bg-white/70 text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                  Driving
                </button>
              </div>
            </div>

            {/* 4. Desired distance (0–30 miles) */}
            <div className="text-left border-b border-white/20 py-2">
              <label className="block text-sm font-semibold text-white px-4 mb-1">
                Desired distance: <span>{formData.searchRadius}</span>
                {formData.searchRadius == 1 ? " mile" : " miles"}
              </label>
              <div className="relative w-full h-6">
                {/* Invisible functional range input */}
                <input
                  type="range"
                  id="searchRadius"
                  name="searchRadius"
                  value={formData.searchRadius}
                  onChange={handleChange}
                  min={1}
                  max={30}
                  step={1}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  required
                />

                {/* Background */}
                <div className="absolute inset-0 bg-white/10"></div>

                {/* Filled */}
                <div
                  className="absolute inset-y-0 left-0 bg-white/70"
                  style={{
                    width: `${(Number(formData.searchRadius) / 30) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* 5. Budget */}
            <div className="text-left py-2">
              <label className="block text-sm font-semibold text-white px-4 mb-1">
                Budget:{" "}
                <span className="text-yellow-200">
                  {Number(formData.tourBudget)
                    ? "$".repeat(Number(formData.tourBudget))
                    : "Free"}
                </span>
              </label>
              <div className="relative w-full h-6">
                {/* Invisible functional range input */}
                <input
                  type="range"
                  id="tourBudget"
                  name="tourBudget"
                  value={formData.tourBudget}
                  onChange={handleChange}
                  min={0}
                  max={4}
                  step={1}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  required
                />

                {/* Background */}
                <div className="absolute inset-0 bg-white/10"></div>

                {/* Filled */}
                <div
                  className="absolute inset-y-0 left-0 bg-white/70"
                  style={{
                    width: `${(Number(formData.tourBudget) / 4) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </form>

          <button
            type="submit"
            form="tourForm"
            disabled={submitting}
            className="cursor-pointer backdrop-blur-lg border border-white/50 mx-auto mt-8 w-56 hover:bg-white/10 disabled:hover:bg-white/0 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors duration-200 text-lg block"
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

        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 my-12">
        <ToursSection />
      </section>
      <Footer />
    </div>
  );
}
