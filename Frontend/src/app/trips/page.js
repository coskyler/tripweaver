"use client"
import React, {useState, useEffect} from 'react';
import Header from '../../components/sections/header';
import ProgressSection from '../../components/sections/progressSection'
import Map from '../../components/map-related/map'


function page() {
  const [currentStep, setCurrentStep] = useState(0);

  // Simulate progress
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 6) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    return () => {
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <>
    <div className="flex">
        <div className="w-1/3">
            <ProgressSection 
            currentStep={currentStep} 
            /
            >
        </div>
        <div className="w-2/3">
            <Map>

            </Map>
        </div>
    </div>
    </>
  )
}

export default page