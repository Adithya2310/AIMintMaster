import React, { useState } from 'react';
import { Tag, Zap } from 'lucide-react';
import { buyNFT } from '@/utils/contractUtils';
import { useWallet } from '@/context/WalletContext';
import { ethers } from 'ethers';

interface NFTCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  aiScore: number;
  seller: string;
}

const NFTCard: React.FC<NFTCardProps> = ({ 
  id, 
  name, 
  description, 
  imageUrl, 
  price, 
  aiScore, 
  seller 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const { account } = useWallet();

  // Calculate percentage for AI score indicator
  const scorePercentage = Math.min(aiScore * 10, 100);
  
  // Determine AI score color based on value
  const getScoreColor = () => {
    if (aiScore >= 8) return 'text-neonBlue';
    if (aiScore >= 5) return 'text-neonPurple';
    return 'text-electricPink';
  };

  const handleBuyNFT = async () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setIsBuying(true);
      const receipt = await buyNFT(Number(id), {
        value: ethers.parseEther(price.toString())
      });
      
      const event = receipt.logs.find(
        (log: any) => log.eventName === 'NFTBought'
      );

      if (event) {
        console.log('NFT Bought Successfully:', {
          tokenId: event.args.tokenId.toString(),
          buyer: event.args.buyer,
          price: event.args.price.toString()
        });
      }
      
      // You might want to trigger a refresh of the NFT list here
      
    } catch (error) {
      console.error('Error buying NFT:', error);
      alert('Failed to buy NFT. Please try again.');
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div 
      className="glass-panel overflow-hidden transition-all duration-500 animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden group">
        {/* Image container */}
        <div className={`relative w-full aspect-square overflow-hidden ${isHovered ? 'scale-105' : 'scale-100'} transition-all duration-500`}>
          <img 
            src={`https://${imageUrl}`} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 ${isHovered ? 'opacity-100' : ''} transition-opacity duration-300`}></div>
        </div>
        
        {/* AI Score indicator */}
        <div className="absolute top-3 right-3 bg-background/70 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5">
          <Zap size={14} className="text-neonBlue" />
          <span className={`text-sm font-orbitron ${getScoreColor()}`}>{aiScore}/10</span>
        </div>
        
        {/* Score progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/50">
          <div 
            className="h-full bg-gradient-to-r from-neonBlue to-neonPurple"
            style={{ width: `${scorePercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-orbitron text-lg text-white truncate">{name}</h3>
          <div className="flex items-center">
            <Tag size={14} className="mr-1 text-neonPurple" />
            <span className="text-sm text-neonPurple font-orbitron">{price} SONIC</span>
          </div>
        </div>
        
        <p className="text-white/70 text-sm line-clamp-2 mb-4">{description}</p>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-white/50 truncate">by {seller.substring(0, 6)}...{seller.substring(seller.length - 4)}</span>
          
          <button 
            onClick={handleBuyNFT}
            disabled={isBuying || seller.toLowerCase() === account?.toLowerCase()}
            className={`px-4 py-1.5 rounded font-orbitron text-sm transition-all duration-300 
              ${isBuying ? 'bg-gray-500 cursor-not-allowed' : 
                isHovered 
                  ? 'bg-neonPurple text-white' 
                  : 'bg-transparent text-neonPurple border border-neonPurple'
              }
              ${seller.toLowerCase() === account?.toLowerCase() ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isBuying ? (
              <div className="flex items-center">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Buying...
              </div>
            ) : seller.toLowerCase() === account?.toLowerCase() ? 
              'Your NFT' : 
              'Buy Now'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
