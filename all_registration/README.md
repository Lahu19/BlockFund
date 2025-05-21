# 🔐 BlockFund Registration System

This directory contains the registration and authentication system for the BlockFund platform, handling user registration, authentication, and profile management.

## 📁 Directory Structure

```
all_registration/
├── src/
│   ├── components/     # Registration components
│   ├── pages/         # Registration pages
│   ├── hooks/         # Custom React hooks
│   ├── context/       # React context providers
│   ├── utils/         # Utility functions
│   ├── styles/        # Registration styles
│   └── assets/        # Static assets
├── public/            # Public assets
└── package.json       # Dependencies and scripts
```

## 🚀 Features

- **User Registration**
  - Email registration
  - Social media login
  - Wallet connection
  - Profile creation

- **Authentication**
  - JWT authentication
  - Session management
  - Password recovery
  - Two-factor authentication

- **Profile Management**
  - Profile information
  - Security settings
  - Notification preferences
  - Account verification

- **Security Features**
  - Password hashing
  - Rate limiting
  - Email verification
  - Session management

## 🛠️ Technology Stack

- React.js
- Vite
- Tailwind CSS
- Firebase Auth
- Web3.js
- JWT
- React Router

## 📋 Prerequisites

- Node.js v14+
- npm or yarn
- Firebase project
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

1. **Registration Components**
   - `SignUpForm` - User registration
   - `LoginForm` - User login
   - `WalletConnect` - Web3 wallet connection
   - `SocialLogin` - Social media login

2. **Profile Components**
   - `ProfileForm` - Profile management
   - `SecuritySettings` - Security configuration
   - `NotificationSettings` - Notification preferences
   - `VerificationStatus` - Account verification

3. **Authentication Components**
   - `AuthGuard` - Route protection
   - `SessionManager` - Session handling
   - `PasswordReset` - Password recovery
   - `TwoFactorAuth` - 2FA setup

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Custom registration theme
- Responsive design
- Dark mode support

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- src/components/SignUpForm.test.jsx

# Run coverage
npm run coverage
```

## 🔒 Security

- Password hashing with bcrypt
- JWT token management
- Rate limiting
- Input validation
- XSS protection
- CSRF protection

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
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [JWT Documentation](https://jwt.io/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For technical support or questions about the registration system, please open an issue in the repository.

---

Made with ❤️ by BlockFund Team
