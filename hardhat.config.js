require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  paths: {
    sources: "./web3/contracts",
    tests: "./web3/test",
    cache: "./web3/cache",
    artifacts: "./web3/artifacts"
  }
}; 