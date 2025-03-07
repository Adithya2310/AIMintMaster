require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    mumbai: {
      url: `https://rpc.blaze.soniclabs.com/`, // Alchemy RPC URL or Infura
      accounts: [`0x${process.env.PRIVATE_KEY}`] // The private key of your wallet
    },
  },
};
