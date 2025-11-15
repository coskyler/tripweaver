// components/sections/Destination.js

export default function DestinationCard({
  number = "0",
  imageUrl = "",
  name = "Default String",
  address = "Default String",
  description = "Default String",
  rating = 0,
  priceLevel = 0,
  distance = Math.floor(Math.random() * 12) + 1,
  duration = (Math.floor(Math.random() * 3) + 2) * 4,
}) {
  const renderPriceSymbols = () => {
    const symbols = [];
    for (let i = 0; i < 4; i++) {
      symbols.push(
        <span key={i} className={i < priceLevel ? "text-green-600" : "text-gray-300"}>
          $
        </span>
      );
    }
    return symbols;
  };

  return (
    <div className="flex w-full">
      {/* Left column: number + line */}
      <div className="flex flex-col items-center mr-7 shrink-0">
        <h2 className="text-green-900 font-semibold text-lg mb-2">{number}</h2>
        <div className="bg-green-700 w-[2px] h-full" />
      </div>

      {/* Main content: stretches to the right */}
      <div className="flex-1 min-w-0 my-8 gap-6 mr-1">
        {/* Title */}
        <h2 className="text-xl font-bold text-green-900 mb-2 truncate">{name}</h2>

        {/* Image */}
        <img
          src={imageUrl}
          alt={name}
          className="rounded-lg object-cover w-full h-50 mb-3"
        />

        {/* Address */}
        <div className="flex items-start gap-2 mb-3 text-black text-sm">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="min-w-0 break-words">{address}</span>
        </div>

        {/* Info row */}
        <div className="flex items-center gap-4 mb-3 flex-wrap text-sm">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-bold text-gray-900 text-base">{rating}</span>
          </div>

          {/* Price */}
          <div
            className={`flex items-center gap-1 text-base ${priceLevel === 0 ? "hidden" : ""
              }`}
          >
            {renderPriceSymbols()}
          </div>

          {/* Distance */}
          <div className="flex items-center gap-1 text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{distance} mi</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1 text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{duration} min</span>
          </div>
        </div>

        {/* Footer / Description */}
        <div className="pt-3 border-t border-black/20">
          <span className="text-black text-sm break-words">{description}</span>
        </div>
      </div>
    </div>
  );
}
