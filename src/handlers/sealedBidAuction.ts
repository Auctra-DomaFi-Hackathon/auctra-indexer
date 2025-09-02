// @ts-nocheck
import { ponder } from "ponder:registry";

ponder.on("SealedBidAuction:CommitmentMade", async ({ event, context }) => {
  const { db } = context;
  
  await db.insert("sealedBidCommitment", {
    id: `${event.args.listingId}-${event.args.bidder}`,
    listingId: event.args.listingId.toString(),
    bidder: event.args.bidder,
    commitmentHash: event.args.commitment,
    deposit: 0n,
    revealed: false,
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
  });
});

ponder.on("SealedBidAuction:BidRevealed", async ({ event, context }) => {
  const { db } = context;
  
  await db.update("sealedBidCommitment", {
    id: `${event.args.listingId}-${event.args.bidder}`,
    revealed: true,
    bidAmount: event.args.bidAmount,
  });
});