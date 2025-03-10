import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, Zap, ThumbsUp, ThumbsDown } from 'lucide-react';
import NFTCard from './NFTCard';
import { mockNFTs } from '../data/mockNFTData';
import { getNFTRecommendations } from '@/utils/openai';

interface NFTCardData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  aiScore: number;
  seller: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  nftCards?: NFTCardData[];
  timestamp: Date;
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Generate a welcome message when the chat is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessages = [
        {
          id: '1',
          sender: 'ai' as const,
          text: "Welcome to DeFAI Smart Buy Assitant! I'm your AI assistant for NFT purchases. Ask me anything about NFTs, pricing, or market trends.",
          timestamp: new Date(),
        },
        {
          id: '2',
          sender: 'ai' as const,
          text: "Some things you can ask me:\n- What NFTs are trending right now?\n- Is this a good time to buy?\n- What's a fair price for this collection?\n- Help me find unique AI-generated art",
          timestamp: new Date(),
        },
      ];
      
      setMessages(welcomeMessages);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Get AI recommendations
      const recommendedNFTs = await getNFTRecommendations(input.trim());
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'These are the NFTs that best match your requirements:',
        nftCards: recommendedNFTs.map(nft => ({
          id: nft.id,
          name: nft.name,
          description: nft.description,
          imageUrl: nft.imageUrl,
          price: parseFloat(nft.price),
          aiScore: 0, // We can implement AI scoring later
          seller: nft.seller
        })),
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I encountered an error while searching for NFTs. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Auto-resize textarea as user types
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="glass-panel w-full max-w-3xl h-[80vh] flex flex-col animate-scale-in"
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-neonPurple/20 flex items-center justify-center mr-3">
              <Zap size={16} className="text-neonPurple" />
            </div>
            <h3 className="font-orbitron text-lg text-white">DeFAI Smart Buy Assistant</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/70 transition-all duration-200"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-neonPurple/30 rounded-tr-none'
                    : 'bg-white/5 rounded-tl-none'
                }`}
              >
                {message.sender === 'ai' && (
                  <div className="flex items-center mb-1">
                    <Zap size={14} className="text-neonBlue mr-1" />
                    <span className="text-neonBlue text-xs font-orbitron">DeFAI</span>
                    <span className="text-white/30 text-xs ml-2">{formatTime(message.timestamp)}</span>
                  </div>
                )}
                
                <div className={message.sender === 'ai' ? 'typewriter' : ''}>
                  {message.text && <p className="text-white whitespace-pre-line">{message.text}</p>}
                  
                  {message.nftCards && message.nftCards.length > 0 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {message.nftCards.map((nft) => (
                          <div key={nft.id} className="transform transition-all duration-300 hover:scale-[1.02]">
                            <NFTCard
                              id={nft.id}
                              name={nft.name}
                              description={nft.description}
                              imageUrl={nft.imageUrl}
                              price={nft.price}
                              aiScore={nft.aiScore}
                              seller={nft.seller}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {message.sender === 'user' && (
                  <div className="flex justify-end mt-1">
                    <span className="text-white/30 text-xs">{formatTime(message.timestamp)}</span>
                  </div>
                )}
                
                {message.sender === 'ai' && (
                  <div className="flex justify-end mt-2 space-x-2">
                    <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
                      <ThumbsUp size={14} className="text-white/50 hover:text-neonBlue" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
                      <ThumbsDown size={14} className="text-white/50 hover:text-electricPink" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white/5 rounded-2xl rounded-tl-none max-w-[80%] px-4 py-3">
                <div className="flex items-center mb-1">
                  <Zap size={14} className="text-neonBlue mr-1" />
                  <span className="text-neonBlue text-xs font-orbitron">DeFAI</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              placeholder="Ask about NFTs, collections, or specific art styles..."
              className="neon-input w-full pr-12 min-h-[40px] max-h-[120px] overflow-y-auto resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`absolute right-2 bottom-2 p-2 rounded-full ${
                input.trim() && !isTyping
                  ? 'bg-neonPurple text-white'
                  : 'bg-white/5 text-white/30'
              } transition-colors`}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
