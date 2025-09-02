// @ts-nocheck
import { ponder } from "ponder:registry";

ponder.on("DomainAuctionHouse:Listed", async ({ event, context }) => {
  const { db } = context;
  
  await db.insert("listing", {
    id: event.args.listingId.toString(),
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
  });

  await db.insert("auctionEvent", {
    id: `${event.transaction.hash}-${event.log.logIndex}`,
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
  });

  // Create or update global statistics
  await db.insert("auctionStats", {
    id: `stats-${event.transaction.hash}`,
    totalListings: 1n,
    totalBids: 0n,
    totalVolume: 0n,
    averagePrice: 0n,
    updatedAt: event.block.timestamp,
  });
});

ponder.on("DomainAuctionHouse:CriteriaSet", async ({ event, context }) => {
  const { db } = context;
  
  await db.update("listing", {
    id: event.args.listingId.toString(),
    reservePrice: event.args.reservePrice,
    eligibilityData: event.args.eligibilityData,
    updatedAt: event.block.timestamp,
  });
});

ponder.on("DomainAuctionHouse:StrategyChosen", async ({ event, context }) => {
  const { db } = context;
  
  await db.update("listing", {
    id: event.args.listingId.toString(),
    strategy: event.args.strategy,
    strategyData: event.args.strategyData,
    updatedAt: event.block.timestamp,
  });
});

ponder.on("DomainAuctionHouse:AuctionStarted", async ({ event, context }) => {
  const { db } = context;
  
  await db.update("listing", {
    id: event.args.listingId.toString(),
    startTime: event.args.startTime,
    endTime: event.args.endTime,
    status: "Live",
    updatedAt: event.block.timestamp,
  });

  await db.insert("auctionEvent", {
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    listingId: event.args.listingId.toString(),
    eventType: "AuctionStarted",
    data: {
      startTime: event.args.startTime.toString(),
      endTime: event.args.endTime.toString(),
    },
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  });
});

ponder.on("DomainAuctionHouse:BidPlaced", async ({ event, context }) => {
  const { db } = context;
  
  await db.insert("bid", {
    id: `${event.args.listingId}-${event.args.bidder}-${event.transaction.hash}`,
    listingId: event.args.listingId.toString(),
    bidder: event.args.bidder,
    amount: event.args.amount,
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  });

  await db.insert("auctionEvent", {
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    listingId: event.args.listingId.toString(),
    eventType: "BidPlaced",
    data: {
      bidder: event.args.bidder,
      amount: event.args.amount.toString(),
    },
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  });

  // Record bid stats
  await db.insert("auctionStats", {
    id: `bid-${event.transaction.hash}`,
    totalListings: 0n,
    totalBids: 1n,
    totalVolume: 0n,
    averagePrice: 0n,
    updatedAt: event.block.timestamp,
  });
});

ponder.on("DomainAuctionHouse:AuctionEnded", async ({ event, context }) => {
  const { db } = context;
  
  await db.update("listing", {
    id: event.args.listingId.toString(),
    winner: event.args.winner,
    winningBid: event.args.winningBid,
    status: "Ended",
    updatedAt: event.block.timestamp,
  });

  await db.insert("auctionEvent", {
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    listingId: event.args.listingId.toString(),
    eventType: "AuctionEnded",
    data: {
      winner: event.args.winner,
      winningBid: event.args.winningBid.toString(),
    },
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  });
});

ponder.on("DomainAuctionHouse:Settled", async ({ event, context }) => {
  const { db } = context;
  
  await db.update("listing", {
    id: event.args.listingId.toString(),
    status: "Settled",
    updatedAt: event.block.timestamp,
  });

  await db.insert("auctionEvent", {
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    listingId: event.args.listingId.toString(),
    eventType: "Settled",
    data: {
      winner: event.args.winner,
      finalPrice: event.args.finalPrice.toString(),
    },
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  });

  // Record settled stats
  await db.insert("auctionStats", {
    id: `settled-${event.transaction.hash}`,
    totalListings: 0n,
    totalBids: 0n,
    totalVolume: event.args.finalPrice,
    averagePrice: event.args.finalPrice,
    updatedAt: event.block.timestamp,
  });
});

ponder.on("DomainAuctionHouse:Cancelled", async ({ event, context }) => {
  const { db } = context;
  
  await db.update("listing", {
    id: event.args.listingId.toString(),
    status: "Cancelled",
    updatedAt: event.block.timestamp,
  });

  await db.insert("auctionEvent", {
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    listingId: event.args.listingId.toString(),
    eventType: "Cancelled",
    data: {
      seller: event.args.seller,
    },
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  });
});