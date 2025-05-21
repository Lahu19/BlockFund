# 🚀 Backend API Server

This directory contains the backend API server for the BlockFund platform, handling data persistence, business logic, and integration with external services.

## 📁 Directory Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── middleware/    # Custom middleware
│   └── utils/         # Utility functions
├── config/            # Configuration files
├── tests/            # Test files
└── package.json      # Dependencies and scripts
```

## 🚀 Features

- **API Endpoints**
  - Campaign management
  - User authentication
  - Payment processing
  - Analytics and reporting
  - Webhook handling

- **Database Integration**
  - SQL database management
  - Data validation
  - Query optimization
  - Migration handling

- **Security**
  - JWT authentication
  - Rate limiting
  - Input validation
  - CORS configuration

## 🛠️ Technology Stack

- Node.js
- Express.js
- SQL Database
- JWT Authentication
- Firebase Admin SDK
- Web3 Integration

## 📋 Prerequisites

- Node.js v14+
- SQL Database
- Firebase Admin SDK credentials
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

3. **Database Setup**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📝 API Documentation

### Main Endpoints

1. **Campaign Management**
   - `POST /api/campaigns` - Create campaign
   - `GET /api/campaigns` - List campaigns
   - `GET /api/campaigns/:id` - Get campaign details
   - `PUT /api/campaigns/:id` - Update campaign
   - `DELETE /api/campaigns/:id` - Delete campaign

2. **User Management**
   - `POST /api/auth/register` - Register user
   - `POST /api/auth/login` - Login user
   - `GET /api/users/profile` - Get user profile
   - `PUT /api/users/profile` - Update profile

3. **Payment Processing**
   - `POST /api/payments` - Process payment
   - `GET /api/payments/history` - Payment history
   - `POST /api/payments/webhook` - Payment webhook

## 🔒 Security

- JWT-based authentication
- Rate limiting
- Input sanitization
- CORS protection
- SQL injection prevention

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- tests/campaign.test.js

# Run coverage
npm run coverage
```

## 📊 API Documentation

```bash
# Generate API documentation
npm run docs:generate

# Serve API documentation
npm run docs:serve
```

## 🔄 Development Workflow

1. Create feature branch
2. Write code and tests
3. Run tests and linting
4. Create pull request
5. Code review
6. Merge to main

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [SQL Documentation](https://www.sql.org/)
- [JWT Documentation](https://jwt.io/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For technical support or questions about the backend, please open an issue in the repository.

---

Made with ❤️ by BlockFund Team 