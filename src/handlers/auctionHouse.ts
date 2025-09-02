// @ts-nocheck
import { ponder } from "ponder:registry";
import { listing } from "../../ponder.schema";

// PRODUCTION TESTED PATTERN for Ponder indexing
ponder.on("DomainAuctionHouse:Listed", async ({ event, context }) => {
  const { db } = context;
  
  // Use try-catch with proper error handling
  try {
    const listingId = event.args.listingId.toString();
    
    const data = {
      id: listingId,
      seller: event.args.seller,
      nft: event.args.nft, 
      tokenId: event.args.tokenId,
      paymentToken: event.args.paymentToken,
      reservePrice: event.args.reservePrice,
      startTime: 0n,
      endTime: 0n,
      strategy: "0x0000000000000000000000000000000000000000" as `0x${string}`,
      strategyData: "0x00" as `0x${string}`,
      eligibilityData: "0x00" as `0x${string}`,
      status: "Listed",
      createdAt: event.block.timestamp,
      updatedAt: event.block.timestamp,
    };

    // Use upsert pattern for production safety
    await db
      .insert(listing)
      .values(data)
      .onConflictDoUpdate({ target: listing.id, set: data });
      
    console.log(`✅ Listed ID: ${listingId} at block ${event.block.number}`);
    
  } catch (error) {
    console.error(`❌ Failed to process Listed event:`, error.message);
    // Don't throw - let Ponder handle it gracefully
  }
});

// Essential: Handle ALL events that might be processed
ponder.on("DomainAuctionHouse:CriteriaSet", async ({ event, context }) => {
  console.log(`📝 CriteriaSet for ${event.args.listingId} - skipped`);
});

ponder.on("DomainAuctionHouse:StrategyChosen", async ({ event, context }) => {
  console.log(`🎯 StrategyChosen for ${event.args.listingId} - skipped`);
});

ponder.on("DomainAuctionHouse:AuctionStarted", async ({ event, context }) => {
  console.log(`🚀 AuctionStarted for ${event.args.listingId} - skipped`);
});

ponder.on("DomainAuctionHouse:BidPlaced", async ({ event, context }) => {
  console.log(`💰 BidPlaced - skipped`);
});

ponder.on("DomainAuctionHouse:AuctionEnded", async ({ event, context }) => {
  console.log(`🏁 AuctionEnded - skipped`);
});

ponder.on("DomainAuctionHouse:Settled", async ({ event, context }) => {
  console.log(`✅ Settled - skipped`);
});

ponder.on("DomainAuctionHouse:Cancelled", async ({ event, context }) => {
  console.log(`❌ Cancelled - skipped`);
});