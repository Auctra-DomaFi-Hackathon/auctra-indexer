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

// === LENDING POOL TABLES ===

export const liquidityProvider = onchainTable("liquidity_provider", (t) => ({
  id: t.text().primaryKey(), // lp-address-poolAddress
  lpAddress: t.hex().notNull(),
  poolAddress: t.hex().notNull(),
  totalDeposited: t.bigint().notNull(), // Lifetime deposits
  totalWithdrawn: t.bigint().notNull(), // Lifetime withdrawals
  currentShares: t.bigint().notNull(),  // Current LP shares
  currentAssetValue: t.bigint().notNull(), // Current asset value of shares
  firstDepositAt: t.bigint().notNull(),
  lastActionAt: t.bigint().notNull(),
}));

export const supplyTransaction = onchainTable("supply_transaction", (t) => ({
  id: t.text().primaryKey(), // txHash-logIndex
  lpAddress: t.hex().notNull(),
  poolAddress: t.hex().notNull(),
  type: t.text().notNull(), // "deposit" or "withdraw"
  amount: t.bigint().notNull(), // USDC amount
  shares: t.bigint().notNull(), // LP shares involved
  exchangeRate: t.bigint().notNull(), // Exchange rate at time of transaction (1e18 precision)
  timestamp: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

export const borrower = onchainTable("borrower", (t) => ({
  id: t.text().primaryKey(), // borrower-address-poolAddress
  borrowerAddress: t.hex().notNull(),
  poolAddress: t.hex().notNull(),
  totalBorrowed: t.bigint().notNull(), // Lifetime borrows
  totalRepaid: t.bigint().notNull(),   // Lifetime repayments
  currentDebt: t.bigint().notNull(),   // Current outstanding debt
  currentHealthFactor: t.bigint().notNull(), // Current health factor (1e18 precision)
  hasActiveCollateral: t.boolean().notNull(),
  collateralNft: t.hex(),
  collateralTokenId: t.bigint(),
  collateralValue: t.bigint(),
  firstBorrowAt: t.bigint(),
  lastActionAt: t.bigint().notNull(),
  liquidationCount: t.integer().notNull(),
}));

export const borrowTransaction = onchainTable("borrow_transaction", (t) => ({
  id: t.text().primaryKey(), // txHash-logIndex
  borrowerAddress: t.hex().notNull(),
  poolAddress: t.hex().notNull(),
  type: t.text().notNull(), // "borrow" or "repay"
  amount: t.bigint().notNull(), // USDC amount
  newTotalDebt: t.bigint().notNull(), // Updated total debt
  healthFactor: t.bigint().notNull(), // Health factor after transaction (1e18 precision)
  apr: t.bigint().notNull(), // APR at time of transaction (basis points)
  timestamp: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

export const collateralTransaction = onchainTable("collateral_transaction", (t) => ({
  id: t.text().primaryKey(), // txHash-logIndex
  borrowerAddress: t.hex().notNull(),
  poolAddress: t.hex().notNull(),
  type: t.text().notNull(), // "deposit" or "withdraw" or "liquidated" or "value_refresh"
  nft: t.hex().notNull(),
  tokenId: t.bigint().notNull(),
  valueUsd6: t.bigint().notNull(), // Domain value in USD (6 decimals)
  timestamp: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

export const liquidationEvent = onchainTable("liquidation_event", (t) => ({
  id: t.text().primaryKey(), // txHash-logIndex
  borrowerAddress: t.hex().notNull(),
  liquidatorAddress: t.hex().notNull(),
  poolAddress: t.hex().notNull(),
  nft: t.hex().notNull(),
  tokenId: t.bigint().notNull(),
  repayAmount: t.bigint().notNull(), // Amount liquidator paid
  collateralValue: t.bigint().notNull(), // Value of seized collateral
  profit: t.bigint().notNull(), // Liquidator profit (collateralValue - repayAmount)
  timestamp: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

export const poolMetrics = onchainTable("pool_metrics", (t) => ({
  id: t.text().primaryKey(), // poolAddress-timestamp or "latest-poolAddress"
  poolAddress: t.hex().notNull(),
  totalAssets: t.bigint().notNull(),     // Total pool assets
  totalShares: t.bigint().notNull(),     // Total LP shares
  totalDebt: t.bigint().notNull(),      // Total outstanding debt
  exchangeRate: t.bigint().notNull(),   // Current exchange rate (1e18)
  utilization: t.bigint().notNull(),    // Utilization rate (1e18)
  currentAPR: t.bigint().notNull(),     // Current borrow APR (basis points)
  totalLiquidityProviders: t.integer().notNull(),
  totalBorrowers: t.integer().notNull(),
  timestamp: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
}));

export const interestRateSnapshot = onchainTable("interest_rate_snapshot", (t) => ({
  id: t.text().primaryKey(), // poolAddress-blockNumber
  poolAddress: t.hex().notNull(),
  apr: t.bigint().notNull(), // APR in basis points
  utilization: t.bigint().notNull(), // Utilization at time of snapshot (1e18)
  timestamp: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
}));

// === DOMAIN RENTAL VAULT TABLES ===

// Domain Rental Listings
export const rentalListing = onchainTable("rental_listing", (t) => ({
  id: t.text().primaryKey(), // listingId as string
  owner: t.hex().notNull(),
  nft: t.hex().notNull(),
  tokenId: t.bigint().notNull(),
  paymentToken: t.hex().notNull(),
  pricePerDay: t.bigint().notNull(),
  securityDeposit: t.bigint().notNull(),
  minDays: t.integer().notNull(),
  maxDays: t.integer().notNull(),
  paused: t.boolean().notNull(),
  active: t.boolean().notNull(),
  createdAt: t.bigint().notNull(),
  updatedAt: t.bigint().notNull(),
}));

// Rental Transactions (Active Rentals)
export const rental = onchainTable("rental", (t) => ({
  id: t.text().primaryKey(), // listingId as string
  listingId: t.text().notNull(),
  user: t.hex().notNull(), // renter address
  owner: t.hex().notNull(), // domain owner
  nft: t.hex().notNull(),
  tokenId: t.bigint().notNull(),
  days: t.integer().notNull(),
  totalPaid: t.bigint().notNull(),
  deposit: t.bigint().notNull(),
  expires: t.bigint().notNull(),
  active: t.boolean().notNull(),
  startedAt: t.bigint().notNull(),
  endedAt: t.bigint(),
}));

// Rental History (All rental events)
export const rentalHistory = onchainTable("rental_history", (t) => ({
  id: t.text().primaryKey(), // txHash-logIndex
  listingId: t.text().notNull(),
  eventType: t.text().notNull(), // Listed, Rented, Extended, Ended, etc.
  user: t.hex().notNull(),
  owner: t.hex().notNull(),
  nft: t.hex().notNull(),
  tokenId: t.bigint().notNull(),
  data: t.json().notNull(),
  timestamp: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
}));

// User Rental Profile (Aggregated data per user)
export const userRentalProfile = onchainTable("user_rental_profile", (t) => ({
  id: t.hex().primaryKey(), // user address
  totalRentals: t.bigint().notNull(),
  totalSpent: t.bigint().notNull(),
  totalDeposits: t.bigint().notNull(),
  activeRentals: t.bigint().notNull(),
  expiredRentals: t.bigint().notNull(),
  createdAt: t.bigint().notNull(),
  updatedAt: t.bigint().notNull(),
}));

// Owner Rental Profile (Aggregated data per domain owner)
export const ownerRentalProfile = onchainTable("owner_rental_profile", (t) => ({
  id: t.hex().primaryKey(), // owner address
  totalListings: t.bigint().notNull(),
  totalRentals: t.bigint().notNull(),
  totalEarned: t.bigint().notNull(),
  activeListings: t.bigint().notNull(),
  createdAt: t.bigint().notNull(),
  updatedAt: t.bigint().notNull(),
}));

// Deposit Tracking
export const depositRecord = onchainTable("deposit_record", (t) => ({
  id: t.text().primaryKey(), // listingId
  listingId: t.text().notNull(),
  user: t.hex().notNull(),
  amount: t.bigint().notNull(),
  paymentToken: t.hex().notNull(),
  locked: t.boolean().notNull(),
  claimed: t.boolean().notNull(),
  lockedAt: t.bigint().notNull(),
  claimedAt: t.bigint(),
  claimedBy: t.hex(),
}));