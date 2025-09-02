# Ponder Indexer Instructions for Domain Auction House

## Overview
This guide provides step-by-step instructions to create a Ponder indexer that captures real-time auction data from the DomainAuctionHouse smart contract and related contracts.

## Prerequisites
- Ponder already installed
- Access to Ethereum/DOMA testnet RPC endpoint
- Contract addresses and ABIs available

## Contract Addresses

```
DomainNFT: 0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f
FeeManager: 0xaCd0B6598768d597Ad6c322f88969E687617Dd28
RegistrarBridge: 0x76D2559Dc8C5C092649C2A0dDFb3d6395157CC18
EnglishAuction: 0x947e70b9362eeCA8a3994F839Ebcc2C1c7d63C5d
DutchAuction: 0x084DA94314FE36Cf957191A78a7d6395dC951686
SealedBidAuction: 0x7Cb994c76074064E6003f7DE048c35A285055c5C
DomainAuctionHouse: 0x346d94b66072D8b9d678058073A0fe7eF449f03f
```

### DOMA Testnet
```
Chain ID: 8654
RPC URL: https://testnet.doma.tech/
Block Explorer: https://explorer-testnet.doma.tech/

Note: Replace contract addresses below with actual deployed addresses on DOMA testnet
DomainNFT: [TO_BE_DEPLOYED]
FeeManager: [TO_BE_DEPLOYED]
RegistrarBridge: [TO_BE_DEPLOYED]
EnglishAuction: [TO_BE_DEPLOYED]
DutchAuction: [TO_BE_DEPLOYED]
SealedBidAuction: [TO_BE_DEPLOYED]
DomainAuctionHouse: [TO_BE_DEPLOYED]
```

## Step 1: Initialize Ponder Project Structure

Create the following directory structure in your project:
```
ponder-indexer/
├── ponder.config.ts
├── ponder.schema.ts
├── src/
│   ├── index.ts
│   └── handlers/
│       ├── auctionHouse.ts
│       ├── englishAuction.ts
│       ├── dutchAuction.ts
│       ├── sealedBidAuction.ts
│       ├── feeManager.ts
│       └── registrarBridge.ts
├── abis/
│   ├── DomainAuctionHouse.json
│   ├── EnglishAuction.json
│   ├── DutchAuction.json
│   ├── SealedBidAuction.json
│   ├── FeeManager.json
│   └── RegistrarBridge.json
└── package.json
```

## Step 2: Configure Ponder (ponder.config.ts)

```typescript
import { createConfig } from "@ponder/core";
import { http } from "viem";

export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      transport: http(process.env.PONDER_RPC_URL_1),
    },
    domaTestnet: {
      chainId: 8654,
      transport: http(process.env.PONDER_RPC_URL_DOMA_TESTNET || "https://testnet.doma.tech/"),
    },
  },
  contracts: {
    // Mainnet contracts
    DomainAuctionHouse: {
      abi: "./abis/DomainAuctionHouse.json",
      address: "0x346d94b66072D8b9d678058073A0fe7eF449f03f",
      network: "mainnet",
      startBlock: 18000000, // Adjust to deployment block
    },
    EnglishAuction: {
      abi: "./abis/EnglishAuction.json",
      address: "0x947e70b9362eeCA8a3994F839Ebcc2C1c7d63C5d",
      network: "mainnet",
      startBlock: 18000000,
    },
    DutchAuction: {
      abi: "./abis/DutchAuction.json",
      address: "0x084DA94314FE36Cf957191A78a7d6395dC951686",
      network: "mainnet",
      startBlock: 18000000,
    },
    SealedBidAuction: {
      abi: "./abis/SealedBidAuction.json",
      address: "0x7Cb994c76074064E6003f7DE048c35A285055c5C",
      network: "mainnet",
      startBlock: 18000000,
    },
    FeeManager: {
      abi: "./abis/FeeManager.json",
      address: "0xaCd0B6598768d597Ad6c322f88969E687617Dd28",
      network: "mainnet",
      startBlock: 18000000,
    },
    RegistrarBridge: {
      abi: "./abis/RegistrarBridge.json",
      address: "0x76D2559Dc8C5C092649C2A0dDFb3d6395157CC18",
      network: "mainnet",
      startBlock: 18000000,
    },

    // DOMA Testnet contracts (uncomment and update addresses when deployed)
    /*
    DomainAuctionHouseTestnet: {
      abi: "./abis/DomainAuctionHouse.json",
      address: "0x[DEPLOYED_ADDRESS]", // Replace with actual deployed address
      network: "domaTestnet",
      startBlock: 1, // Start from genesis or deployment block
    },
    EnglishAuctionTestnet: {
      abi: "./abis/EnglishAuction.json",
      address: "0x[DEPLOYED_ADDRESS]",
      network: "domaTestnet",
      startBlock: 1,
    },
    DutchAuctionTestnet: {
      abi: "./abis/DutchAuction.json",
      address: "0x[DEPLOYED_ADDRESS]",
      network: "domaTestnet",
      startBlock: 1,
    },
    SealedBidAuctionTestnet: {
      abi: "./abis/SealedBidAuction.json",
      address: "0x[DEPLOYED_ADDRESS]",
      network: "domaTestnet",
      startBlock: 1,
    },
    FeeManagerTestnet: {
      abi: "./abis/FeeManager.json",
      address: "0x[DEPLOYED_ADDRESS]",
      network: "domaTestnet",
      startBlock: 1,
    },
    RegistrarBridgeTestnet: {
      abi: "./abis/RegistrarBridge.json",
      address: "0x[DEPLOYED_ADDRESS]",
      network: "domaTestnet",
      startBlock: 1,
    },
    */
  },
});
```

