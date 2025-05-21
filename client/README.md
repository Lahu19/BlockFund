# 🎨 BlockFund Client

This directory contains the main client application for the BlockFund platform, built with React and Vite.

## 📁 Directory Structure

```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── context/       # React context providers
│   ├── utils/         # Utility functions
│   ├── styles/        # Global styles
│   └── assets/        # Static assets
├── public/            # Public assets
└── package.json       # Dependencies and scripts
```

## 🚀 Features

- **User Interface**
  - Modern, responsive design
  - Dark/Light theme support
  - Mobile-first approach
  - Accessibility features

- **Campaign Features**
  - Campaign discovery
  - Campaign creation
  - Fund contribution
  - Progress tracking
  - Social sharing

- **User Features**
  - Profile management
  - Campaign management
  - Transaction history
  - Notifications
  - Wallet integration

## 🛠️ Technology Stack

- React.js
- Vite
- Tailwind CSS
- Web3.js
- Thirdweb SDK
- React Router
- React Query

## 📋 Prerequisites

- Node.js v14+
- npm or yarn
- MetaMask or Web3 wallet
- Git

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📝 Component Documentation

### Main Components

1. **Campaign Components**
   - `CampaignCard` - Campaign preview card
   - `CampaignDetails` - Detailed campaign view
   - `CampaignForm` - Campaign creation/editing
   - `CampaignList` - Campaign listing

2. **User Components**
   - `UserProfile` - User profile management
   - `WalletConnect` - Web3 wallet integration
   - `TransactionHistory` - Transaction records

3. **Shared Components**
   - `Navbar` - Navigation bar
   - `Footer` - Page footer
   - `Button` - Reusable button
   - `Modal` - Modal dialog

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Custom theme configuration
- Responsive design
- Dark mode support

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- src/components/CampaignCard.test.jsx

# Run coverage
npm run coverage
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint system
- Flexible layouts
- Touch-friendly interfaces

## 🔄 Development Workflow

1. Create feature branch
2. Write components and tests
3. Run tests and linting
4. Create pull request
5. Code review
6. Merge to main

## 📚 Resources

- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For technical support or questions about the client application, please open an issue in the repository.

---

Made with ❤️ by BlockFund Team
