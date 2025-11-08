import React from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

const ProgressSection = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Processing your request", icon: "📝" },
    { id: 2, label: "Converting to searchable interests", icon: "🔍" },
    { id: 3, label: "Finding nearby places", icon: "📍" },
    { id: 4, label: "Filtering candidates", icon: "⭐" },
    { id: 5, label: "Planning optimal routes", icon: "🗺️" },
    { id: 6, label: "Enriching with details", icon: "✨" },
    { id: 7, label: "Finalizing your tour", icon: "🎯" },
    //{id: 8, label: 'finished', icon: 'greencheck'}
  ];

  return (
    <div>
      <div className="p-6 border-b border-gray-100">
        {/* Steps Progress */}
        <div className="mt-4 space-y-2 w-full">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                    ? "bg-green-500 text-white animate-pulse"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <span
                className={`text-xs transition-all duration-300 ${
                  index <= currentStep
                    ? "text-gray-700 font-medium"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/*current Step*/}
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Current Step</p>
              <p className="text-sm font-semibold text-gray-800">
                {steps[currentStep]?.icon} {steps[currentStep]?.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;
