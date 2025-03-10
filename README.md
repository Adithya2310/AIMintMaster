# Sonic AI Mint Master - AI-Powered NFT Marketplace

Sonic AI Mint Master is a next-generation NFT marketplace that leverages multiple AI models to enhance the NFT creation, buying, and selling experience. It combines blockchain technology with artificial intelligence to provide unique features like AI-generated NFT art, intelligent pricing suggestions, and a smart buying assistant.

## 🎨 Features

### 1. AI-Powered NFT Creation
- **Image Generation**: Utilizes multiple AI models for diverse artistic styles
  - **Stable Diffusion XL Base 1.0**: High-quality base image generation
  - **Dreamshaper 8 LCM**: Enhanced artistic styling and variations
- **Smart Price Prediction**: AI-driven price suggestions based on market data
- **Automated Metadata Generation**: AI-assisted description and tag generation

### 2. DeFAI Smart Buyer Assistant
- Powered by **OpenAI GPT-4o**
- Intelligent NFT recommendations based on user preferences
- Natural language understanding for complex queries
- Real-time market analysis and suggestions

### 3. Core Marketplace Features
- Mint and list NFTs
- Buy and sell NFTs
- View owned NFTs
- Update NFT prices
- Transfer NFTs

## 🛠 Technical Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Ethers.js for blockchain interaction

### Smart Contracts
- Solidity
- Hardhat development environment
- OpenZeppelin contracts


## 🎯 AI Model Details

### Image Generation Models

#### Stable Diffusion XL Base 1.0
- Primary image generation model
- Features:
  - High-resolution output (1024x1024)
  - Detailed texture generation
  - Consistent style maintenance
- Best for: Base image creation and realistic artwork

#### Dreamshaper 8 LCM
- Style enhancement model
- Features:
  - Artistic style transfer
  - Quick iterations
  - Creative variations
- Best for: Artistic modifications and style experimentation

### Chat Interface Model

#### OpenAI GPT-4o
- Advanced language model for NFT recommendations
- Features:
  - Natural language understanding
  - Context-aware responses
  - Market trend analysis
- Use cases:
  - NFT recommendations
  - Price analysis
  - Market insights
  - Collection evaluation

## 📝 Smart Contract Integration

The marketplace interacts with smart contracts deployed on the sonic blockchain using EVM Solidity smart contracts. Key functions include
- Mint and list NFTs
- Buy and sell NFTs
- View owned NFTs
- Update NFT prices
- Transfer NFTs 
  
## 🔒 Security Considerations

1. API Keys Protection
   - Backend proxy for AI API calls
   - Environment variable management
   - Rate limiting implementation

2. Smart Contract Security
   - OpenZeppelin security standards
   - Access control implementation
   - Reentrancy protection

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.