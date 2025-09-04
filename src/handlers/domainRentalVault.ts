// @ts-nocheck
import { ponder } from "ponder:registry";
import {
  rentalListing,
  rental,
  rentalHistory,
  userRentalProfile,
  ownerRentalProfile,
  depositRecord,
} from "ponder:schema";
// import { replaceBigInts } from "ponder/utils";

// Helper function to update user rental profile
async function updateUserRentalProfile(
  address: string,
  db: any,
  timestamp: bigint
) {
  await db
    .insert(userRentalProfile)
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
async function updateOwnerRentalProfile(
  address: string,
  db: any,
  timestamp: bigint,
  isListing = false
) {
  await db
    .insert(ownerRentalProfile)
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

  await updateOwnerRentalProfile(
    event.args.owner,
    db,
    event.block.timestamp,
    true
  );
});

// Handle rental terms setting
ponder.on("DomainRentalVault:TermsSet", async ({ event, context }) => {
  const { db } = context;

  await db.update(rentalListing, { id: event.args.id.toString() }).set({
    paymentToken: event.args.paymentToken,
    pricePerDay: event.args.pricePerDay,
    securityDeposit: event.args.securityDeposit,
    minDays: event.args.minDays,
    maxDays: event.args.maxDays,
    updatedAt: event.block.timestamp,
  });

  // Get listing details for history
  const listing = await db.find(rentalListing, {
    id: event.args.id.toString(),
  });

  if (listing) {
    await db.insert(rentalHistory).values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      listingId: event.args.id.toString(),
      eventType: "TermsSet",
      user: "0x0000000000000000000000000000000000000000",
      owner: listing.owner,
      nft: listing.nft,
      tokenId: listing.tokenId,
      data: {
        paymentToken: event.args.paymentToken,
        pricePerDay: event.args.pricePerDay.toString(),
        securityDeposit: event.args.securityDeposit.toString(),
        minDays: event.args.minDays.toString(),
        maxDays: event.args.maxDays.toString(),
      },
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });
  }
});

// Handle rental start
ponder.on("DomainRentalVault:Rented", async ({ event, context }) => {
  const { db } = context;

  // Get listing details
  const listing = await db.find(rentalListing, {
    id: event.args.id.toString(),
  });

  if (listing) {
    const totalPaid = listing.pricePerDay * BigInt(event.args.daysRented);

    await db.insert(rental).values({
      id: event.args.id.toString(),
      listingId: event.args.id.toString(),
      user: event.args.renter,
      owner: listing.owner,
      nft: listing.nft,
      tokenId: listing.tokenId,
      days: event.args.daysRented,
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
        user: (event.args.renter ?? event.transaction.from) as `0x${string}`,
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
      user: event.args.renter,
      owner: listing.owner,
      nft: listing.nft,
      tokenId: listing.tokenId,          // kolom DB ini bertipe bigint -> biarkan bigint
      data: {
        user: event.args.renter,
        days: event.args.daysRented.toString(),
        expires: event.args.expires.toString(),
        totalPaid: totalPaid.toString(),
        deposit: listing.securityDeposit.toString(),
      },
      timestamp: event.block.timestamp,  // kolom DB bigint -> biarkan bigint
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });
    

    await updateUserRentalProfile(event.args.renter, db, event.block.timestamp);
    await updateOwnerRentalProfile(
      listing.owner,
      db,
      event.block.timestamp,
      false
    );
  }
});

// Handle rental extension
ponder.on("DomainRentalVault:Extended", async ({ event, context }) => {
  const { db } = context;

  // Update rental expiration
  await db.update(rental, { id: event.args.id.toString() }).set({
    expires: event.args.newExpires,
  });

  // Get listing for additional data
  const listing = await db.find(rentalListing, {
    id: event.args.id.toString(),
  });

  await db.insert(rentalHistory).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    listingId: event.args.id.toString(),
    eventType: "Extended",
    user: event.transaction.from,
    owner: listing?.owner || "0x0000000000000000000000000000000000000000",
    nft: listing?.nft || "0x0000000000000000000000000000000000000000",
    tokenId: listing?.tokenId || 0n,
    data: {
      extraDays: event.args.extraDays.toString(),
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
  const rentalData = await db.find(rental, { id: event.args.id.toString() });

  if (rentalData) {
    await db.update(rental, { id: event.args.id.toString() }).set({
      active: false,
      endedAt: event.block.timestamp,
    });

    // Update user profile
    const profile = await db.find(userRentalProfile, { id: rentalData.user });
    if (profile) {
      await db.update(userRentalProfile, { id: rentalData.user }).set({
        activeRentals:
          profile.activeRentals > 0n ? profile.activeRentals - 1n : 0n,
        expiredRentals: profile.expiredRentals + 1n,
        updatedAt: event.block.timestamp,
      });
    }

    const listing = await db.find(rentalListing, {
      id: event.args.id.toString(),
    });

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
  await db.update(depositRecord, { id: event.args.id.toString() }).set({
    locked: false,
    claimed: true,
    claimedAt: event.block.timestamp,
    claimedBy: event.args.to,
  });

  // Update user profile total deposits
  const profile = await db.find(userRentalProfile, { id: event.args.to });
  if (profile) {
    await db.update(userRentalProfile, { id: event.args.to }).set({
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

  await db.update(rentalListing, { id: event.args.id.toString() }).set({
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
  const listing = await db.find(rentalListing, {
    id: event.args.id.toString(),
  });

  if (listing) {
    // Mark as inactive
    await db.update(rentalListing, { id: event.args.id.toString() }).set({
      active: false,
      updatedAt: event.block.timestamp,
    });

    // Update owner profile
    const profile = await db.find(ownerRentalProfile, { id: listing.owner });
    if (profile) {
      await db.update(ownerRentalProfile, { id: listing.owner }).set({
        activeListings:
          profile.activeListings > 0n ? profile.activeListings - 1n : 0n,
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
