// @ts-nocheck
import { ponder } from "ponder:registry";
import { listing, bid, auctionEvent, auctionStats } from "../../ponder.schema";

ponder.on("DutchAuction:AuctionSold", async ({ event, context }) => {
  const { db } = context;
  
  // Update listing as sold
  await db.update(listing, {
    id: event.args.listingId.toString(),
    winner: event.args.winner,
    winningBid: event.args.price,
    status: "Sold",
    updatedAt: event.block.timestamp,
  });

  // Create auction event record
  await db.insert(auctionEvent, {
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    listingId: event.args.listingId.toString(),
    eventType: "AuctionSold",
    data: {
      winner: event.args.winner,
      price: event.args.price.toString(),
    },
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  });

  // Record dutch auction sale stats
  await db.insert(auctionStats, {
    id: `dutch-${event.transaction.hash}`,
    totalListings: 0n,
    totalBids: 0n,
    totalVolume: event.args.price,
    averagePrice: event.args.price,
    updatedAt: event.block.timestamp,
  });
});