## Step 3: Define Schema (ponder.schema.ts)

```typescript
import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  // Auction Listings
  Listing: p.createTable({
    id: p.string(), // listingId as string
    seller: p.hex(),
    nft: p.hex(),
    tokenId: p.bigint(),
    paymentToken: p.hex(),
    reservePrice: p.bigint(),
    startTime: p.bigint(),
    endTime: p.bigint(),
    strategy: p.hex(),
    strategyData: p.hex(),
    eligibilityData: p.hex(),
    status: p.string(), // Listed, Live, Ended, Cancelled, Settled
    winner: p.hex().optional(),
    winningBid: p.bigint().optional(),
    createdAt: p.bigint(),
    updatedAt: p.bigint(),
  }),

  // Bids
  Bid: p.createTable({
    id: p.string(), // listingId-bidder-txHash
    listingId: p.string(),
    bidder: p.hex(),
    amount: p.bigint(),
    timestamp: p.bigint(),
    blockNumber: p.bigint(),
    transactionHash: p.hex(),
  }),

  // Auction Events
  AuctionEvent: p.createTable({
    id: p.string(), // txHash-logIndex
    listingId: p.string(),
    eventType: p.string(), // Listed, BidPlaced, AuctionStarted, AuctionEnded, etc.
    data: p.json(),
    timestamp: p.bigint(),
    blockNumber: p.bigint(),
    transactionHash: p.hex(),
  }),

  // Fee Distribution
  FeeDistribution: p.createTable({
    id: p.string(), // txHash-logIndex
    nft: p.hex(),
    tokenId: p.bigint(),
    seller: p.hex(),
    salePrice: p.bigint(),
    marketplaceFee: p.bigint(),
    protocolFee: p.bigint(),
    royaltyAmount: p.bigint(),
    royaltyRecipient: p.hex(),
    timestamp: p.bigint(),
    blockNumber: p.bigint(),
    transactionHash: p.hex(),
  }),

  // Domain Transfer Requests
  DomainTransferRequest: p.createTable({
    id: p.string(), // listingId
    listingId: p.bigint(),
    registrarRef: p.string(),
    buyer: p.hex(),
    nft: p.hex(),
    tokenId: p.bigint(),
    pending: p.boolean(),
    completed: p.boolean(),
    success: p.boolean(),
    message: p.string(),
    requestedAt: p.bigint(),
    confirmedAt: p.bigint().optional(),
  }),

  // Sealed Bid Commitments
  SealedBidCommitment: p.createTable({
    id: p.string(), // listingId-bidder
    listingId: p.string(),
    bidder: p.hex(),
    commitmentHash: p.hex(),
    deposit: p.bigint(),
    revealed: p.boolean(),
    bidAmount: p.bigint().optional(),
    timestamp: p.bigint(),
    blockNumber: p.bigint(),
  }),

  // Auction Statistics
  AuctionStats: p.createTable({
    id: p.string(), // "global" or listingId
    totalListings: p.bigint(),
    totalBids: p.bigint(),
    totalVolume: p.bigint(),
    averagePrice: p.bigint(),
    updatedAt: p.bigint(),
  }),
}));
```

## Step 4: Main Handler (src/index.ts)

