// @ts-nocheck
import { ponder } from "ponder:registry";

ponder.on("FeeManager:FeesDistributed", async ({ event, context }) => {
  const { db } = context;
  
  await db.insert("feeDistribution", {
    id: `${event.transaction.hash}-${event.log.logIndex}`,
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
  });
});