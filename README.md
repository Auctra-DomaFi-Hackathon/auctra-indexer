# Auctra Indexer - Domain Auction System

[![Node.js](https://img.shields.io/badge/Node.js->=18.14-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Ponder](https://img.shields.io/badge/Ponder-0.12.16-purple.svg)](https://ponder.sh/)

A comprehensive blockchain indexer for the Auctra domain auction system, built with **Ponder** framework. This indexer tracks and indexes various auction types including English, Dutch, and Sealed Bid auctions, as well as domain lending/rental systems on the Doma testnet.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Usage](#usage)
7. [GraphQL API](#graphql-api)
8. [Database Schema](#database-schema)
9. [Smart Contracts](#smart-contracts)
10. [Development](#development)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

## Overview

The Auctra Indexer is a real-time blockchain data indexer specifically designed for the Auctra domain auction marketplace. It monitors and processes events from multiple smart contracts on the Doma testnet, providing structured data access through a comprehensive GraphQL API.

### What it does:

- **Event Indexing**: Monitors auction-related events in real-time
- **Data Aggregation**: Processes and structures auction data for easy querying
- **Multi-Auction Support**: Handles English, Dutch, and Sealed Bid auction types
- **Domain Services**: Tracks domain lending and rental activities
- **Fee Tracking**: Monitors fee distributions and protocol fees
- **Statistics**: Provides auction metrics and analytics

## Features

### 🏪 Auction Types Support
- **English Auctions**: Traditional ascending price auctions
- **Dutch Auctions**: Descending price auctions
- **Sealed Bid Auctions**: Private bid commitments with reveal phase

### 💰 Domain Financial Services
- **Domain Lending Pool**: Track liquidity providers, borrowers, and loan metrics
- **Domain Rental Vault**: Monitor rental listings and transactions
- **Fee Distribution**: Complete fee breakdown and royalty tracking

### 🔍 Data Access
- **GraphQL API**: Flexible query interface with pagination and filtering
- **Real-time Updates**: Live data streaming through subscriptions
- **Type-safe Queries**: Fully typed GraphQL schema with auto-completion

### 📊 Analytics & Metrics
- Auction statistics and volume tracking
- User activity monitoring
- Pool utilization metrics
- Historical data analysis

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Smart         │    │   Ponder         │    │   Database      │
│   Contracts     │───▶│   Indexer        │───▶│   (SQLite/      │
│   (Doma Chain)  │    │   Engine         │    │   PostgreSQL)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   GraphQL API    │
                       │   - Queries      │
                       │   - Subscriptions│
                       └──────────────────┘
```

## Installation

### Prerequisites

- **Node.js** >= 18.14
- **pnpm** (recommended) or npm
- **Git**

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/auctra-indexer-auction.git
cd auctra-indexer-auction

# Install dependencies
pnpm install
# or
npm install

# Copy environment variables
cp .env.example .env

# Start development server
pnpm dev
# or
npm run dev
```

The indexer will start syncing data and the GraphQL API will be available at:
- GraphQL Playground: `http://localhost:42069/graphql`

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Network Configuration
ACTIVE_NETWORK=domaTestnet
PONDER_RPC_URL_DOMA_TESTNET=https://rpc-testnet.doma.xyz

# Database Configuration (Optional - defaults to SQLite)
DATABASE_SCHEMA=public
# PONDER_DATABASE_URL=postgresql://username:password@localhost:5432/ponder_db

# Development Settings
PONDER_LOG_LEVEL=info
```

### Network Configuration

The indexer is configured to work with the Doma testnet by default. The configuration includes:

- **Chain ID**: 97476
- **RPC URL**: https://rpc-testnet.doma.xyz
- **Start Block**: Various per contract (optimized for minimal sync time)

## Usage

### Development Mode

```bash
# Start in development mode with hot reloading
pnpm dev

# Generate TypeScript types from schema
pnpm codegen

# Check database status
pnpm db

# Run type checking
pnpm typecheck

# Run linting
pnpm lint
```

### Production Mode

```bash
# Start in production mode
pnpm start
```

### Database Management

```bash
# Reset database and resync from start block
pnpm db reset

# Check database status
pnpm db status

# Create database backup
pnpm db backup
```

## GraphQL API

Access the GraphQL playground at `http://localhost:42069/graphql`

The indexer provides a comprehensive GraphQL API. See [Query_Documentation.md](./Query_Documentation.md) for detailed examples of all available queries.

### Quick Examples

#### Get Active Auctions
```graphql
query GetActiveListings {
  listings(where: { status: "Live" }, limit: 10) {
    id
    seller
    nft
    tokenId
    reservePrice
    endTime
  }
}
```

#### Get User Bid History
```graphql
query GetUserBids($bidder: String!) {
  bids(where: { bidder: $bidder }, orderBy: "timestamp", orderDirection: "desc") {
    id
    listingId
    amount
    timestamp
  }
}
```

#### Get Auction Statistics
```graphql
query GetAuctionStats {
  auctionStats(limit: 1, orderBy: "updatedAt", orderDirection: "desc") {
    totalListings
    totalBids
    totalVolume
    averagePrice
  }
}
```

## Database Schema

### Core Auction Tables

#### Listings
Stores all auction listings across different auction types.

```sql
CREATE TABLE listing (
  id TEXT PRIMARY KEY,
  seller TEXT NOT NULL,
  nft TEXT NOT NULL,
  tokenId BIGINT NOT NULL,
  paymentToken TEXT NOT NULL,
  reservePrice BIGINT NOT NULL,
  startTime BIGINT NOT NULL,
  endTime BIGINT NOT NULL,
  strategy TEXT,
  status TEXT NOT NULL,
  winner TEXT,
  winningBid BIGINT,
  createdAt BIGINT NOT NULL,
  updatedAt BIGINT NOT NULL
);
```

#### Bids
Records all bid transactions.

```sql
CREATE TABLE bid (
  id TEXT PRIMARY KEY,
  listingId TEXT NOT NULL,
  bidder TEXT NOT NULL,
  amount BIGINT NOT NULL,
  timestamp BIGINT NOT NULL,
  blockNumber BIGINT NOT NULL,
  transactionHash TEXT NOT NULL
);
```

### Domain Financial Services

#### Lending Pool Tables
- `liquidity_provider`: LP positions and metrics
- `borrower`: Borrower profiles and debt tracking  
- `pool_metrics`: Pool utilization and rates
- `liquidation_event`: Liquidation records

#### Rental Vault Tables
- `rental_listing`: Available rental listings
- `rental`: Active rental agreements
- `rental_history`: Complete rental event history

## Smart Contracts

The indexer monitors the following smart contracts on Doma testnet:

| Contract | Address | Purpose |
|----------|---------|---------|
| DomainAuctionHouse | `0xCD6DD013877570678449E788ab4fb221d37d6f88` | Main auction coordination |
| EnglishAuction | `0xA8083D094cCD8a4B0843C014Dc11AF7b97283906` | English-style auctions |
| DutchAuction | `0xCB0c653f110e469B9d74DBCC3aD632e7B58454b0` | Dutch-style auctions |
| SealedBidAuction | `0xDcD92889cDf7C0D56AD02da1e99bc9Dc022E033a` | Sealed bid auctions |
| FeeManager | `0xec709b51F24801243313F0931525fcAecFE30cEC` | Fee distribution |
| RegistrarBridge | `0x964B0d2eA0896F694710b9f4a20290F470B7801D` | Domain transfers |
| DomainLendingPool | `0x133272720610d669Fa4C5891Ab62a302455585Dd` | Domain lending |
| DomainRentalVault | `0x57Cf6d83589Da81DBB8fD99bcA48B64f52f89eA7` | Domain rentals |

## Development

### Project Structure

```
auctra-indexer-auction/
├── src/
│   ├── handlers/          # Event handlers for each contract
│   │   ├── auctionHouse.ts
│   │   ├── englishAuction.ts
│   │   ├── dutchAuction.ts
│   │   ├── sealedBidAuction.ts
│   │   ├── feeManager.ts
│   │   ├── registrarBridge.ts
│   │   ├── domainLendingPool.ts
│   │   └── domainRentalVault.ts
│   ├── api/               # API route definitions
│   │   └── index.ts
│   └── index.ts          # Main indexer entry point
├── abis/                  # Contract ABI files
├── ponder.config.ts       # Ponder configuration
├── ponder.schema.ts       # Database schema definition
└── Query_Documentation.md # GraphQL query examples
```

### Adding New Event Handlers

1. Define the event handler in the appropriate file under `src/handlers/`
2. Import and use the database schema from `ponder.schema.ts`
3. Handle the event data and update relevant tables
4. Add error handling and logging

Example:
```typescript
import { ponder } from "ponder:registry";
import { listing } from "ponder:schema";

ponder.on("DomainAuctionHouse:Listed", async ({ event, context }) => {
  const { db } = context;
  
  await db.insert(listing).values({
    id: event.args.listingId.toString(),
    seller: event.args.seller,
    nft: event.args.nft,
    tokenId: event.args.tokenId,
    // ... other fields
  });
});
```

### Testing Queries

Use the GraphQL playground at `http://localhost:42069/graphql` to test queries during development.

For complex queries, refer to the examples in [Query_Documentation.md](./Query_Documentation.md).

## Deployment

### Production Deployment

1. **Build the application:**
```bash
pnpm install --production
pnpm codegen
```

2. **Configure environment variables:**
```bash
# Set production RPC endpoints
export PONDER_RPC_URL_DOMA_TESTNET=your-production-rpc-url

# Configure database (recommended: PostgreSQL)
export PONDER_DATABASE_URL=postgresql://user:pass@localhost:5432/auctra_prod
```

3. **Start the indexer:**
```bash
pnpm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --production

COPY . .
RUN pnpm codegen

EXPOSE 42069
CMD ["pnpm", "start"]
```

### Monitoring

- Monitor sync status through logs
- Set up alerts for failed event processing
- Track database growth and performance
- Monitor RPC endpoint health

## Troubleshooting

### Common Issues

#### Sync Problems
```bash
# Reset and resync from start block
pnpm db reset
pnpm dev
```

#### RPC Connection Issues
- Check RPC endpoint availability
- Verify network connectivity
- Consider using multiple RPC endpoints for redundancy

#### Database Issues
```bash
# Check database status
pnpm db status

# Recreate database schema
pnpm db reset
```

#### Memory Issues
- Increase Node.js memory limit: `--max-old-space-size=4096`
- Optimize query pagination
- Consider using PostgreSQL for large datasets

### Performance Optimization

1. **Database Indexes**: Ensure proper indexing on frequently queried fields
2. **Query Optimization**: Use pagination and filtering in GraphQL queries
3. **Caching**: Implement caching for frequently accessed data
4. **Batch Processing**: Process events in batches for better performance

### Debugging

Enable debug logging:
```bash
export PONDER_LOG_LEVEL=debug
pnpm dev
```

Monitor specific event handlers:
```bash
export DEBUG=ponder:handlers
pnpm dev
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run the linter: `pnpm lint`
5. Run type checking: `pnpm typecheck`
6. Commit your changes: `git commit -m 'Add feature'`
7. Push to the branch: `git push origin feature-name`
8. Submit a pull request

## Support

For questions, issues, or contributions:

- **Issues**: Open an issue on GitHub
- **Documentation**: Check [Query_Documentation.md](./Query_Documentation.md)
- **Community**: Join our Discord/Telegram community

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using [Ponder](https://ponder.sh/) - The TypeScript framework for blockchain indexing.