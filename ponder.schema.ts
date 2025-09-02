import { onchainTable } from "ponder";

export const listing = onchainTable("listing", (t) => ({
  id: t.text().primaryKey(),
  seller: t.hex().notNull(),
  nft: t.hex().notNull(),
  tokenId: t.bigint().notNull(),
  paymentToken: t.hex().notNull(),
  reservePrice: t.bigint().notNull(),
  startTime: t.bigint().notNull(),
  endTime: t.bigint().notNull(),
  // strategy: t.hex().notNull(),
  strategy: t.hex(),
  // strategyData: t.hex().notNull(),
  strategyData: t.hex(),
  eligibilityData: t.hex(),
  status: t.text().notNull(),
  winner: t.hex(),
  winningBid: t.bigint(),
  createdAt: t.bigint().notNull(),
  updatedAt: t.bigint().notNull(),
}));

export const bid = onchainTable("bid", (t) => ({
  id: t.text().primaryKey(),
  listingId: t.text().notNull(),
  bidder: t.hex().notNull(),
  amount: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

export const auctionEvent = onchainTable("auction_event", (t) => ({
  id: t.text().primaryKey(),
  listingId: t.text().notNull(),
  eventType: t.text().notNull(),
  data: t.json().notNull(),
  timestamp: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

export const feeDistribution = onchainTable("fee_distribution", (t) => ({
  id: t.text().primaryKey(),
  nft: t.hex().notNull(),
  tokenId: t.bigint().notNull(),
  seller: t.hex().notNull(),
  salePrice: t.bigint().notNull(),
  marketplaceFee: t.bigint().notNull(),
  protocolFee: t.bigint().notNull(),
  royaltyAmount: t.bigint().notNull(),
  royaltyRecipient: t.hex().notNull(),
  timestamp: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

export const domainTransferRequest = onchainTable("domain_transfer_request", (t) => ({
  id: t.text().primaryKey(),
  listingId: t.bigint().notNull(),
  registrarRef: t.text().notNull(),
  buyer: t.hex().notNull(),
  nft: t.hex().notNull(),
  tokenId: t.bigint().notNull(),
  pending: t.boolean().notNull(),
  completed: t.boolean().notNull(),
  success: t.boolean().notNull(),
  message: t.text().notNull(),
  requestedAt: t.bigint().notNull(),
  confirmedAt: t.bigint(),
}));

export const sealedBidCommitment = onchainTable("sealed_bid_commitment", (t) => ({
  id: t.text().primaryKey(),
  listingId: t.text().notNull(),
  bidder: t.hex().notNull(),
  commitmentHash: t.hex().notNull(),
  deposit: t.bigint().notNull(),
  revealed: t.boolean().notNull(),
  bidAmount: t.bigint(),
  timestamp: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
}));

export const auctionStats = onchainTable("auction_stats", (t) => ({
  id: t.text().primaryKey(),
  totalListings: t.bigint().notNull(),
  totalBids: t.bigint().notNull(),
  totalVolume: t.bigint().notNull(),
  averagePrice: t.bigint().notNull(),
  updatedAt: t.bigint().notNull(),
}));