// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SonicNFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct NFT {
        uint256 tokenId;
        address creator;
        address owner;
        string name;
        string description;
        string imageURI;
        uint256 price;
        bool listed;
    }

    mapping(uint256 => NFT) public nfts;
    
    event NFTMinted(uint256 indexed tokenId, address indexed creator, string imageURI, uint256 price);
    event NFTBought(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event PriceUpdated(uint256 indexed tokenId, uint256 newPrice);

    constructor() ERC721("SonicNFT", "SNFT") {}

    function mintNFT(
        string memory _name,
        string memory _description,
        string memory _imageURI,
        uint256 _price
    ) external {
        require(bytes(_imageURI).length > 0, "Image URI cannot be empty");
        require(_price > 0, "Price must be greater than zero");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _imageURI);

        nfts[newTokenId] = NFT({
            tokenId: newTokenId,
            creator: msg.sender,
            owner: msg.sender,
            name: _name,
            description: _description,
            imageURI: _imageURI,
            price: _price,
            listed: true
        });

        emit NFTMinted(newTokenId, msg.sender, _imageURI, _price);
    }

    function buyNFT(uint256 _tokenId) external payable {
        NFT storage nft = nfts[_tokenId];
        require(nft.listed, "NFT is not listed for sale");
        require(msg.value >= nft.price, "Insufficient funds");
        require(nft.owner != msg.sender, "You cannot buy your own NFT");

        address seller = nft.owner;
        nft.owner = msg.sender;
        nft.listed = false;
        _transfer(seller, msg.sender, _tokenId);
        payable(seller).transfer(msg.value);

        emit NFTBought(_tokenId, msg.sender, nft.price);
    }

    function updatePrice(uint256 _tokenId, uint256 _newPrice) external {
        NFT storage nft = nfts[_tokenId];
        require(msg.sender == nft.owner, "Only owner can update price");
        require(_newPrice > 0, "Price must be greater than zero");

        nft.price = _newPrice;
        emit PriceUpdated(_tokenId, _newPrice);
    }

    function getAllListedNFTs() external view returns (NFT[] memory) {
        uint256 totalNFTs = _tokenIds.current();
        uint256 count;
        for (uint256 i = 1; i <= totalNFTs; i++) {
            if (nfts[i].listed) {
                count++;
            }
        }

        NFT[] memory listedNFTs = new NFT[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= totalNFTs; i++) {
            if (nfts[i].listed) {
                listedNFTs[index] = nfts[i];
                index++;
            }
        }
        return listedNFTs;
    }
}
