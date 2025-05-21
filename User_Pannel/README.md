# 👤 BlockFund User Panel

This directory contains the user dashboard and management interface for the BlockFund platform, providing users with tools to manage their campaigns and contributions.

## 📁 Directory Structure

```
User_Pannel/
├── src/
│   ├── components/     # Dashboard components
│   ├── pages/         # Dashboard pages
│   ├── hooks/         # Custom React hooks
│   ├── context/       # React context providers
│   ├── utils/         # Utility functions
│   ├── styles/        # Dashboard styles
│   └── assets/        # Static assets
├── public/            # Public assets
└── package.json       # Dependencies and scripts
```

## 🚀 Features

- **Dashboard Overview**
  - Campaign statistics
  - Fund tracking
  - User analytics
  - Recent activities

- **Campaign Management**
  - Campaign creation
  - Fund distribution
  - Milestone tracking
  - Campaign updates

- **User Management**
  - Profile settings
  - Wallet management
  - Notification preferences
  - Security settings

- **Analytics & Reporting**
  - Campaign performance
  - Fund analytics
  - User engagement
  - Transaction history

## 🛠️ Technology Stack

- React.js
- Vite
- Tailwind CSS
- Chart.js
- Web3.js
- Thirdweb SDK
- React Router

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

1. **Dashboard Components**
   - `DashboardOverview` - Main dashboard view
   - `CampaignStats` - Campaign statistics
   - `FundTracker` - Fund tracking
   - `ActivityFeed` - Recent activities

2. **Management Components**
   - `CampaignManager` - Campaign management
   - `FundManager` - Fund management
   - `UserSettings` - User settings
   - `WalletManager` - Wallet management

3. **Analytics Components**
   - `PerformanceChart` - Performance metrics
   - `TransactionHistory` - Transaction records
   - `AnalyticsReport` - Analytics reports

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Custom dashboard theme
- Responsive design
- Dark mode support

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- src/components/DashboardOverview.test.jsx

# Run coverage
npm run coverage
```

## 📱 Responsive Design

- Mobile-first approach
- Dashboard-specific breakpoints
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
- [Chart.js Documentation](https://www.chartjs.org/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For technical support or questions about the user panel, please open an issue in the repository.

---

Made with ❤️ by BlockFund Team
