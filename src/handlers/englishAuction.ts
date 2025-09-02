// @ts-nocheck
import { ponder } from "ponder:registry";

ponder.on("EnglishAuction:BidPlaced", async ({ event, context }) => {
  const { db } = context;
  
  // Create bid record
  await db.insert("bid", {
    id: `${event.args.listingId}-${event.args.bidder}-${event.transaction.hash}`,
    listingId: event.args.listingId.toString(),
    bidder: event.args.bidder,
    amount: event.args.amount,
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  });

  // Create auction event record
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

  // Record english auction bid stats
  await db.insert("auctionStats", {
    id: `english-bid-${event.transaction.hash}`,
    totalListings: 0n,
    totalBids: 1n,
    totalVolume: 0n,
    averagePrice: 0n,
    updatedAt: event.block.timestamp,
  });
});

ponder.on("EnglishAuction:AuctionExtended", async ({ event, context }) => {
  const { db } = context;
  
  // Update listing with new end time
  await db.update("listing", {
    id: event.args.listingId.toString(),
    endTime: event.args.newEndTime,
    updatedAt: event.block.timestamp,
  });

  // Create auction event record
  await db.insert("auctionEvent", {
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    listingId: event.args.listingId.toString(),
    eventType: "AuctionExtended",
    data: {
      newEndTime: event.args.newEndTime.toString(),
    },
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  });
});