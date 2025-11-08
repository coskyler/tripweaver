"use client"

import Header from "../../components/sections/header"
import GoogleLoginButton from "../../components/home/GoogleLoginButton"
import FeatureList from "../../components/sections/featurelist"
import Footer from "../../components/sections/footer"

export default function Home() {
  return (
    <div>
      <Header/>
    <div className="flex flex-col items-center justify-center pt-40 h-[75%] text-center bg-gradient-to-b from-cream-50 to-white text-gray-800">
      <h1 className="text-5xl font-semibold mb-4">Tripweaver</h1>
      <p className="text-lg text-gray-600 max-w-md">
        Plan, personalize, and explore your journeys effortlessly — powered by AI.
      </p>
      <GoogleLoginButton />
    </div>

    <div className="pt-40 pb-40">
      <FeatureList/>
    </div>

    <Footer/>
    </div>
  )
}
