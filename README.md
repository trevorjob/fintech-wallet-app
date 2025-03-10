# Fintech Wallet API

A RESTful API for a fintech wallet application built with Node.js, Express, TypeScript, and MongoDB.

## Features

- 🔐 User registration and authentication (JWT)
- 💰 Wallet creation and management
- 💸 Fund wallet through payment gateway
- 🔄 Transfer funds between wallets
- 📤 Withdraw funds to bank accounts
- 📊 View wallet balance and transaction history
- 🔒 Security with rate limiting and proper validation

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
   git clone <repository-url>
   cd fintech-wallet-api
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
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Using Docker

1. Build and start the containers:

   ```bash
   docker-compose up -d
   ```

2. The API will be available at `http://localhost:3000`

## Testing

Run the test suite:

```bash
npm test
```

For test coverage report:

```bash
npm test -- --coverage
```

## API Documentation

A Postman collection is included in the repository for API documentation.

Import the collection into Postman from the `server/fintech-wallet-api.postman_collection.json` file.

## License

[MIT](LICENSE)
