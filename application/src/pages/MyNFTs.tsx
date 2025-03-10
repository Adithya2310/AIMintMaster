import React, { useState, useEffect } from 'react';
import { Calendar, Zap, ImageIcon, Plus, X } from 'lucide-react';
import MintModal from '../components/MintModal';
import { getAllNFTs } from '@/utils/contractUtils';
import { useWallet } from '@/context/WalletContext';

interface MyNFTsProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface NFT {
  tokenId: string;
  creator: string;
  owner: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  listed: boolean;
}

const MyNFTs: React.FC<MyNFTsProps> = ({ isOpen, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [myNFTs, setMyNFTs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { account } = useWallet();
  
  useEffect(() => {
    const fetchMyNFTs = async () => {
      try {
        setIsLoading(true);
        const nfts = await getAllNFTs();
        console.log("account", account)
        console.log("the nfts are as follows", nfts.filter((nft: NFT) => nft.owner.toLowerCase() === account.toLowerCase()));
        setMyNFTs(nfts.filter((nft: NFT) => nft.owner.toLowerCase() === account.toLowerCase()));
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchMyNFTs();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen pb-20">
        {/* Close button */}
        <div className="fixed top-6 right-6">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Header spacing */}
        <div className="h-24"></div>
        
        {/* My NFTs header */}
        <div className="container mx-auto px-4 sm:px-6 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-neonBlue to-neonPurple inline-block text-transparent bg-clip-text">
                  My NFT Collection
                </span>
              </h1>
              <p className="text-white/70">Your digital assets secured on the Sonic blockchain</p>
            </div>
            
            <button onClick={openModal} className="neon-button">
              <div className="flex items-center">
                <Plus size={18} className="mr-2" />
                Mint New NFT
              </div>
            </button>
          </div>
        </div>
        
        {/* Collection stats */}
        <div className="container mx-auto px-4 sm:px-6 mb-10">
          <div className="glass-panel p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-neonBlue/20 flex items-center justify-center mr-4">
                  <ImageIcon size={24} className="text-neonBlue" />
                </div>
                <div>
                  <div className="text-white/70 text-sm">Total NFTs</div>
                  <div className="font-orbitron text-2xl text-white">{myNFTs.length}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-neonPurple/20 flex items-center justify-center mr-4">
                  <Calendar size={24} className="text-neonPurple" />
                </div>
                <div>
                  <div className="text-white/70 text-sm">Last Purchased</div>
                  <div className="font-orbitron text-xl text-white">
                    {formatDate(myNFTs[0]?.purchaseDate)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-electricPink/20 flex items-center justify-center mr-4">
                  <Zap size={24} className="text-electricPink" />
                </div>
                <div>
                  <div className="text-white/70 text-sm">Average AI Score</div>
                  <div className="font-orbitron text-2xl text-white">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-neonBlue border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-white/50">Loading your NFTs...</div>
          </div>
        ) : (
          <div className="container mx-auto px-4 sm:px-6">
            <div className="space-y-6">
              {myNFTs.map((nft) => (
                <div key={nft.id} className="glass-panel overflow-hidden animate-fade-in">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 lg:w-1/4">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={`https://${nft.imageUrl}`} 
                          alt={nft.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                        <h3 className="font-orbitron text-xl text-white mb-2 md:mb-0">{nft.name}</h3>
                        
                        <div className="flex items-center space-x-4">
                          <div className="bg-neonBlue/10 rounded-full px-3 py-1 flex items-center">
                            <Zap size={14} className="text-neonBlue mr-1" />
                            <span className="text-neonBlue font-orbitron text-sm">{nft.aiScore}/10</span>
                          </div>
                          
                          <div className="bg-white/5 rounded-full px-3 py-1">
                            <span className="text-neonPurple font-orbitron text-sm">{nft.price} SONIC</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-white/70 mb-6">{nft.description}</p>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="flex items-center mb-3 sm:mb-0">
                          <Calendar size={16} className="text-white/50 mr-2" />
                          <span className="text-white/50 text-sm">Purchased on {formatDate(nft.purchaseDate)}</span>
                        </div>
                        
                        <div className="flex space-x-3">
                          <button className="px-4 py-2 rounded bg-white/5 text-white/70 cursor-not-allowed transition-colors text-sm">
                            Transfer(Soon)
                          </button>
                          <button className="px-4 py-2 rounded bg-neonPurple/20 text-neonPurple cursor-not-allowed transition-colors text-sm font-medium">
                            List for Sale(Soon)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {myNFTs.length === 0 && (
              <div className="text-center py-20">
                <div className="text-white/30 text-lg mb-4">You don't own any NFTs yet</div>
                <button onClick={openModal} className="neon-button">
                  <div className="flex items-center">
                    <Plus size={18} className="mr-2" />
                    Mint Your First NFT
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Modal */}
        <MintModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </div>
  );
};

export default MyNFTs;
