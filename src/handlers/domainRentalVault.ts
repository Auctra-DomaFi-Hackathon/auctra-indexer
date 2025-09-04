// @ts-nocheck
import { ponder } from "ponder:registry";
import { 
  rentalListing, 
  rental, 
  rentalHistory, 
  userRentalProfile, 
  ownerRentalProfile, 
  depositRecord 
} from "ponder:schema";

import { eq } from "drizzle-orm";

// Helper function to update user rental profile
async function updateUserRentalProfile(address: string, db: any, timestamp: bigint) {
  await db.insert(userRentalProfile)
    .values({
      id: address,
      totalRentals: 1n,
      totalSpent: 0n,
      totalDeposits: 0n,
      activeRentals: 1n,
      expiredRentals: 0n,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoNothing();
}

// Helper function to update owner rental profile
async function updateOwnerRentalProfile(address: string, db: any, timestamp: bigint, isListing = false) {
  await db.insert(ownerRentalProfile)
    .values({
      id: address,
      totalListings: isListing ? 1n : 0n,
      totalRentals: isListing ? 0n : 1n,
      totalEarned: 0n,
      activeListings: isListing ? 1n : 0n,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoNothing();
}

// Handle new rental listings
ponder.on("DomainRentalVault:Listed", async ({ event, context }) => {
  const { db } = context;
  
  await db.insert(rentalListing).values({
    id: event.args.id.toString(),
    owner: event.args.owner,
    nft: event.args.nft,
    tokenId: event.args.tokenId,
    paymentToken: "0x0000000000000000000000000000000000000000", // Will be set when terms are configured
    pricePerDay: 0n,
    securityDeposit: 0n,
    minDays: 0,
    maxDays: 0,
    paused: false,
    active: true,
    createdAt: event.block.timestamp,
    updatedAt: event.block.timestamp,
  });

  await db.insert(rentalHistory).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    listingId: event.args.id.toString(),
    eventType: "Listed",
    user: "0x0000000000000000000000000000000000000000",
    owner: event.args.owner,
    nft: event.args.nft,
    tokenId: event.args.tokenId,
    data: {
      owner: event.args.owner,
      nft: event.args.nft,
      tokenId: event.args.tokenId.toString(),
    },
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  });

  await updateOwnerRentalProfile(event.args.owner, db, event.block.timestamp, true);
});

// Handle rental terms setting
ponder.on("DomainRentalVault:TermsSet", async ({ event, context }) => {
  const { db } = context;
  
  await db.update(rentalListing, { id: event.args.id.toString() })
    .set({
      paymentToken: event.args.paymentToken,
      pricePerDay: event.args.pricePerDay,
      securityDeposit: event.args.securityDeposit,
      minDays: event.args.minDays,
      maxDays: event.args.maxDays,
      updatedAt: event.block.timestamp,
    });

  await db.insert(rentalHistory).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    listingId: event.args.id.toString(),
    eventType: "TermsSet",
    user: "0x0000000000000000000000000000000000000000",
    owner: event.transaction.from,
    nft: "0x0000000000000000000000000000000000000000",
    tokenId: 0n,
    data: {
      paymentToken: event.args.paymentToken,
      pricePerDay: event.args.pricePerDay.toString(),
      securityDeposit: event.args.securityDeposit.toString(),
      minDays: event.args.minDays,
      maxDays: event.args.maxDays,
    },
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  });
});

// Handle rental start
ponder.on("DomainRentalVault:Rented", async ({ event, context }) => {
  const { db } = context;
  
  // Get listing details
  const listingResults = await db.select().from(rentalListing).where(eq(rentalListing.id, event.args.id.toString()));
  const listing = listingResults[0];
  
  if (listing) {
    const totalPaid = listing.pricePerDay * BigInt(event.args.days);
    
    await db.insert(rental).values({
      id: event.args.id.toString(),
      listingId: event.args.id.toString(),
      user: event.args.user,
      owner: listing.owner,
      nft: listing.nft,
      tokenId: listing.tokenId,
      days: event.args.days,
      totalPaid: totalPaid,
      deposit: listing.securityDeposit,
      expires: event.args.expires,
      active: true,
      startedAt: event.block.timestamp,
    });

    // Track deposit if exists
    if (listing.securityDeposit > 0n) {
      await db.insert(depositRecord).values({
        id: event.args.id.toString(),
        listingId: event.args.id.toString(),
        user: event.args.user,
        amount: listing.securityDeposit,
        paymentToken: listing.paymentToken,
        locked: true,
        claimed: false,
        lockedAt: event.block.timestamp,
      });
    }

    await db.insert(rentalHistory).values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      listingId: event.args.id.toString(),
      eventType: "Rented",
      user: event.args.user,
      owner: listing.owner,
      nft: listing.nft,
      tokenId: listing.tokenId,
      data: {
        user: event.args.user,
        days: event.args.days,
        expires: event.args.expires.toString(),
        totalPaid: totalPaid.toString(),
        deposit: listing.securityDeposit.toString(),
      },
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });

    await updateUserRentalProfile(event.args.user, db, event.block.timestamp);
    await updateOwnerRentalProfile(listing.owner, db, event.block.timestamp, false);
  }
});

