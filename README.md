# 🚀 CryptoX - Centralized Cryptocurrency Exchange

> A production-inspired cryptocurrency exchange backend built with Node.js, Express, PostgreSQL, Prisma, and WebSocket.
>
> This project is designed to demonstrate how real centralized exchanges such as Binance, Coinbase, CoinDCX, and Kraken manage wallets, order books, matching engines, and trade execution.

---

## 📖 Overview

CryptoX is a backend-focused cryptocurrency exchange that simulates the architecture of a real centralized exchange.

Unlike traditional CRUD applications, CryptoX focuses on financial transaction integrity, order matching, wallet management, balance locking, and trade settlement.

The project follows a modular service-based architecture and is designed with scalability and maintainability in mind.

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Role Based Authorization
- Password Hashing (bcrypt)

---

## 👛 Wallet

- Create wallet automatically on registration
- Multi Asset Wallet
- Available Balance
- Locked Balance
- Deposit Assets
- Withdraw Assets
- Transaction History

---

## 💱 Trading

- Trading Pair Management
- Place Buy Order
- Place Sell Order
- Cancel Order
- Market Orders (Planned)
- Limit Orders
- Order Validation

---

## 📈 Matching Engine

- Price-Time Priority Matching
- Partial Order Fill
- Complete Order Fill
- Multiple Order Matching
- Trade Settlement
- Automatic Order Status Updates

---

## 📊 Order Book

- Live Buy Orders
- Live Sell Orders
- Best Bid
- Best Ask

---

## 💰 Transactions

- Deposit
- Withdraw
- Lock Balance
- Unlock Balance
- Trade Settlement
- Ledger Records

---

## 📡 Real-Time Features

- WebSocket Order Book Updates
- Live Trades
- Portfolio Updates

---

## 🛡 Security

- JWT Authentication
- Password Encryption
- Database Transactions
- Atomic Wallet Updates
- Balance Locking
- Input Validation

---

# 🏗 Architecture

```
                 Client
                    │
                    ▼
              Express API
                    │
                    ▼
             Authentication
                    │
                    ▼
              Order Service
                    │
        ┌───────────┴────────────┐
        │                        │
        ▼                        ▼
   Wallet Service          Matching Engine
        │                        │
        └───────────┬────────────┘
                    ▼
               PostgreSQL
```

---

# 📁 Project Structure

```
src
│
├── config
│
├── middleware
│
├── modules
│   ├── auth
│   ├── wallet
│   ├── asset
│   ├── tradingPair
│   ├── order
│   ├── trade
│   └── matchingEngine
│
├── routes
│
├── utils
│
└── app.js
```

---

# 🗄 Database Design

## Core Entities

- User
- Wallet
- WalletBalance
- Asset
- TradingPair
- Order
- Trade
- Transaction

---

# 📊 Database Relationship

```
User
 │
 └──── Wallet
          │
          ├──── WalletBalance
          │           │
          │           ▼
          │        Asset
          │
          └──── Transaction

User
 │
 └──── Order
          │
          ▼
     TradingPair
          │
          ▼
        Trade
```

---

# ⚙ Tech Stack

### Backend

- Node.js
- Express.js

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- JWT
- bcrypt

### Real Time

- WebSocket

### Validation

- Zod (Upcoming)

### Caching

- Redis (Upcoming)

### Queue

- BullMQ (Upcoming)

### Containerization

- Docker

---

# 🔄 Order Lifecycle

```
OPEN

↓

PARTIALLY_FILLED

↓

FILLED
```

or

```
OPEN

↓

CANCELLED
```

---

# 💰 Wallet Lifecycle

Deposit

```
Available += Amount
```

Withdraw

```
Available -= Amount
```

Place BUY Order

```
Available USDT

↓

Locked USDT
```

Place SELL Order

```
Available BTC

↓

Locked BTC
```

Trade Execution

```
Unlock

↓

Transfer

↓

Credit Receiver
```

---

# ⚡ Matching Algorithm

The exchange follows **Price-Time Priority**.

For BUY Orders

- Lowest Sell Price First
- Earliest Order First

For SELL Orders

- Highest Buy Price First
- Earliest Order First

---

# 🔁 Order Flow

```
Client

↓

POST /orders

↓

Validate Request

↓

Check Trading Pair

↓

Calculate Lock Amount

↓

Lock Wallet Balance

↓

Create Order

↓

Matching Engine

↓

Trade Execution

↓

Update Wallets

↓

Update Orders

↓

Return Response
```

---

# 📡 API Endpoints

## Authentication

```
POST /auth/register

POST /auth/login
```

---

## Wallet

```
GET /wallet

POST /wallet/deposit

POST /wallet/withdraw
```

---

## Orders

```
POST /orders

GET /orders

GET /orders/:id

DELETE /orders/:id
```

---

## Assets

```
GET /assets

GET /trading-pairs
```

---

# 🔒 ACID Transactions

Financial operations are executed inside Prisma Transactions.

Examples:

- Deposit
- Withdraw
- Place Order
- Trade Settlement

This guarantees consistency even if any operation fails.

---

# 🚀 Future Improvements

- Redis Cache
- BullMQ
- WebSocket Scaling
- Email Notifications
- KYC
- Admin Dashboard
- Blockchain Deposit
- Blockchain Withdraw
- Trading Fees
- Stop Loss Orders
- OCO Orders
- Futures Trading
- Margin Trading
- Liquidity Engine
- Rate Limiting
- Audit Logs
- Unit Tests
- Integration Tests
- CI/CD Pipeline

---

# 🎯 Learning Outcomes

This project demonstrates understanding of:

- Backend System Design
- Financial Transactions
- Database Design
- Order Matching Algorithms
- Wallet Management
- Concurrency
- Atomic Transactions
- Clean Architecture
- Service-Based Architecture
- REST APIs
- Authentication & Authorization
- Exchange Architecture

---

# 📸 Screenshots

> Add screenshots of:

- Login
- Wallet
- Deposit
- Withdraw
- Order Book
- Trading Dashboard
- Portfolio

---

# 🤝 Contributing

Contributions are welcome.

Feel free to fork the repository and submit a pull request.

---

# 📄 License

MIT License

---

# 👨‍💻 Author

**Divyanshu Uttam**

GitHub: https://github.com/divyanshu978

LinkedIn: https://www.linkedin.com/in/divyanshu-uttam-87391423b/

Email: divyanshuuttam978@gmail.com
