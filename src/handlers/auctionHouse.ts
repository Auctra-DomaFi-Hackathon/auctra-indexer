// @ts-nocheck
import { ponder } from "ponder:registry";
// import { listing } from "../../ponder.schema";
import { listing, bid } from "ponder:schema";
import { eq, desc } from "drizzle-orm";
// PRODUCTION TESTED PATTERN for Ponder indexing
// ponder.on("DomainAuctionHouse:Listed", async ({ event, context }) => {
//   const { db } = context;
//   try {
//     const listingId = event.args.listingId.toString();

//     const data = {
//       id: listingId,
//       seller: event.args.seller,
//       nft: event.args.nft,
//       tokenId: event.args.tokenId,
//       paymentToken: event.args.paymentToken,
//       reservePrice: event.args.reservePrice,
//       startTime: 0n,
//       endTime: 0n,
//       // strategy: "0x947e70b9362eeCA8a3994F839Ebcc2C1c7d63C5d" as `0x${string}`,
//       // strategyData: "0x00" as `0x${string}`,
//       eligibilityData: "0x00" as `0x${string}`,
//       status: "Listed",
//       createdAt: event.block.timestamp,
//       updatedAt: event.block.timestamp,
//     };

//     const strategyPatch = event.args.strategy
//       ? {
//           strategy: event.args.strategy as `0x${string}`,
//           strategyData: (event.args.strategyData ?? "0x") as `0x${string}`,
//         }
//       : {};

//     await db
//       .insert(listing)
//       .values({ ...data, ...strategyPatch }) // ← merge jadi satu object
//       .onConflictDoUpdate({
//         target: listing.id,
//         set: {
//           seller: data.seller,
//           nft: data.nft,
//           tokenId: data.tokenId,
//           paymentToken: data.paymentToken,
//           reservePrice: data.reservePrice,
//           startTime: 0n,
//           endTime: 0n,
//           eligibilityData: "0x00",
//           status: "Listed",
//           updatedAt: event.block.timestamp,
//           // hanya update strategy kalau Listed memang bawa
//           ...(event.args.strategy
//             ? {
//                 strategy: event.args.strategy as `0x${string}`,
//                 strategyData: (event.args.strategyData ??
//                   "0x") as `0x${string}`,
//               }
//             : {}),
//         },
//       });

//     console.log(`✅ Listed ID: ${listingId} at block ${event.block.number}`);
//   } catch (error) {
//     console.error(`❌ Failed to process Listed event:`, error.message);
//     // Don't throw - let Ponder handle it gracefully
//   }
// });

ponder.on("DomainAuctionHouse:Listed", async ({ event, context }) => {
  const { db } = context;
  const id = event.args.listingId.toString();

  const base = {
    id,
    seller: event.args.seller,
    nft: event.args.nft,
    tokenId: event.args.tokenId,
    paymentToken: event.args.paymentToken,
    reservePrice: event.args.reservePrice,
    startTime: 0n,
    endTime: 0n,
    strategy: null as `0x${string}` | null,
    strategyData: null as `0x${string}` | null,
    eligibilityData: "0x00" as `0x${string}`,
    status: "Listed",
    createdAt: event.block.timestamp,
    updatedAt: event.block.timestamp,
  };

  const hasStrategy =
    (event.args as any).strategy &&
    (event.args as any).strategy !== "0x0000000000000000000000000000000000000000" &&
    (event.args as any).strategyData;

  const patch = hasStrategy
    ? {
        strategy: (event.args as any).strategy as `0x${string}`,
        strategyData: (event.args as any).strategyData as `0x${string}`,
      }
    : {};

  await db
    .insert(listing)
    .values({ ...base, ...patch })
    .onConflictDoUpdate({
      target: listing.id,
      set: {
        seller: base.seller,
        nft: base.nft,
        tokenId: base.tokenId,
        paymentToken: base.paymentToken,
        reservePrice: base.reservePrice,
        startTime: base.startTime,
        endTime: base.endTime,
        eligibilityData: base.eligibilityData,
        status: base.status,
        updatedAt: base.updatedAt,
        ...(hasStrategy ? patch : {}),
      },
    });

  console.log(`✅ Listed ${id}`);
});



// Essential: Handle ALL events that might be processed
ponder.on("DomainAuctionHouse:CriteriaSet", async ({ event, context }) => {
  console.log(`📝 CriteriaSet for ${event.args.listingId} - skipped`);
});

// ponder.on("DomainAuctionHouse:StrategyChosen", async ({ event, context }) => {
//   const { db } = context;

//   try {
//     const listingId = event.args.listingId.toString();
//     console.log(`🎯 Processing StrategyChosen for listing ${listingId}: ${event.args.strategy}`);

