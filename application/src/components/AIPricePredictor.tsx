
import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowDown, ArrowUp } from 'lucide-react';

interface AIPricePredictorProps {
  description: string;
  onPriceSelect: (price: number) => void;
}

const AIPricePredictor: React.FC<AIPricePredictorProps> = ({ description, onPriceSelect }) => {
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [isActive, setIsActive] = useState(false);
  
  // Mock AI prediction based on description length and content
  useEffect(() => {
    if (isActive && description.length > 3) {
      setLoading(true);
      
      // Simulate AI processing time
      const timer = setTimeout(() => {
        // Generate a price between 0.05 and 3 SONIC based on description 
        // This is just a mock algorithm
        const wordCount = description.split(' ').length;
        const hasKeywords = /rare|unique|special|legendary|ai|generated/i.test(description);
        
        let basePrice = 0.05 + (wordCount * 0.04);
        if (hasKeywords) basePrice *= 1.5;
        
        // Add some randomness
        const finalPrice = Math.min(3.0, basePrice * (0.8 + Math.random() * 0.4));
        const roundedPrice = parseFloat(finalPrice.toFixed(2));
        
        // Set price range for slider (70% to 130% of predicted price)
        const min = Math.max(0.01, parseFloat((roundedPrice * 0.7).toFixed(2)));
        const max = parseFloat((roundedPrice * 1.3).toFixed(2));
        
        setPredictedPrice(roundedPrice);
        setSliderValue(roundedPrice);
        setPriceRange({ min, max });
        onPriceSelect(roundedPrice);
        setLoading(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [description, isActive, onPriceSelect]);
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSliderValue(value);
    onPriceSelect(value);
  };
  
  const handleActivate = () => {
    setIsActive(true);
  };
  
  // Format price with 2 decimal places
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };
  
  return (
    <div className="relative">
      <div className="flex items-center">
        <div className="flex-1 relative">
          <input
            type="number"
            value={sliderValue > 0 ? sliderValue : ""}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                setSliderValue(value);
                onPriceSelect(value);
              }
            }}
            placeholder="Set price in SONIC"
            className="neon-input w-full pr-12"
            step="0.01"
            min="0.01"
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 font-orbitron text-sm">
            SONIC
          </span>
        </div>
        
        <button 
          onClick={handleActivate} 
          className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isActive ? 'bg-neonBlue/20 text-neonBlue' : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
          disabled={loading || isActive}
        >
          <DollarSign size={18} className={isActive ? 'animate-pulse' : ''} />
        </button>
      </div>
      
      {loading && (
        <div className="mt-3 flex items-center justify-center py-2">
          <div className="w-5 h-5 rounded-full border-2 border-neonBlue border-t-transparent animate-spin"></div>
          <span className="ml-2 text-sm text-white/70">Analyzing market conditions...</span>
        </div>
      )}
      
      {predictedPrice !== null && !loading && (
        <div className="mt-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-white/60 mb-1 px-1">
            <div className="flex items-center">
              <ArrowDown size={12} className="mr-1 text-electricPink" />
              <span>{formatPrice(priceRange.min)}</span>
            </div>
            <div className="text-center">
              <span className="text-neonBlue font-orbitron">AI SUGGESTED</span>
            </div>
            <div className="flex items-center">
              <span>{formatPrice(priceRange.max)}</span>
              <ArrowUp size={12} className="ml-1 text-neonBlue" />
            </div>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step="0.01"
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full h-1 appearance-none bg-transparent cursor-pointer focus:outline-none"
              style={{
                background: `linear-gradient(to right, rgba(160, 32, 240, 0.5) 0%, rgba(0, 255, 255, 0.5) 50%, rgba(0, 255, 255, 0.5) 100%)`,
              }}
            />
            
            {/* Custom styled thumb */}
            <style>
              {`
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: white;
                border: 2px solid #00FFFF;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
              }
              
              input[type="range"]::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: white;
                border: 2px solid #00FFFF;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
              }
              `}
            </style>
            
            {/* AI suggested price indicator */}
            <div 
              className="absolute w-0.5 h-3 bg-neonBlue top-1/2 transform -translate-y-1/2"
              style={{
                left: `${((predictedPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                boxShadow: '0 0 5px rgba(0, 255, 255, 0.8)'
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPricePredictor;