```typescript
import { ponder } from "@/generated";
import "./handlers/auctionHouse";
import "./handlers/englishAuction";
import "./handlers/dutchAuction";
import "./handlers/sealedBidAuction";
import "./handlers/feeManager";
import "./handlers/registrarBridge";

// Global statistics handler
ponder.on("DomainAuctionHouse:Listed", async ({ event, context }) => {
  const { AuctionStats } = context.db;
  
  const stats = await AuctionStats.findUnique({
    id: "global"
  });

  if (stats) {
    await AuctionStats.update({
      id: "global",
      data: {
        totalListings: stats.totalListings + 1n,
        updatedAt: event.block.timestamp,
      },
    });
  } else {
    await AuctionStats.create({
      id: "global",
      data: {
        totalListings: 1n,
        totalBids: 0n,
        totalVolume: 0n,
        averagePrice: 0n,
        updatedAt: event.block.timestamp,
      },
    });
  }
});
```

## Step 5: Auction House Handler (src/handlers/auctionHouse.ts)

```typescript
import { ponder } from "@/generated";

// Handle new listings
ponder.on("DomainAuctionHouse:Listed", async ({ event, context }) => {
  const { Listing, AuctionEvent } = context.db;
  
  await Listing.create({
    id: event.args.listingId.toString(),
    data: {
      seller: event.args.seller,
      nft: event.args.nft,
      tokenId: event.args.tokenId,
      paymentToken: event.args.paymentToken,
      reservePrice: event.args.reservePrice,
      startTime: 0n,
      endTime: 0n,
      strategy: "0x0000000000000000000000000000000000000000",
      strategyData: "0x",
      eligibilityData: "0x",
      status: "Listed",
      createdAt: event.block.timestamp,
      updatedAt: event.block.timestamp,
    },
  });

  await AuctionEvent.create({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    data: {
      listingId: event.args.listingId.toString(),
      eventType: "Listed",
      data: {
        seller: event.args.seller,
        nft: event.args.nft,
        tokenId: event.args.tokenId.toString(),
        paymentToken: event.args.paymentToken,
        reservePrice: event.args.reservePrice.toString(),
      },
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    },
  });
});

// Handle auction criteria set
ponder.on("DomainAuctionHouse:CriteriaSet", async ({ event, context }) => {
  const { Listing } = context.db;
  
  await Listing.update({
    id: event.args.listingId.toString(),
    data: {
      reservePrice: event.args.reservePrice,
      eligibilityData: event.args.eligibilityData,
      updatedAt: event.block.timestamp,
    },
  });
});

// Handle strategy chosen
ponder.on("DomainAuctionHouse:StrategyChosen", async ({ event, context }) => {
  const { Listing } = context.db;
  
  await Listing.update({
    id: event.args.listingId.toString(),
    data: {
      strategy: event.args.strategy,
      strategyData: event.args.strategyData,
      updatedAt: event.block.timestamp,
    },
  });
});

// Handle auction started
ponder.on("DomainAuctionHouse:AuctionStarted", async ({ event, context }) => {
  const { Listing, AuctionEvent } = context.db;
  
  await Listing.update({
    id: event.args.listingId.toString(),
    data: {
      startTime: event.args.startTime,
      endTime: event.args.endTime,
      status: "Live",
      updatedAt: event.block.timestamp,
    },
  });

  await AuctionEvent.create({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    data: {
      listingId: event.args.listingId.toString(),
      eventType: "AuctionStarted",
      data: {
        startTime: event.args.startTime.toString(),
        endTime: event.args.endTime.toString(),
      },
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    },
  });
});

// Handle bids
ponder.on("DomainAuctionHouse:BidPlaced", async ({ event, context }) => {
  const { Bid, AuctionEvent, AuctionStats } = context.db;
  
  await Bid.create({
    id: `${event.args.listingId}-${event.args.bidder}-${event.transaction.hash}`,
    data: {
      listingId: event.args.listingId.toString(),
      bidder: event.args.bidder,
      amount: event.args.amount,
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    },
  });

  await AuctionEvent.create({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    data: {
      listingId: event.args.listingId.toString(),
      eventType: "BidPlaced",
      data: {
        bidder: event.args.bidder,
        amount: event.args.amount.toString(),
      },
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    },
  });

  // Update global stats
  const stats = await AuctionStats.findUnique({ id: "global" });
  if (stats) {
    await AuctionStats.update({
      id: "global",
      data: {
        totalBids: stats.totalBids + 1n,
        updatedAt: event.block.timestamp,
      },
    });
  }
});

// Handle auction ended
ponder.on("DomainAuctionHouse:AuctionEnded", async ({ event, context }) => {
  const { Listing, AuctionEvent } = context.db;
  
  await Listing.update({
    id: event.args.listingId.toString(),
    data: {
      winner: event.args.winner,
      winningBid: event.args.winningBid,
      status: "Ended",
      updatedAt: event.block.timestamp,
    },
  });

  await AuctionEvent.create({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    data: {
      listingId: event.args.listingId.toString(),
      eventType: "AuctionEnded",
      data: {
        winner: event.args.winner,
        winningBid: event.args.winningBid.toString(),
      },
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    },
  });
});

// Handle settlement
ponder.on("DomainAuctionHouse:Settled", async ({ event, context }) => {
  const { Listing, AuctionEvent, AuctionStats } = context.db;
  
  await Listing.update({
    id: event.args.listingId.toString(),
    data: {
      status: "Settled",
      updatedAt: event.block.timestamp,
    },
  });

  await AuctionEvent.create({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    data: {
      listingId: event.args.listingId.toString(),
      eventType: "Settled",
      data: {
        winner: event.args.winner,
        finalPrice: event.args.finalPrice.toString(),
      },
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    },
  });

  // Update volume stats
  const stats = await AuctionStats.findUnique({ id: "global" });
  if (stats) {
    const newVolume = stats.totalVolume + event.args.finalPrice;
    const newAverage = stats.totalListings > 0n ? newVolume / stats.totalListings : 0n;
    
    await AuctionStats.update({
      id: "global",
      data: {
        totalVolume: newVolume,
        averagePrice: newAverage,
        updatedAt: event.block.timestamp,
      },
    });
  }
});

// Handle cancellations
ponder.on("DomainAuctionHouse:Cancelled", async ({ event, context }) => {
  const { Listing, AuctionEvent } = context.db;
  
  await Listing.update({
    id: event.args.listingId.toString(),
    data: {
      status: "Cancelled",
      updatedAt: event.block.timestamp,
    },
  });

  await AuctionEvent.create({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    data: {
      listingId: event.args.listingId.toString(),
      eventType: "Cancelled",
      data: {
        seller: event.args.seller,
      },
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    },
  });
});
```

