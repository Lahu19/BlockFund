# Political Party Fund DApp

A decentralized application for managing political party funding with transparency and accountability.

## Features

- Political parties can register on the platform
- Donors can contribute funds to registered parties
- Transparent tracking of all donations
- Parties can withdraw their funds
- Complete donation history available for public viewing

## Prerequisites

- Node.js (v14 or later)
- MetaMask browser extension
- Hardhat for local development

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd political_party_fund
```

2. Install dependencies:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Configure the environment:
- Create a `.env` file in the root directory
- Add your environment variables:
```
PRIVATE_KEY=your_private_key
INFURA_PROJECT_ID=your_infura_project_id
```

## Development

1. Start a local Hardhat node:
```bash
npx hardhat node
```

2. Deploy the smart contract:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. Update the contract address:
- Copy the deployed contract address
- Update `CONTRACT_ADDRESS` in `frontend/src/components/PoliticalFunding.tsx`

4. Start the frontend:
```bash
cd frontend
npm start
```

## Usage

1. Connect your MetaMask wallet to the application
2. Register a political party (if you're a party representative)
3. Make donations to registered parties (if you're a donor)
4. View donation history and party details
5. Withdraw funds (if you're a registered party)

## Smart Contract

The smart contract is deployed on the Ethereum network and includes the following main functions:

- `registerParty(string name)`: Register a new political party
- `donate(address partyAddress, string message)`: Make a donation to a party
- `withdrawFunds(uint256 amount)`: Withdraw funds (only for registered parties)
- `getPartyDetails(address partyAddress)`: Get party information
- `getPartyDonations(address partyAddress)`: Get donation history

## Security

- The smart contract has been developed with security best practices
- Only registered parties can withdraw funds
- All transactions are recorded on the blockchain
- Transparent and immutable donation history

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
