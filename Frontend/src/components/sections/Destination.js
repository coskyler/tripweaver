// components/sections/Destination.js

export default function DestinationCard({
  number = "1",
  tag = "Attraction",
  imageUrl = "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
  title = "The Wharf Marina",
  address = "401 Biscayne Blvd, Miami, FL 33132",
  description = "Scenic waterfront destination perfect for evening strolls and sunset views. Features multiple dining options and boat tours.",
  rating = 4.7,
  reviewCount = 342,
  priceLevel = 2,
  distance = 0.3,
  duration = 30,
  isSelected = true
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
    <div className={`rounded-xl overflow-hidden bg-white shadow-lg max-w-2xl`}> 
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-40 object-cover" 
        />
        <div className="absolute top-3 left-3 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm"> 
          {number}
        </div>
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full font-medium text-gray-800 text-sm"> 
          {tag}
        </div>
      </div>
      
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2"> {/* Reduced font size text-3xl -> text-xl, margin mb-3 -> mb-2 */}
          {title}
        </h2>
        
        <div className="flex items-start gap-2 mb-3 text-gray-600 text-sm"> 
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{address}</span>
        </div>
        
        <p className="text-gray-700 mb-4 leading-relaxed text-sm"> 
        </p>
        
        <div className="flex items-center gap-4 mb-3 flex-wrap text-sm">
          <div className="flex items-center gap-1"> 
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"> 
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-bold text-gray-900 text-base">{rating}</span> 
            <span className="text-gray-600">({reviewCount})</span>
          </div>
          
          <div className="flex items-center gap-1 text-base"> 
            {renderPriceSymbols()}
          </div>
          
          <div className="flex items-center gap-1 text-gray-600"> 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> 
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{distance} mi</span>
          </div>
          
          <div className="flex items-center gap-1 text-gray-600"> 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> 
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{duration} min</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200"> 
          <span className="text-gray-500 text-sm">Tap for details</span> 
        </div>
      </div>
    </div>
  );
}