# Fintech Wallet API

A complete fintech solution featuring a Node.js/Express/TypeScript backend and React/TypeScript frontend that allows users to register, fund their wallet, transfer between wallets, and withdraw funds.

## Live Demo

- **Frontend**: [Fintech Wallet App](https://fintech-wallet-app.vercel.app)
- **Backend API**: [Fintech Wallet API](https://fintech-wallet-api.onrender.com)

> **Note**: The backend is deployed on Render using their free tier, which may cause the initial request to take 30-60 seconds as the server "wakes up" from inactive state. Subsequent requests will be much faster.

## Features

- 🔐 **Authentication & Authorization**
  - Secure user registration and login with JWT
  - Password encryption using bcrypt
- 💰 **Wallet Management**
  - Fund wallet through Paystack payment gateway
  - Transfer funds between registered users by email
  - Withdraw funds with appropriate fee handling
  - View wallet balance and transaction history
- 📲 **Notifications**
  - Email notifications for successful wallet funding
  - Transaction confirmation messages
- 🛡️ **Security**
  - Rate limiting for wallet funding (max 10 requests per 15 minutes)
  - JWT token-based authentication
  - Input validation and sanitization
- 📱 **Responsive Frontend**
  - Modern UI built with React, TypeScript and shadcn
  - Seamless integration with the backend API

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcrypt
- **Validation**: Zod
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose

## Project Structure

The project follows a clean architecture pattern with the following structure:

```
/fintech-wallet-api
  /src
    /config       - Application configuration
    /controllers  - API controllers
    /middlewares  - Express middlewares
    /models       - Database models
    /repositories - Data access layer
    /routes       - API routes
    /services     - Business logic
    /types        - TypeScript type definitions
    /utils        - Utility functions
    /tests        - Tests
    app.ts        - Express app setup
    server.ts     - Server entry point
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get JWT token

### Wallet Operations

- `GET /api/v1/wallet/balance` - Get wallet balance
- `POST /api/v1/wallet/fund` - Initialize wallet funding
- `GET /api/v1/wallet/fund/verify/:reference` - Verify/complete wallet funding
- `POST /api/v1/wallet/transfer` - Transfer funds to another wallet
- `POST /api/v1/wallet/withdraw` - Withdraw funds from wallet
- `GET /api/v1/wallet/transactions` - Get transaction history (with pagination)

## Business Rules

- Wallet balance cannot be negative
- Users cannot transfer more than they have in their wallet
- Minimum withdrawal amount: ₦1000
- Flat withdrawal fee: ₦50
- Each wallet has a unique 10-digit ID
- All transactions have UUID reference numbers

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker (optional)

### Local Setup

1. Clone the repository:

   ```bash
   git clone [<repository-url>](https://github.com/trevorjob/fintech-wallet-app.git)
   cd fintech-wallet-app/server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (use `.env.example` as a template):

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/fintech-wallet
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=7d
   PAYSTACK_SECRET=paystack_secret
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   EMAIL_SERVICE=mailersend  # or any other service: 'outlook', 'yahoo', etc.
   EMAIL_USER=user
   EMAIL_PASSWORD=pass
   EMAIL_FROM=user
   ```

EMAIL_HOST=host
EMAIL_PORT=587
EMAIL_SECURE=true
MAILERSEND_API_KEY=key
APP_URL=http://localhost:3000
PORT=3000

````

1. Start the development server:
```bash
npm run dev
````

### Using Docker

1. Build and start the containers:

   ```bash
   docker-compose up -d
   ```

2. The API will be available at `http://localhost:3000`

## Testing

Run the test suite:

- Backend tests are written using Jest
- Test coverage: <50%
- Run tests with `npm test`

For test coverage report:

```bash
npm test -- --coverage
```

## API Documentation

A Postman collection is included in the repository for API documentation.

Import the collection into Postman from the `server/fintech-wallet-api.postman_collection.json` file.

## Additional Notes

- The frontend was built with a focus on functionality and user experience, given the time constraints
- Implemented both bonus features: email notifications and rate limiting
- Followed SOLID principles and clean architecture throughout the codebase

## Future Improvements

- Add more comprehensive error handling and recovery
- Implement two-factor authentication
- Add more payment gateway options
- Enhance the transaction history with detailed filtering options
