"use client";

import Image from "next/image";
import Header from "../components/sections/header";
import GoogleLoginButton from "../components/home/GoogleLoginButton";
import FeatureList from "../components/sections/featurelist";
import Footer from "../components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-[#FFF7E6] via-[#FFF7E6] to-[#FFF7E6]">
      <Header />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center text-white px-6">
        <Image
          src="/fuji.jpg"
          alt=""
          fill
          className="object-cover opacity-80"
          priority
        />

        <div className="absolute inset-0 bg-black/30" />
        <div className="relative -translate-y-6">
          <h1 className="text-white/90 text-5xl md:text-[5rem] font-semibold mb-6">
            Tourweaver
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-xl mb-12">
            Every stop, perfectly planned<br />from hidden gems to must-see sights.
          </p>
          <GoogleLoginButton />
        </div>
      </section>

      {/* FEATURES */}
      <section className="min-h-[90vh] flex items-center justify-center px-6">
        <div className="w-full max-w-6xl">
          <FeatureList />
        </div>
      </section>

      {/* CTA */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 text-white">
        <h2 className="text-green-900 text-4xl font-semibold mb-4">Ready to explore?</h2>
        <p className="text-black mb-8 max-w-md">
          Sign in to generate a personalized tour in seconds.
        </p>
        <div className="bg-green-900 rounded-lg">
          <GoogleLoginButton />
        </div>
      </section>

      <Footer />
    </div>
  );
}
