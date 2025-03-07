
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, User, LayoutGrid } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 bg-background/90 backdrop-blur-lg' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-neon-gradient flex items-center justify-center animate-rotate-glow">
            <Rocket size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-orbitron font-bold bg-gradient-to-r from-neonBlue via-neonPurple to-electricPink inline-block text-transparent bg-clip-text">
            AI Mint Master
          </h1>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex space-x-8 font-orbitron text-sm">
            <li>
              <Link 
                to="/" 
                className={`transition-all duration-300 hover:text-neonBlue ${
                  location.pathname === '/' ? 'text-neonBlue' : 'text-white/80'
                }`}
              >
                MARKETPLACE
              </Link>
            </li>
            <li>
              <Link 
                to="/my-nfts" 
                className={`transition-all duration-300 hover:text-neonBlue ${
                  location.pathname === '/my-nfts' ? 'text-neonBlue' : 'text-white/80'
                }`}
              >
                MY NFTS
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <button className="neon-button purple-button">
            <span>Connect Wallet</span>
          </button>
          
          <div className="md:hidden flex items-center">
            <Link to="/" className={location.pathname === '/' ? 'text-neonBlue' : 'text-white/80'}>
              <LayoutGrid size={20} />
            </Link>
            <Link to="/my-nfts" className={`ml-4 ${location.pathname === '/my-nfts' ? 'text-neonBlue' : 'text-white/80'}`}>
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
