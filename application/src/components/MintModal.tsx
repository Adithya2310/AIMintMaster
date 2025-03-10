import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import AIPricePredictor from './AIPricePredictor';
import AIImageGenerator from './AIImageGenerator';

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MintModal: React.FC<MintModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [mintingStep, setMintingStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setImageUrl('');
      setPrice(0);
      setMintingStep(1);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);

      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setImageUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleAIImageSelect = (url: string) => {
    setImageUrl(url);
  };

  const handlePriceSelect = (selectedPrice: number) => {
    setPrice(selectedPrice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !imageUrl || price <= 0) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      console.log('NFT Minted:', { name, description, imageUrl, price });
    }, 2000);
  };

  const goToNextStep = () => {
    if (mintingStep === 1 && name && description && imageUrl) {
      setMintingStep(2);
    }
  };

  const goToPreviousStep = () => {
    if (mintingStep === 2) {
      setMintingStep(1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="glass-panel w-full max-w-md animate-scale-in"
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h3 className="font-orbitron text-lg text-white">
            {mintingStep === 1 ? 'Create New NFT' : 'Set NFT Price'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/70 transition-all duration-200"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {mintingStep === 1 ? (
            <>
              <div className="mb-5">
                <label className="block text-sm text-white/70 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cosmic Dreamscape #1"
                  className="neon-input w-full"
                  required
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm text-white/70 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your NFT in detail..."
                  className="neon-input w-full min-h-[100px] resize-none"
                  required
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm text-white/70 mb-2">
                  Image(base64)
                </label>
                <div className="relative  flex justify-between">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL here"
                    className="neon-input w-full pr-12"
                  />
                  <AIImageGenerator
                    name={name}
                    description={description}
                    onImageSelect={handleAIImageSelect}
                  />
                </div>

                {imageUrl && (
                  <div className="mt-3 relative rounded-lg overflow-hidden aspect-square">
                    <img
                      src={`data:image/png;base64,${imageUrl}`}
                      alt="NFT Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!name || !description || !imageUrl}
                  className={`neon-button purple-button ${(!name || !description || !imageUrl) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="relative mb-5">
                <div className="rounded-lg overflow-hidden aspect-square w-40 mx-auto mb-5">
                  <img
                    src={`data:image/png;base64,${imageUrl}`}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h4 className="text-center font-orbitron text-white mb-1">{name}</h4>
                <p className="text-center text-white/50 text-sm mb-6 px-6">{description}</p>

                <div className="mb-8">
                  <label className="block text-sm text-white/70 mb-2">
                    Set Price
                  </label>
                  <AIPricePredictor
                    description={description}
                    onPriceSelect={handlePriceSelect}
                  />
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-4 py-2 text-white/70 hover:text-white font-orbitron text-sm"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || price <= 0}
                    className={`neon-button pink-button ${isSubmitting || price <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Minting...</span>
                      </div>
                    ) : (
                      <span>Mint NFT</span>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default MintModal;
