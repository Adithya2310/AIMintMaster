import React, { useState, useEffect } from 'react';
import NFTCard from '../components/NFTCard';
import MintModal from '../components/MintModal';
import AIChat from '../components/AIChat';
import { Filter, Search, Plus, MessageSquare, SlidersHorizontal } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { getAllListedNFTs } from '@/utils/contractUtils';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5]);
  const [minScore, setMinScore] = useState(0);
  const [nfts, setNfts] = useState<any[]>([]);
  const [filteredNFTs, setFilteredNFTs] = useState<any[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'score'>('recent');
  const [isLoading, setIsLoading] = useState(true);
  const { account, connectWallet, isConnecting } = useWallet();

  // Fetch NFTs from contract
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const listedNFTs = await getAllListedNFTs();
        const nftsWithScore = listedNFTs.map(nft => ({
          ...nft,
          aiScore: 0.0 // Default AI score
        }));
        setNfts(nftsWithScore);
        setFilteredNFTs(nftsWithScore);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  // Update filtered NFTs when filters change
  useEffect(() => {
    let filtered = nfts.filter(nft => {
      const matchesSearch = searchTerm === '' ||
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchTerm.toLowerCase());

      const nftPrice = parseFloat(nft.price);
      const matchesPrice = nftPrice >= priceRange[0] && nftPrice <= priceRange[1];
      const matchesScore = nft.aiScore >= minScore;

      return matchesSearch && matchesPrice && matchesScore;
    });

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price_desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'score':
          return b.aiScore - a.aiScore;
        case 'recent':
        default:
          return parseInt(b.id) - parseInt(a.id);
      }
    });

    setFilteredNFTs(filtered);
  }, [searchTerm, priceRange, minScore, sortBy, nfts]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openChat = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header spacing */}
      <div className="h-24"></div>

      {/* Hero section */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 mb-16">
        <div className="text-center">
          <h1 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            <span className="bg-gradient-to-r from-neonBlue via-neonPurple to-electricPink inline-block text-transparent bg-clip-text">
              AI-Powered NFT Marketplace
            </span>
          </h1>
          <p className="text-white/70 max-w-3xl mx-auto mb-8 text-lg animate-fade-in-slow">
            Mint, buy, and sell NFTs with AI-enhanced pricing and discovery on the Sonic blockchain
          </p>
          
          {!account ? (
            <button 
              onClick={connectWallet} 
              className="neon-button"
              disabled={isConnecting}
            >
              <div className="flex items-center justify-center">
                {isConnecting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Connect Wallet
                  </>
                )}
              </div>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <button onClick={openModal} className="neon-button">
                <div className="flex items-center justify-center">
                  <Plus size={18} className="mr-2" />
                  Mint New NFT
                </div>
              </button>
              <button onClick={openChat} className="neon-button purple-button">
                <div className="flex items-center justify-center">
                  <MessageSquare size={18} className="mr-2" />
                  Smart Buyer Chat
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Marketplace section */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="font-orbitron text-2xl font-bold text-white">
            <span className="mr-2">🔥</span>
            <span className="bg-gradient-to-r from-neonBlue to-neonPurple inline-block text-transparent bg-clip-text">
              Trending NFTs
            </span>
          </h2>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search NFTs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="neon-input w-full pl-10"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            </div>

            <button
              onClick={toggleFilters}
              className={`p-2.5 rounded-md transition-all duration-300 ${isFiltersOpen || filteredNFTs.length !== nfts.length
                ? 'bg-neonPurple/20 text-neonPurple'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Filters */}
        {isFiltersOpen && (
          <div className="glass-panel p-4 mb-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Price Range (SONIC)
                </label>
                <div className="px-2">
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>{priceRange[0].toFixed(1)}</span>
                    <span>{priceRange[1].toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.1}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseFloat(e.target.value), priceRange[1]])}
                    className="w-full slider-track appearance-none h-1 rounded-full"
                  />
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.1}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
                    className="w-full slider-track appearance-none h-1 rounded-full mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Minimum AI Score
                </label>
                <div className="px-2">
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>0</span>
                    <span>10</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={minScore}
                    onChange={(e) => setMinScore(parseFloat(e.target.value))}
                    className="w-full slider-track appearance-none h-1 rounded-full"
                  />
                  <div className="text-center mt-2 text-sm text-neonBlue font-orbitron">
                    {minScore.toFixed(1)}+
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Sort By
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`px-3 py-2 text-sm rounded-md transition-all ${sortBy === 'recent'
                      ? 'bg-neonPurple/30 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    onClick={() => setSortBy('recent')}
                  >
                    Newest First
                  </button>
                  <button
                    className={`px-3 py-2 text-sm rounded-md transition-all ${sortBy === 'price_asc'
                      ? 'bg-neonPurple/30 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    onClick={() => setSortBy('price_asc')}
                  >
                    Price: Low to High
                  </button>
                  <button
                    className={`px-3 py-2 text-sm rounded-md transition-all ${sortBy === 'price_desc'
                      ? 'bg-neonPurple/30 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    onClick={() => setSortBy('price_desc')}
                  >
                    Price: High to Low
                  </button>
                  <button
                    className={`px-3 py-2 text-sm rounded-md transition-all ${sortBy === 'score'
                      ? 'bg-neonPurple/30 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    onClick={() => setSortBy('score')}
                  >
                    Highest AI Score
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NFT Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-neonBlue border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-white/50">Loading NFTs...</div>
          </div>
        ) : filteredNFTs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                id={nft.id}
                name={nft.name}
                description={nft.description}
                imageUrl={nft.imageUrl}
                price={nft.price}
                aiScore={0.0} // Default AI score
                seller={nft.seller}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-white/30 text-lg mb-2">No NFTs found matching your filters</div>
            <button
              onClick={() => {
                setSearchTerm('');
                setPriceRange([0, 5]);
                setMinScore(0);
                setSortBy('recent');
              }}
              className="text-neonBlue hover:text-neonBlue-hover underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Floating action button for mobile */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 md:hidden">
        <button
          onClick={openChat}
          className="w-14 h-14 rounded-full bg-neonPurple flex items-center justify-center text-white shadow-lg animate-pulse"
        >
          <MessageSquare size={24} />
        </button>
        <button
          onClick={openModal}
          className="w-14 h-14 rounded-full bg-neonBlue flex items-center justify-center text-white shadow-lg"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Modals */}
      <MintModal isOpen={isModalOpen} onClose={closeModal} />
      <AIChat isOpen={isChatOpen} onClose={closeChat} />
    </div>
  );
};

export default Index;