//     // Only update strategy fields without providing dummy data for other fields
//     await db
//       .insert(listing)
//       .values({
//         id: listingId,
//         // Only provide the minimal required fields for insert (will be ignored due to conflict)
//         seller: "0x0000000000000000000000000000000000000000" as `0x${string}`,
//         nft: "0x0000000000000000000000000000000000000000" as `0x${string}`,
//         tokenId: 0n,
//         paymentToken: "0x0000000000000000000000000000000000000000" as `0x${string}`,
//         reservePrice: 0n,
//         startTime: 0n,
//         endTime: 0n,
//         strategy: event.args.strategy,
//         strategyData: event.args.strategyData || "0x00" as `0x${string}`,
//         eligibilityData: "0x00" as `0x${string}`,
//         status: "Listed",
//         createdAt: event.block.timestamp,
//         updatedAt: event.block.timestamp,
//       })
//       .onConflictDoUpdate({
//         target: listing.id,
//         set: {
//           strategy: event.args.strategy,
//           strategyData: event.args.strategyData || "0x00" as `0x${string}`,
//           updatedAt: event.block.timestamp,
//         }
//       });

//     console.log(`✅ StrategyChosen updated successfully for listing ${listingId}: ${event.args.strategy}`);

//   } catch (error) {
//     console.error(`❌ Failed to process StrategyChosen event for listing ${event.args.listingId}:`, error);
//   }
// });

ponder.on("DomainAuctionHouse:StrategyChosen", async ({ event, context }) => {
  const { db } = context;
  const id = event.args.listingId.toString();

  // Normalisasi bytes -> hex string
  const toHex = (x: any): `0x${string}` =>
    typeof x === "string" && x.startsWith("0x")
      ? (x as `0x${string}`)
      : (`0x${Buffer.from(x).toString("hex")}` as `0x${string}`);

  const newStrategy = event.args.strategy as `0x${string}`;
  const newData = toHex(event.args.strategyData ?? "0x");

  console.log("🔎 StrategyChosen args:", {
    listingId: id,
    strategy: newStrategy,
    strategyDataLen: newData.length,
  });

  // ⬇️ Ponder typed update: filter via argumen ke-2, TANPA .where()
  await db
    .update(listing, { id })
    .set({
      strategy: newStrategy,
      strategyData: newData,
      updatedAt: event.block.timestamp,
    });

  console.log(`🎯 StrategyChosen applied for ${id}`);
});


ponder.on("DomainAuctionHouse:AuctionStarted", async ({ event, context }) => {
  console.log(`🚀 AuctionStarted for ${event.args.listingId} - skipped`);
});

ponder.on("DomainAuctionHouse:BidPlaced", async ({ event, context }) => {
  const { db } = context;
  const listingId = event.args.listingId.toString();
  const bidId = `${event.transaction.hash}-${event.log.logIndex}`;
  
  console.log(`💰 BidPlaced for listing ${listingId}, bidder: ${event.args.bidder}, amount: ${event.args.amount}`);

  try {
    // Get listing info untuk mendapatkan nft dan tokenId
    const listingData = await db.find(listing, { id: listingId });
    
    if (!listingData) {
      console.error(`❌ Listing ${listingId} not found for bid ${bidId}`);
      return;
    }

    await db.insert(bid).values({
      id: bidId,
      listingId: listingId,
      bidder: event.args.bidder,
      amount: event.args.amount,
      nft: listingData.nft,
      tokenId: listingData.tokenId,
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });

    console.log(`✅ Bid recorded: ${bidId} for token ${listingData.tokenId}`);
  } catch (error) {
    console.error(`❌ Error processing bid ${bidId}:`, error);
  }
});

ponder.on("DomainAuctionHouse:AuctionEnded", async ({ event, context }) => {
  const { db } = context;
  const id = event.args.listingId.toString();

  console.log(`🏁 AuctionEnded for listing ${id}`);

  await db
    .update(listing, { id })
    .set({
      status: "Ended",
      updatedAt: event.block.timestamp,
    });

  console.log(`✅ AuctionEnded status updated for ${id}`);
});

ponder.on("DomainAuctionHouse:Settled", async ({ event, context }) => {
  const { db } = context;
  const id = event.args.listingId.toString();

  console.log(`✅ Settled for listing ${id}, winner: ${event.args.winner}, finalPrice: ${event.args.finalPrice}`);

  await db
    .update(listing, { id })
    .set({
      status: "Ended",
      winner: event.args.winner,
      winningBid: event.args.finalPrice,
      updatedAt: event.block.timestamp,
    });

  console.log(`✅ Settled status updated for ${id}`);
});

ponder.on("DomainAuctionHouse:Cancelled", async ({ event, context }) => {
  const { db } = context;
  const id = event.args.listingId.toString();

  console.log(`❌ Cancelled for listing ${id}`);

  await db
    .update(listing, { id })
    .set({
      status: "Cancelled",
      updatedAt: event.block.timestamp,
    });

  console.log(`✅ Cancelled status updated for ${id}`);
});
