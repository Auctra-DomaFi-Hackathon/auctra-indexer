# Important Queries for Auctra Indexer Frontend

This document contains essential GraphQL queries for interacting with the Auctra auction indexer data. These queries are designed to support common frontend use cases for the auction platform.

## Table of Contents
1. [Listing Queries](#listing-queries)
2. [Bid Queries](#bid-queries)
3. [Auction Event Queries](#auction-event-queries)
4. [Statistics Queries](#statistics-queries)
5. [Fee Distribution Queries](#fee-distribution-queries)
6. [Domain Transfer Queries](#domain-transfer-queries)
7. [Sealed Bid Queries](#sealed-bid-queries)
8. [Domain Rental Vault Queries](#domain-rental-vault-queries)
9. [Domain Lending Pool Queries](#domain-lending-pool-queries)

---

## Listing Queries

### Get All Active Listings
```graphql
query GetActiveListings($limit: Int = 10) {
  listings(
    limit: $limit
    where: { status: "Live" }
    orderBy: "createdAt"
    orderDirection: "desc"
  ) {
    items {
      id
      seller
      nft
      tokenId
      paymentToken
      reservePrice
      startTime
      endTime
      strategy
      status
      createdAt
      updatedAt
      winner
      winningBid
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

### Get Listings by Seller
```graphql
query GetListingsBySeller($seller: String!, $limit: Int = 10) {
  listings(
    limit: $limit
    where: { seller: $seller }
    orderBy: "createdAt"
    orderDirection: "desc"
  ) {
    id
    seller
    nft
    tokenId
    reservePrice
    status
    createdAt
    winner
    winningBid
  }
}
```

### Get Single Listing Details
```graphql
query GetListingDetails($listingId: String!) {
  listing(id: $listingId) {
    id
    seller
    nft
    tokenId
    paymentToken
    reservePrice
    startTime
    endTime
    strategy
    strategyData
    eligibilityData
    status
    winner
    winningBid
    createdAt
    updatedAt
  }
}
```

### Get Listings by Status
```graphql
query GetListingsByStatus($status: String!, $limit: Int = 20) {
  listings(
    limit: $limit
    where: { status: $status }
    orderBy: "updatedAt"
    orderDirection: "desc"
  ) {
    id
    seller
    nft
    tokenId
    reservePrice
    status
    updatedAt
    winner
    winningBid
  }
}
```

---

## Bid Queries

### Get Bids for a Listing
```graphql
query GetBidsForListing($listingId: String!, $limit: Int = 50) {
  bids(
    limit: $limit
    where: { listingId: $listingId }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    listingId
    bidder
    amount
    timestamp
    blockNumber
    transactionHash
  }
}
```

### Get User's Bid History
```graphql
query GetUserBidHistory($bidder: String!, $limit: Int = 20) {
  bids(
    limit: $limit
    where: { bidder: $bidder }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    listingId
    bidder
    amount
    timestamp
    blockNumber
    transactionHash
  }
}
```

### Get Recent Bids
```graphql
query GetRecentBids($limit: Int = 10) {
  bids(
    limit: $limit
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    listingId
    bidder
    amount
    timestamp
    transactionHash
  }
}
```

---

## Auction Event Queries

### Get Events for a Listing
```graphql
query GetListingEvents($listingId: String!, $limit: Int = 50) {
  auctionEvents(
    limit: $limit
    where: { listingId: $listingId }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    listingId
    eventType
    data
    timestamp
    blockNumber
    transactionHash
  }
}
```

### Get Recent Auction Activity
```graphql
query GetRecentAuctionActivity($limit: Int = 20) {
  auctionEvents(
    limit: $limit
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    listingId
    eventType
    data
    timestamp
    transactionHash
  }
}
```

### Get Events by Type
```graphql
query GetEventsByType($eventType: String!, $limit: Int = 20) {
  auctionEvents(
    limit: $limit
    where: { eventType: $eventType }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    listingId
    eventType
    data
    timestamp
    transactionHash
  }
}
```

---

## Statistics Queries

### Get Auction Statistics Overview
```graphql
query GetAuctionStats($limit: Int = 100) {
  auctionStats(
    limit: $limit
    orderBy: "updatedAt"
    orderDirection: "desc"
  ) {
    id
    totalListings
    totalBids
    totalVolume
    averagePrice
    updatedAt
  }
}
```

### Get Recent Statistics
```graphql
query GetRecentStats($limit: Int = 10) {
  auctionStats(
    limit: $limit
    orderBy: "updatedAt"
    orderDirection: "desc"
  ) {
    id
    totalListings
    totalBids
    totalVolume
    averagePrice
    updatedAt
  }
}
```

---

## Fee Distribution Queries

### Get Fee Distributions
```graphql
query GetFeeDistributions($limit: Int = 20) {
  feeDistributions(
    limit: $limit
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    nft
    tokenId
    seller
    salePrice
    marketplaceFee
    protocolFee
    royaltyAmount
    royaltyRecipient
    timestamp
    transactionHash
  }
}
```

### Get Fee Distribution by NFT
```graphql
query GetFeeDistributionByNFT($nft: String!, $tokenId: String!) {
  feeDistributions(
    where: { nft: $nft, tokenId: $tokenId }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    seller
    salePrice
    marketplaceFee
    protocolFee
    royaltyAmount
    royaltyRecipient
    timestamp
    transactionHash
  }
}
```

---

## Domain Transfer Queries

### Get Domain Transfer Requests
```graphql
query GetDomainTransferRequests($limit: Int = 20) {
  domainTransferRequests(
    limit: $limit
    orderBy: "requestedAt"
    orderDirection: "desc"
  ) {
    id
    listingId
    registrarRef
    buyer
    nft
    tokenId
    pending
    completed
    success
    message
    requestedAt
    confirmedAt
  }
}
```

### Get Pending Domain Transfers
```graphql
query GetPendingDomainTransfers {
  domainTransferRequests(
    where: { pending: true, completed: false }
    orderBy: "requestedAt"
    orderDirection: "desc"
  ) {
    id
    listingId
    buyer
    nft
    tokenId
    requestedAt
  }
}
```

### Get Domain Transfer by Listing
```graphql
query GetDomainTransferByListing($listingId: String!) {
  domainTransferRequest(id: $listingId) {
    id
    listingId
    registrarRef
    buyer
    nft
    tokenId
    pending
    completed
    success
    message
    requestedAt
    confirmedAt
  }
}
```

---

## Sealed Bid Queries

### Get Sealed Bid Commitments for Listing
```graphql
query GetSealedBidCommitments($listingId: String!) {
  sealedBidCommitments(
    where: { listingId: $listingId }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    listingId
    bidder
    commitmentHash
    deposit
    revealed
    bidAmount
    timestamp
    blockNumber
  }
}
```

### Get User's Sealed Bid Commitments
```graphql
query GetUserSealedBids($bidder: String!) {
  sealedBidCommitments(
    where: { bidder: $bidder }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    listingId
    bidder
    commitmentHash
    revealed
    bidAmount
    timestamp
  }
}
```

### Get Unrevealed Commitments
```graphql
query GetUnrevealedCommitments($limit: Int = 50) {
  sealedBidCommitments(
    limit: $limit
    where: { revealed: false }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    listingId
    bidder
    commitmentHash
    timestamp
  }
}
```

---

## Domain Rental Vault Queries

### Get All Active Rental Listings
```graphql
query GetActiveRentalListings($limit: Int = 20) {
  rentalListings(
    limit: $limit
    where: { active: true, paused: false }
    orderBy: "createdAt"
    orderDirection: "desc"
  ) {
    id
    owner
    nft
    tokenId
    paymentToken
    pricePerDay
    securityDeposit
    minDays
    maxDays
    paused
    active
    createdAt
    updatedAt
  }
}
```

### Get Rental Listings by Owner
```graphql
query GetRentalListingsByOwner($owner: String!, $limit: Int = 10) {
  rentalListings(
    limit: $limit
    where: { owner: $owner }
    orderBy: "createdAt"
    orderDirection: "desc"
  ) {
    id
    owner
    nft
    tokenId
    paymentToken
    pricePerDay
    securityDeposit
    minDays
    maxDays
    active
    paused
    createdAt
  }
}
```

### Get Single Rental Listing Details
```graphql
query GetRentalListingDetails($listingId: String!) {
  rentalListing(id: $listingId) {
    id
    owner
    nft
    tokenId
    paymentToken
    pricePerDay
    securityDeposit
    minDays
    maxDays
    paused
    active
    createdAt
    updatedAt
  }
}
```

### Get Active Rentals
```graphql
query GetActiveRentals($limit: Int = 20) {
  rentals(
    limit: $limit
    where: { active: true }
    orderBy: "startedAt"
    orderDirection: "desc"
  ) {
    id
    listingId
    user
    owner
    nft
    tokenId
    days
    totalPaid
    deposit
    expires
    active
    startedAt
    endedAt
  }
}
```

### Get User's Active Rentals
```graphql
query GetUserActiveRentals($user: String!, $limit: Int = 10) {
  rentals(
    limit: $limit
    where: { user: $user, active: true }
    orderBy: "startedAt"
    orderDirection: "desc"
  ) {
    id
    listingId
    user
    owner
    nft
    tokenId
    days
    totalPaid
    deposit
    expires
    startedAt
  }
}
```

### Get User's Rental History
```graphql
query GetUserRentalHistory($user: String!, $limit: Int = 20) {
  rentals(
    limit: $limit
    where: { user: $user }
    orderBy: "startedAt"
    orderDirection: "desc"
  ) {
    id
    listingId
    user
    owner
    nft
    tokenId
    days
    totalPaid
    deposit
    expires
    active
    startedAt
    endedAt
  }
}
```

### Get Owner's Rental Income
```graphql
query GetOwnerRentalIncome($owner: String!, $limit: Int = 20) {
  rentals(
    limit: $limit
    where: { owner: $owner }
    orderBy: "startedAt"
    orderDirection: "desc"
  ) {
    id
    listingId
    user
    nft
    tokenId
    days
    totalPaid
    deposit
    startedAt
    endedAt
  }
}
```

### Get Rental History Events
```graphql
query GetRentalHistoryEvents($limit: Int = 50) {
  rentalHistories(
    limit: $limit
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    listingId
    eventType
    user
    owner
    nft
    tokenId
    data
    timestamp
    blockNumber
    transactionHash
  }
}
```

### Get Rental Events for Listing
```graphql
query GetRentalEventsForListing($listingId: String!, $limit: Int = 50) {
  rentalHistories(
    limit: $limit
    where: { listingId: $listingId }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    listingId
    eventType
    user
    owner
    nft
    tokenId
    data
    timestamp
    blockNumber
    transactionHash
  }
}
```

### Get User Rental Profile
```graphql
query GetUserRentalProfile($userAddress: String!) {
  userRentalProfile(id: $userAddress) {
    id
    totalRentals
    totalSpent
    totalDeposits
    activeRentals
    expiredRentals
    createdAt
    updatedAt
  }
}
```

### Get Owner Rental Profile
```graphql
query GetOwnerRentalProfile($ownerAddress: String!) {
  ownerRentalProfile(id: $ownerAddress) {
    id
    totalListings
    totalRentals
    totalEarned
    activeListings
    createdAt
    updatedAt
  }
}
```

### Get Deposit Records
```graphql
query GetDepositRecords($limit: Int = 20) {
  depositRecords(
    limit: $limit
    orderBy: "lockedAt"
    orderDirection: "desc"
  ) {
    id
    listingId
    user
    amount
    paymentToken
    locked
    claimed
    lockedAt
    claimedAt
    claimedBy
  }
}
```

### Get User's Deposit Records
```graphql
query GetUserDepositRecords($user: String!, $limit: Int = 10) {
  depositRecords(
    limit: $limit
    where: { user: $user }
    orderBy: "lockedAt"
    orderDirection: "desc"
  ) {
    id
    listingId
    user
    amount
    paymentToken
    locked
    claimed
    lockedAt
    claimedAt
    claimedBy
  }
}
```

### Get Pending Deposits
```graphql
query GetPendingDeposits($limit: Int = 20) {
  depositRecords(
    limit: $limit
    where: { locked: true, claimed: false }
    orderBy: "lockedAt"
    orderDirection: "desc"
  ) {
    id
    listingId
    user
    amount
    paymentToken
    lockedAt
  }
}
```

---

## Domain Lending Pool Queries

### Get All Liquidity Providers
```graphql
query GetLiquidityProviders($limit: Int = 20) {
  liquidityProviders(
    limit: $limit
    orderBy: "currentAssetValue"
    orderDirection: "desc"
  ) {
    id
    lpAddress
    poolAddress
    totalDeposited
    totalWithdrawn
    currentShares
    currentAssetValue
    firstDepositAt
    lastActionAt
  }
}
```

### Get Liquidity Provider Details
```graphql
query GetLiquidityProviderDetails($lpAddress: String!, $poolAddress: String!) {
  liquidityProvider(id: "${lpAddress}-${poolAddress}") {
    id
    lpAddress
    poolAddress
    totalDeposited
    totalWithdrawn
    currentShares
    currentAssetValue
    firstDepositAt
    lastActionAt
  }
}
```

### Get Supply Transactions
```graphql
query GetSupplyTransactions($limit: Int = 50) {
  supplyTransactions(
    limit: $limit
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    lpAddress
    poolAddress
    type
    amount
    shares
    exchangeRate
    timestamp
    blockNumber
    transactionHash
  }
}
```

### Get User's Supply History
```graphql
query GetUserSupplyHistory($lpAddress: String!, $limit: Int = 20) {
  supplyTransactions(
    limit: $limit
    where: { lpAddress: $lpAddress }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    lpAddress
    poolAddress
    type
    amount
    shares
    exchangeRate
    timestamp
    blockNumber
    transactionHash
  }
}
```

### Get All Borrowers
```graphql
query GetBorrowers($limit: Int = 20) {
  borrowers(
    limit: $limit
    orderBy: "currentDebt"
    orderDirection: "desc"
  ) {
    id
    borrowerAddress
    poolAddress
    totalBorrowed
    totalRepaid
    currentDebt
    currentHealthFactor
    hasActiveCollateral
    collateralNft
    collateralTokenId
    collateralValue
    firstBorrowAt
    lastActionAt
    liquidationCount
  }
}
```

### Get Borrower Details
```graphql
query GetBorrowerDetails($borrowerAddress: String!, $poolAddress: String!) {
  borrower(id: "${borrowerAddress}-${poolAddress}") {
    id
    borrowerAddress
    poolAddress
    totalBorrowed
    totalRepaid
    currentDebt
    currentHealthFactor
    hasActiveCollateral
    collateralNft
    collateralTokenId
    collateralValue
    firstBorrowAt
    lastActionAt
    liquidationCount
  }
}
```

### Get Borrowers at Risk (Low Health Factor)
```graphql
query GetBorrowersAtRisk($healthThreshold: String = "1200000000000000000", $limit: Int = 20) {
  borrowers(
    limit: $limit
    where: { 
      currentHealthFactor: { lt: $healthThreshold },
      currentDebt: { gt: "0" }
    }
    orderBy: "currentHealthFactor"
    orderDirection: "asc"
  ) {
    id
    borrowerAddress
    poolAddress
    currentDebt
    currentHealthFactor
    hasActiveCollateral
    collateralNft
    collateralTokenId
    collateralValue
    lastActionAt
  }
}
```

### Get Borrow Transactions
```graphql
query GetBorrowTransactions($limit: Int = 50) {
  borrowTransactions(
    limit: $limit
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    borrowerAddress
    poolAddress
    type
    amount
    newTotalDebt
    healthFactor
    apr
    timestamp
    blockNumber
    transactionHash
  }
}
```

### Get User's Borrow History
```graphql
query GetUserBorrowHistory($borrowerAddress: String!, $limit: Int = 20) {
  borrowTransactions(
    limit: $limit
    where: { borrowerAddress: $borrowerAddress }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    borrowerAddress
    poolAddress
    type
    amount
    newTotalDebt
    healthFactor
    apr
    timestamp
    blockNumber
    transactionHash
  }
}
```

### Get Collateral Transactions
```graphql
query GetCollateralTransactions($limit: Int = 50) {
  collateralTransactions(
    limit: $limit
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    borrowerAddress
    poolAddress
    type
    nft
    tokenId
    valueUsd6
    timestamp
    blockNumber
    transactionHash
  }
}
```

### Get User's Collateral History
```graphql
query GetUserCollateralHistory($borrowerAddress: String!, $limit: Int = 20) {
  collateralTransactions(
    limit: $limit
    where: { borrowerAddress: $borrowerAddress }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    borrowerAddress
    poolAddress
    type
    nft
    tokenId
    valueUsd6
    timestamp
    blockNumber
    transactionHash
  }
}
```

### Get Liquidation Events
```graphql
query GetLiquidationEvents($limit: Int = 20) {
  liquidationEvents(
    limit: $limit
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    borrowerAddress
    liquidatorAddress
    poolAddress
    nft
    tokenId
    repayAmount
    collateralValue
    profit
    timestamp
    blockNumber
    transactionHash
  }
}
```

### Get Liquidations by Liquidator
```graphql
query GetLiquidationsByLiquidator($liquidatorAddress: String!, $limit: Int = 20) {
  liquidationEvents(
    limit: $limit
    where: { liquidatorAddress: $liquidatorAddress }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    borrowerAddress
    liquidatorAddress
    poolAddress
    nft
    tokenId
    repayAmount
    collateralValue
    profit
    timestamp
    blockNumber
    transactionHash
  }
}
```

### Get Pool Metrics
```graphql
query GetPoolMetrics($limit: Int = 10) {
  poolMetrics(
    limit: $limit
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    poolAddress
    totalAssets
    totalShares
    totalDebt
    exchangeRate
    utilization
    currentAPR
    totalLiquidityProviders
    totalBorrowers
    timestamp
    blockNumber
  }
}
```

### Get Latest Pool Metrics
```graphql
query GetLatestPoolMetrics($poolAddress: String!) {
  poolMetrics(
    limit: 1
    where: { poolAddress: $poolAddress }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    poolAddress
    totalAssets
    totalShares
    totalDebt
    exchangeRate
    utilization
    currentAPR
    totalLiquidityProviders
    totalBorrowers
    timestamp
    blockNumber
  }
}
```

### Get Interest Rate History
```graphql
query GetInterestRateHistory($poolAddress: String!, $limit: Int = 50) {
  interestRateSnapshots(
    limit: $limit
    where: { poolAddress: $poolAddress }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    poolAddress
    apr
    utilization
    timestamp
    blockNumber
  }
}
```

---

## Combined/Complex Queries

### Get Complete Auction Details
```graphql
query GetCompleteAuctionDetails($listingId: String!) {
  listing(id: $listingId) {
    id
    seller
    nft
    tokenId
    paymentToken
    reservePrice
    startTime
    endTime
    strategy
    status
    winner
    winningBid
    createdAt
    updatedAt
  }
  
  bids(where: { listingId: $listingId }, orderBy: "timestamp", orderDirection: "desc") {
    id
    bidder
    amount
    timestamp
  }
  
  auctionEvents(where: { listingId: $listingId }, orderBy: "timestamp", orderDirection: "desc") {
    id
    eventType
    data
    timestamp
  }
}
```

### Get User Dashboard Data
```graphql
query GetUserDashboard($userAddress: String!, $limit: Int = 10) {
  # User's listings
  userListings: listings(
    limit: $limit
    where: { seller: $userAddress }
    orderBy: "createdAt"
    orderDirection: "desc"
  ) {
    id
    nft
    tokenId
    status
    reservePrice
    createdAt
  }
  
  # User's bids
  userBids: bids(
    limit: $limit
    where: { bidder: $userAddress }
    orderBy: "timestamp"
    orderDirection: "desc"
  ) {
    id
    listingId
    amount
    timestamp
  }
  
  # User's won auctions
  userWins: listings(
    limit: $limit
    where: { winner: $userAddress }
    orderBy: "updatedAt"
    orderDirection: "desc"
  ) {
    id
    nft
    tokenId
    winningBid
    updatedAt
  }
}
```

### Get Market Overview
```graphql
query GetMarketOverview {
  # Active listings
  activeListings: listings(where: { status: "Live" }, limit: 100) {
    id
  }
  
  # Recent activity
  recentEvents: auctionEvents(limit: 5, orderBy: "timestamp", orderDirection: "desc") {
    id
    listingId
    eventType
    timestamp
  }
  
  # Recent statistics
  recentStats: auctionStats(limit: 1, orderBy: "updatedAt", orderDirection: "desc") {
    totalListings
    totalBids
    totalVolume
    averagePrice
  }
}
```

---

## Simple Test Queries

### Basic Listings Query (Test First)
```graphql
query TestListings {
  listings {
    id
    seller
    status
  }
}
```

### Basic Bids Query (Test First)
```graphql
query TestBids {
  bids {
    id
    listingId
    bidder
    amount
  }
}
```

### Basic Events Query (Test First) 
```graphql
query TestEvents {
  auctionEvents {
    id
    listingId
    eventType
    timestamp
  }
}
```

---

## GraphQL Endpoint

The GraphQL endpoint will be available at:
```
http://localhost:42069/graphql
```

## Updated Usage Notes

1. **Pagination**: Use `limit` and `offset` parameters (not `first` and `skip`)
2. **Filtering**: Use `where` clauses to filter results by specific criteria
3. **Sorting**: Use `orderBy` and `orderDirection` with **quoted strings**
4. **Field Names**: All field names should be strings in quotes for orderBy
5. **Real-time**: Consider using GraphQL subscriptions for real-time updates
6. **Performance**: Limit query depth and use appropriate pagination for large datasets

## Frontend Integration Examples

### Updated React Hook Example
```typescript
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_ACTIVE_LISTINGS = gql`
  query GetActiveListings($limit: Int = 10) {
    listings(limit: $limit, where: { status: "Live" }) {
      id
      seller
      nft
      tokenId
      reservePrice
      startTime
      endTime
    }
  }
`;

function useActiveListings() {
  const { data, loading, error } = useQuery(GET_ACTIVE_LISTINGS);
  return { listings: data?.listings || [], loading, error };
}
```

### Updated JavaScript Fetch Example
```javascript
async function fetchActiveListings() {
  const query = `
    query GetActiveListings {
      listings(where: { status: "Live" }, limit: 10) {
        id
        seller
        nft
        tokenId
        reservePrice
      }
    }
  `;
  
  const response = await fetch('http://localhost:42069/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  
  return response.json();
}
```

---

**Important**: This document has been updated to match Ponder's GraphQL API syntax. Use `limit` instead of `first`, `offset` instead of `skip`, and quote all orderBy field names.