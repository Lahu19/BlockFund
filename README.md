# BlockFund - Decentralized Crowdfunding Platform

BlockFund is a comprehensive decentralized crowdfunding platform that leverages blockchain technology to provide secure, transparent, and efficient crowdfunding solutions. The platform consists of multiple components working together to create a seamless crowdfunding experience.

## 🏗️ Project Structure

```
project_crowdfunding/
├── web3/                 # Smart contracts and blockchain integration
├── backend/             # Backend API server
├── client/              # Main client application
├── User_Pannel/         # User dashboard and management interface
├── all_registration/    # Registration and authentication system
└── setup.ps1           # Project setup script
```

## 🚀 Features

- Decentralized crowdfunding using smart contracts
- Secure user authentication and authorization
- Real-time campaign tracking and management
- User dashboard for campaign management
- Transparent transaction history
- Multi-currency support
- Campaign analytics and reporting

## 🛠️ Technology Stack

- **Blockchain**: Ethereum (Hardhat)
- **Frontend**: React.js, Next.js
- **Backend**: Node.js, Express.js
- **Database**: SQL
- **Authentication**: Firebase
- **Smart Contracts**: Solidity

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask or other Web3 wallet
- Git
- PowerShell (for Windows setup)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd project_crowdfunding
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install dependencies for each component
   cd web3 && npm install
   cd ../backend && npm install
   cd ../client && npm install
   cd ../User_Pannel && npm install
   cd ../all_registration && npm install
   ```

3. **Setup the project**
   ```bash
   # Run the setup script
   ./setup.ps1
   ```

4. **Start the development environment**

   Terminal 1 (Web3):
   ```bash
   cd web3
   npm run compile
   npm run deploy:local
   npm run start:local
   ```

   Terminal 2 (Backend):
   ```bash
   cd backend
   npm run dev
   ```

   Terminal 3 (Client):
   ```bash
   cd client
   npm run dev
   ```

   Terminal 4 (User Panel):
   ```bash
   cd User_Pannel
   npm run dev
   ```

   Terminal 5 (Registration):
   ```bash
   cd all_registration
   npm run dev
   ```

## 🔧 Configuration

1. **Environment Variables**
   - Create `.env` files in each component directory
   - Configure Firebase credentials
   - Set up database connection strings
   - Configure blockchain network settings

2. **Smart Contract Deployment**
   - Deploy contracts to your chosen network
   - Update contract addresses in the configuration

## 🧪 Testing

Run the test suite:
```bash
npx hardhat test
```

## 👥 Admin Access

Default admin credentials:
- Email: admin@blockfund.in
- Password: admin321@

## 📝 License

[Add your license information here]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email [your-support-email] or open an issue in the repository.

## 🔐 Security

- All smart contracts are audited
- Regular security updates
- Secure authentication system
- Encrypted data transmission

## 🔄 Updates and Maintenance

- Regular updates to dependencies
- Security patches
- Performance optimizations
- New feature implementations

---

Made with ❤️ by G-36