## Step 6: Fee Manager Handler (src/handlers/feeManager.ts)

```typescript
import { ponder } from "@/generated";

ponder.on("FeeManager:FeesDistributed", async ({ event, context }) => {
  const { FeeDistribution } = context.db;
  
  await FeeDistribution.create({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    data: {
      nft: event.args.nft,
      tokenId: event.args.tokenId,
      seller: event.args.seller,
      salePrice: event.args.salePrice,
      marketplaceFee: event.args.marketplaceFee,
      protocolFee: event.args.protocolFee,
      royaltyAmount: event.args.royaltyAmount,
      royaltyRecipient: event.args.royaltyRecipient,
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    },
  });
});
```

## Step 7: Registrar Bridge Handler (src/handlers/registrarBridge.ts)

```typescript
import { ponder } from "@/generated";

ponder.on("RegistrarBridge:DomainTransferRequested", async ({ event, context }) => {
  const { DomainTransferRequest } = context.db;
  
  await DomainTransferRequest.create({
    id: event.args.listingId.toString(),
    data: {
      listingId: event.args.listingId,
      registrarRef: event.args.registrarRef,
      buyer: event.args.buyer,
      nft: event.args.nft,
      tokenId: event.args.tokenId,
      pending: true,
      completed: false,
      success: false,
      message: "",
      requestedAt: event.block.timestamp,
    },
  });
});

ponder.on("RegistrarBridge:DomainTransferConfirmed", async ({ event, context }) => {
  const { DomainTransferRequest } = context.db;
  
  await DomainTransferRequest.update({
    id: event.args.listingId.toString(),
    data: {
      pending: false,
      completed: true,
      success: event.args.success,
      message: event.args.message,
      confirmedAt: event.block.timestamp,
    },
  });
});
```

## Step 8: Sealed Bid Handler (src/handlers/sealedBidAuction.ts)

```typescript
import { ponder } from "@/generated";

ponder.on("SealedBidAuction:CommitmentMade", async ({ event, context }) => {
  const { SealedBidCommitment } = context.db;
  
  await SealedBidCommitment.create({
    id: `${event.args.listingId}-${event.args.bidder}`,
    data: {
      listingId: event.args.listingId.toString(),
      bidder: event.args.bidder,
      commitmentHash: event.args.commitment,
      deposit: 0n, // Will be updated when revealed
      revealed: false,
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
    },
  });
});

ponder.on("SealedBidAuction:BidRevealed", async ({ event, context }) => {
  const { SealedBidCommitment } = context.db;
  
  await SealedBidCommitment.update({
    id: `${event.args.listingId}-${event.args.bidder}`,
    data: {
      revealed: true,
      bidAmount: event.args.bidAmount,
    },
  });
});
```

## Step 9: Environment Configuration

