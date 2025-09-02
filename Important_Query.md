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