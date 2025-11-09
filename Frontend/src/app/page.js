"use client";

import Image from "next/image";
import Header from "../components/sections/header";
import GoogleLoginButton from "../components/home/GoogleLoginButton";
import FeatureList from "../components/sections/featurelist";
import Footer from "../components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-green-100 via-green-200 to-green-300">
      <Header />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center text-white px-6">
        <div className="relative -translate-y-12">
          <h1 className="text-black text-5xl md:text-6xl font-semibold mb-4 drop-shadow-lg">
            Tourweaver
          </h1>
          <p className="text-black text-lg md:text-xl max-w-xl pb-6">
            Every stop, perfectly planned<br />from hidden gems to must-see sights.
          </p>
          <GoogleLoginButton />
        </div>
      </section>

      {/* FEATURES */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-6xl">
          <FeatureList />
        </div>
      </section>

      {/* CTA */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 text-white">
        <h2 className="text-black text-4xl font-semibold mb-4">Ready to explore?</h2>
        <p className="text-black mb-8 max-w-md">
          Sign in to generate a personalized tour in seconds.
        </p>
        <GoogleLoginButton />
      </section>

      <Footer />
    </div>
  );
}
