export default function LoadingTour() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Spinner */}
      <div className="h-10 w-10 border-4 border-green-900 border-t-transparent rounded-full animate-spin mb-6"></div>

      {/* Message */}
      <h2 className="text-xl font-semibold text-green-900">
        We&#39;re crafting your route.
      </h2>

      {/* Wait hint */}
      <p className="text-sm text-gray-600 mt-2">
        This can take a few minutes.
      </p>
    </div>
  );
}