// Handle rental extension
ponder.on("DomainRentalVault:Extended", async ({ event, context }) => {
  const { db } = context;
  
  // Update rental expiration
  await db.update(rental, { id: event.args.id.toString() })
    .set({
      expires: event.args.newExpires,
    });

  // Get listing for additional data
  const listingResults = await db.select().from(rentalListing).where(eq(rentalListing.id, event.args.id.toString()));
  const listing = listingResults[0];

  await db.insert(rentalHistory).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    listingId: event.args.id.toString(),
    eventType: "Extended",
    user: event.transaction.from,
    owner: listing?.owner || "0x0000000000000000000000000000000000000000",
    nft: listing?.nft || "0x0000000000000000000000000000000000000000",
    tokenId: listing?.tokenId || 0n,
    data: {
      extraDays: event.args.extraDays,
      newExpires: event.args.newExpires.toString(),
    },
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  });
});

// Handle rental end
ponder.on("DomainRentalVault:Ended", async ({ event, context }) => {
  const { db } = context;
  
  // Update rental as inactive
  const rentalResults = await db.select().from(rental).where(eq(rental.id, event.args.id.toString()));
  const rentalData = rentalResults[0];

  if (rentalData) {
    await db.update(rental, { id: event.args.id.toString() })
      .set({
        active: false,
        endedAt: event.block.timestamp,
      });

    // Update user profile
    const profileResults = await db.select().from(userRentalProfile).where(eq(userRentalProfile.id, rentalData.user));
    const profile = profileResults[0];
    if (profile) {
      await db.update(userRentalProfile, { id: rentalData.user })
        .set({
          activeRentals: profile.activeRentals > 0n ? profile.activeRentals - 1n : 0n,
          expiredRentals: profile.expiredRentals + 1n,
          updatedAt: event.block.timestamp,
        });
    }

    const listingResults = await db.select().from(rentalListing).where(eq(rentalListing.id, event.args.id.toString()));
    const listing = listingResults[0];

    await db.insert(rentalHistory).values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      listingId: event.args.id.toString(),
      eventType: "Ended",
      user: rentalData.user,
      owner: rentalData.owner,
      nft: rentalData.nft,
      tokenId: rentalData.tokenId,
      data: {
        endedBy: event.transaction.from,
      },
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });
  }
});

// Handle deposit claim
ponder.on("DomainRentalVault:DepositClaimed", async ({ event, context }) => {
  const { db } = context;
  
  // Update deposit record
  await db.update(depositRecord, { id: event.args.id.toString() })
    .set({
      locked: false,
      claimed: true,
      claimedAt: event.block.timestamp,
      claimedBy: event.args.to,
    });

  // Update user profile total deposits
  const profileResults = await db.select().from(userRentalProfile).where(eq(userRentalProfile.id, event.args.to));
  const profile = profileResults[0];
  if (profile) {
    await db.update(userRentalProfile, { id: event.args.to })
      .set({
        totalDeposits: profile.totalDeposits + event.args.amount,
        updatedAt: event.block.timestamp,
      });
  }

  await db.insert(rentalHistory).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    listingId: event.args.id.toString(),
    eventType: "DepositClaimed",
    user: event.args.to,
    owner: "0x0000000000000000000000000000000000000000",
    nft: "0x0000000000000000000000000000000000000000",
    tokenId: 0n,
    data: {
      claimedBy: event.args.to,
      amount: event.args.amount.toString(),
    },
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  });
});

// Handle listing pause/unpause
ponder.on("DomainRentalVault:Paused", async ({ event, context }) => {
  const { db } = context;
  
  await db.update(rentalListing, { id: event.args.id.toString() })
    .set({
      paused: event.args.paused,
      updatedAt: event.block.timestamp,
    });

  await db.insert(rentalHistory).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    listingId: event.args.id.toString(),
    eventType: event.args.paused ? "Paused" : "Unpaused",
    user: event.transaction.from,
    owner: event.transaction.from,
    nft: "0x0000000000000000000000000000000000000000",
    tokenId: 0n,
    data: {
      paused: event.args.paused,
    },
    timestamp: event.block.timestamp,
    blockNumber: BigInt(event.block.number),
    transactionHash: event.transaction.hash,
  });
});

// Handle unlisting
ponder.on("DomainRentalVault:Unlisted", async ({ event, context }) => {
  const { db } = context;
  
  // Get listing before deletion for history
  const listingResults = await db.select().from(rentalListing).where(eq(rentalListing.id, event.args.id.toString()));
  const listing = listingResults[0];

  if (listing) {
    // Mark as inactive
    await db.update(rentalListing, { id: event.args.id.toString() })
      .set({
        active: false,
        updatedAt: event.block.timestamp,
      });

    // Update owner profile
    const profileResults = await db.select().from(ownerRentalProfile).where(eq(ownerRentalProfile.id, listing.owner));
    const profile = profileResults[0];
    if (profile) {
      await db.update(ownerRentalProfile, { id: listing.owner })
        .set({
          activeListings: profile.activeListings > 0n ? profile.activeListings - 1n : 0n,
          updatedAt: event.block.timestamp,
        });
    }

    await db.insert(rentalHistory).values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      listingId: event.args.id.toString(),
      eventType: "Unlisted",
      user: "0x0000000000000000000000000000000000000000",
      owner: listing.owner,
      nft: listing.nft,
      tokenId: listing.tokenId,
      data: {
        owner: listing.owner,
      },
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });
  }
});