# 🔗 Web3 Smart Contracts

This directory contains the smart contracts and blockchain integration components for the BlockFund platform.

## 📁 Directory Structure

```
web3/
├── contracts/           # Smart contract source files
├── scripts/            # Deployment and interaction scripts
├── test/              # Contract test files
├── hardhat.config.js  # Hardhat configuration
└── package.json       # Dependencies and scripts
```

## 🚀 Features

- **Smart Contract Integration**
  - Crowdfunding campaign management
  - Fund distribution and tracking
  - Token management
  - Governance mechanisms

- **Security Features**
  - Access control
  - Fund locking mechanisms
  - Emergency pause functionality
  - Multi-signature requirements

## 🛠️ Technology Stack

- Solidity ^0.8.0
- Hardhat
- Ethers.js
- OpenZeppelin Contracts
- Thirdweb SDK

## 📋 Prerequisites

- Node.js v14+
- MetaMask or Web3 wallet
- Hardhat
- Git

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Compile Contracts**
   ```bash
   npm run compile
   ```

3. **Run Tests**
   ```bash
   npm run test
   ```

4. **Deploy Contracts**
   ```bash
   npm run deploy:local    # For local development
   npm run deploy:testnet  # For testnet deployment
   npm run deploy:mainnet  # For mainnet deployment
   ```

## 📝 Contract Documentation

### Main Contracts

1. **CrowdfundingCampaign.sol**
   - Manages individual crowdfunding campaigns
   - Handles fund collection and distribution
   - Implements campaign milestones

2. **CampaignFactory.sol**
   - Creates new crowdfunding campaigns
   - Manages campaign registry
   - Handles campaign verification

3. **TokenManager.sol**
   - Manages platform tokens
   - Handles token distribution
   - Implements token economics

## 🔒 Security

- All contracts are audited
- Implements OpenZeppelin security patterns
- Regular security updates
- Emergency pause functionality

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- test/CrowdfundingCampaign.test.js

# Run coverage
npm run coverage
```

## 📊 Contract Verification

```bash
# Verify contract on Etherscan
npx hardhat verify --network <network> <contract-address> <constructor-arguments>
```

## 🔄 Development Workflow

1. Write contract code in `contracts/`
2. Write tests in `test/`
3. Compile contracts
4. Run tests
5. Deploy to testnet
6. Verify contracts
7. Deploy to mainnet

## 📚 Resources

- [Solidity Documentation](https://docs.soliditylang.org/)
- [Hardhat Documentation](https://hardhat.org/getting-started/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Ethers.js Documentation](https://docs.ethers.io/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For technical support or questions about the smart contracts, please open an issue in the repository.

---

Made with ❤️ by BlockFund Team
