
import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon, X, Check, Loader } from 'lucide-react';

interface AIImageGeneratorProps {
  description: string;
  onImageSelect: (imageUrl: string) => void;
}

const AIImageGenerator: React.FC<AIImageGeneratorProps> = ({ description, onImageSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sample images array
  const sampleImages = [
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500&h=500&auto=format",
    "https://images.unsplash.com/photo-1612487528505-d2338264c821?q=80&w=500&h=500&auto=format",
    "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=500&h=500&auto=format",
    "https://images.unsplash.com/photo-1621075160523-b936ad96132a?q=80&w=500&h=500&auto=format",
    "https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=500&h=500&auto=format",
    "https://images.unsplash.com/photo-1634926878768-2a5b3c42f139?q=80&w=500&h=500&auto=format",
  ];

  // Mock image generation based on description
  useEffect(() => {
    if (isOpen && description.length > 3 && generatedImages.length === 0) {
      setIsGenerating(true);
      
      // Simulate AI image generation delay
      const timer = setTimeout(() => {
        // Use sample images for demo
        setGeneratedImages(sampleImages);
        setIsGenerating(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, description, generatedImages.length, sampleImages]);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const openModal = () => {
    setIsOpen(true);
    setSelectedImageIndex(null);
    setGeneratedImages([]);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const confirmSelection = () => {
    if (selectedImageIndex !== null) {
      onImageSelect(generatedImages[selectedImageIndex]);
      closeModal();
    }
  };

  return (
    <>
      <button 
        onClick={openModal} 
        className="ml-2 w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-white/70 hover:bg-white/10 transition-all duration-300"
        title="Generate AI images"
      >
        <ImageIcon size={18} />
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="glass-panel w-full max-w-2xl animate-scale-in overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="font-orbitron text-lg text-neonBlue">AI Image Generator</h3>
              <button 
                onClick={closeModal}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/70 transition-all duration-200"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6">
              {isGenerating ? (
                <div className="py-12 flex flex-col items-center">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-2 border-neonBlue border-opacity-20"></div>
                    <div className="absolute inset-0 rounded-full border-t-2 border-neonBlue animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader size={24} className="text-neonBlue animate-pulse" />
                    </div>
                  </div>
                  <p className="mt-4 text-white/70">Generating images from your description...</p>
                  <p className="mt-2 text-neonPurple font-orbitron text-sm animate-pulse">
                    "{description.slice(0, 50)}{description.length > 50 ? '...' : ''}"
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-2">Select an image for your NFT:</h4>
                    <p className="text-white/60 text-sm mb-4">Click an image to select it.</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {(generatedImages.length > 0 ? generatedImages : sampleImages).map((image, index) => (
                        <div 
                          key={index} 
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                            selectedImageIndex === index 
                              ? 'border-neonBlue scale-[0.98] shadow-[0_0_15px_rgba(0,150,255,0.5)]' 
                              : 'border-transparent hover:border-white/30'
                          }`}
                          onClick={() => handleImageSelect(index)}
                        >
                          <img 
                            src={image} 
                            alt={`Image option ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                          
                          {selectedImageIndex === index && (
                            <div className="absolute top-2 right-2 bg-neonBlue rounded-full p-1">
                              <Check size={14} className="text-black" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-white/10">
                    <button 
                      onClick={closeModal}
                      className="px-4 py-2 rounded font-medium text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    
                    <button 
                      onClick={confirmSelection}
                      className={`neon-button ${
                        selectedImageIndex !== null ? '' : 'opacity-50 cursor-not-allowed'
                      }`}
                      disabled={selectedImageIndex === null}
                    >
                      Select Image
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIImageGenerator;