Create `.env` file:
```env
# Mainnet Ethereum
PONDER_RPC_URL_1=https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# DOMA Testnet
PONDER_RPC_URL_DOMA_TESTNET=https://testnet.doma.tech/

# Database
PONDER_DATABASE_URL=postgresql://username:password@localhost:5432/ponder_db

# Network selection (use "mainnet" or "domaTestnet")
ACTIVE_NETWORK=domaTestnet
```

## Step 10: Package.json Scripts

```json
{
  "scripts": {
    "dev": "ponder dev",
    "start": "ponder start",
    "codegen": "ponder codegen"
  }
}
```

## Step 11: Running the Indexer

1. Place contract ABIs in the `abis/` folder
2. Update the deployment block numbers in `ponder.config.ts`
3. Set up your database and RPC endpoint
4. Run the indexer:

```bash
# Development mode
npm run dev

# Production mode
npm run start
```

## Step 12: GraphQL Queries Examples

Once running, you can query your indexed data:

```graphql
# Get all active auctions
query ActiveAuctions {
  listings(where: { status: "Live" }) {
    id
    seller
    nft
    tokenId
    reservePrice
    startTime
    endTime
    strategy
  }
}

# Get auction history for a specific NFT
query AuctionHistory($nft: String!, $tokenId: String!) {
  listings(where: { nft: $nft, tokenId: $tokenId }) {
    id
    seller
    status
    winner
    winningBid
    createdAt
  }
}

# Get bids for a specific auction
query AuctionBids($listingId: String!) {
  bids(where: { listingId: $listingId }, orderBy: { amount: "desc" }) {
    bidder
    amount
    timestamp
  }
}

# Get global auction statistics
query AuctionStats {
  auctionStats(id: "global") {
    totalListings
    totalBids
    totalVolume
    averagePrice
  }
}
```

## Step 13: Integration with Frontend

Use the GraphQL endpoint to fetch data in your frontend:

```typescript
const PONDER_ENDPOINT = "http://localhost:42069"; // Default Ponder GraphQL endpoint

const fetchActiveAuctions = async () => {
  const response = await fetch(PONDER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query ActiveAuctions {
          listings(where: { status: "Live" }) {
            id
            seller
            nft
            tokenId
            reservePrice
            startTime
            endTime
          }
        }
      `
    })
  });
  
  const data = await response.json();
  return data.data.listings;
};
```

## Network-Specific Deployment Instructions

### For DOMA Testnet Development

1. **Deploy contracts to DOMA testnet** using your existing Hardhat setup:
   ```bash
   # Configure hardhat.config.ts to include DOMA testnet
   npx hardhat run scripts/deploy.js --network domaTestnet
   ```

2. **Update contract addresses** in `ponder.config.ts`:
   - Uncomment the testnet contracts section
   - Replace `[DEPLOYED_ADDRESS]` with actual deployed addresses

3. **Set environment variables** for DOMA testnet:
   ```bash
   export ACTIVE_NETWORK=domaTestnet
   export PONDER_RPC_URL_DOMA_TESTNET=https://testnet.doma.tech/
   ```

### Network Configuration for Hardhat

Add to your `hardhat.config.ts`:
```typescript
export default {
  networks: {
    domaTestnet: {
      url: "https://testnet.doma.tech/",
      chainId: 8654,
      accounts: [process.env.PRIVATE_KEY], // Your deployment private key
    },
  },
};
```

### Switching Between Networks

To switch between mainnet and testnet indexing:
1. Update `ACTIVE_NETWORK` in `.env`
2. Comment/uncomment appropriate contract sections in `ponder.config.ts`
3. Restart the indexer

### Testing on DOMA Testnet

1. **Get testnet tokens**: Use DOMA testnet faucet
2. **Deploy and test contracts**: Verify all functions work on testnet
3. **Run indexer**: Test with testnet data
4. **Frontend integration**: Point your frontend to testnet indexer endpoint

## Additional Notes

1. **Real-time Updates**: Ponder automatically provides real-time data updates through its GraphQL subscriptions
2. **Performance**: Index only from the deployment block to improve sync speed
3. **Monitoring**: Use Ponder's built-in metrics and logging for monitoring
4. **Backup**: Regularly backup your indexed data
5. **Scaling**: Consider using managed database services for production deployments
6. **Network Flexibility**: The configuration supports both Ethereum mainnet and DOMA testnet for development and testing
7. **Block Explorer**: Use https://explorer-testnet.doma.tech/ to verify transactions on DOMA testnet

This setup will provide you with comprehensive real-time auction data that your frontend can consume efficiently across both mainnet and testnet environments.