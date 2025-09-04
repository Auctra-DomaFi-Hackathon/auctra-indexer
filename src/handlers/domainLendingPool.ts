// @ts-nocheck
import { ponder } from "ponder:registry";
import { 
  liquidityProvider,
  supplyTransaction,
  borrower,
  borrowTransaction,
  collateralTransaction,
  liquidationEvent,
  poolMetrics
} from "ponder:schema";

// === LIQUIDITY PROVIDER EVENTS ===

ponder.on("DomainLendingPool:LiquidityDeposited", async ({ event, context }) => {
  const { db } = context;
  
  const lpAddress = event.args.lp;
  const amount = event.args.amount;
  const poolAddress = event.log.address;
  const lpId = `${lpAddress}-${poolAddress}`;
  const shares = amount; // 1:1 exchange rate initially
  
  // Insert or update liquidity provider
  await db.insert(liquidityProvider)
    .values({
      id: lpId,
      lpAddress,
      poolAddress,
      totalDeposited: amount,
      totalWithdrawn: 0n,
      currentShares: shares,
      currentAssetValue: amount,
      firstDepositAt: event.block.timestamp,
      lastActionAt: event.block.timestamp,
    })
    .onConflictDoNothing();

  // Insert supply transaction
  await db.insert(supplyTransaction)
    .values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      lpAddress,
      poolAddress,
      type: "deposit",
      amount,
      shares,
      exchangeRate: 1000000000000000000n, // 1e18
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });
});

ponder.on("DomainLendingPool:LiquidityWithdrawn", async ({ event, context }) => {
  const { db } = context;
  
  const lpAddress = event.args.lp;
  const amount = event.args.amount;
  const poolAddress = event.log.address;

  // Insert withdraw transaction
  await db.insert(supplyTransaction)
    .values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      lpAddress,
      poolAddress,
      type: "withdraw",
      amount,
      shares: amount, // 1:1 exchange rate
      exchangeRate: 1000000000000000000n, // 1e18
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });
});

// === COLLATERAL EVENTS ===

ponder.on("DomainLendingPool:CollateralDeposited", async ({ event, context }) => {
  const { db } = context;
  
  const borrowerAddress = event.args.borrower;
  const nft = event.args.nft;
  const tokenId = event.args.tokenId;
  const valueUsd6 = event.args.valueUsd6;
  const poolAddress = event.log.address;
  const borrowerId = `${borrowerAddress}-${poolAddress}`;

  // Insert or update borrower
  await db.insert(borrower)
    .values({
      id: borrowerId,
      borrowerAddress,
      poolAddress,
      totalBorrowed: 0n,
      totalRepaid: 0n,
      currentDebt: 0n,
      currentHealthFactor: 1000000000000000000n, // 1e18 = healthy
      hasActiveCollateral: true,
      collateralNft: nft,
      collateralTokenId: tokenId,
      collateralValue: valueUsd6,
      lastActionAt: event.block.timestamp,
      liquidationCount: 0,
    })
    .onConflictDoNothing();

  // Insert collateral transaction
  await db.insert(collateralTransaction)
    .values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      borrowerAddress,
      poolAddress,
      type: "deposit",
      nft,
      tokenId,
      valueUsd6,
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });
});

ponder.on("DomainLendingPool:CollateralWithdrawn", async ({ event, context }) => {
  const { db } = context;
  
  const borrowerAddress = event.args.borrower;
  const nft = event.args.nft;
  const tokenId = event.args.tokenId;
  const poolAddress = event.log.address;

  // Insert collateral transaction
  await db.insert(collateralTransaction)
    .values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      borrowerAddress,
      poolAddress,
      type: "withdraw",
      nft,
      tokenId,
      valueUsd6: 0n,
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });
});

ponder.on("DomainLendingPool:CollateralValueRefreshed", async ({ event, context }) => {
  const { db } = context;
  
  const borrowerAddress = event.args.borrower;
  const nft = event.args.nft;
  const tokenId = event.args.tokenId;
  const newValueUsd6 = event.args.newValue;
  const poolAddress = event.log.address;

  // Insert value refresh transaction
  await db.insert(collateralTransaction)
    .values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      borrowerAddress,
      poolAddress,
      type: "value_refresh",
      nft,
      tokenId,
      valueUsd6: newValueUsd6,
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });
});

// === BORROWING EVENTS ===

ponder.on("DomainLendingPool:Borrowed", async ({ event, context }) => {
  const { db } = context;
  
  const borrowerAddress = event.args.borrower;
  const amount = event.args.amount;
  const newDebt = event.args.newDebt;
  const poolAddress = event.log.address;
  const borrowerId = `${borrowerAddress}-${poolAddress}`;

  // Insert or update borrower
  await db.insert(borrower)
    .values({
      id: borrowerId,
      borrowerAddress,
      poolAddress,
      totalBorrowed: amount,
      totalRepaid: 0n,
      currentDebt: newDebt,
      currentHealthFactor: 1500000000000000000n, // 1.5e18 = healthy
      hasActiveCollateral: true,
      firstBorrowAt: event.block.timestamp,
      lastActionAt: event.block.timestamp,
      liquidationCount: 0,
    })
    .onConflictDoNothing();

  // Insert borrow transaction
  await db.insert(borrowTransaction)
    .values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      borrowerAddress,
      poolAddress,
      type: "borrow",
      amount,
      newTotalDebt: newDebt,
      healthFactor: 1500000000000000000n, // Default healthy HF
      apr: 800n, // 8% APR in basis points
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });
});

ponder.on("DomainLendingPool:Repaid", async ({ event, context }) => {
  const { db } = context;
  
  const borrowerAddress = event.args.borrower;
  const amount = event.args.amount;
  const remainingDebt = event.args.remainingDebt;
  const poolAddress = event.log.address;

  // Insert repay transaction
  await db.insert(borrowTransaction)
    .values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      borrowerAddress,
      poolAddress,
      type: "repay",
      amount,
      newTotalDebt: remainingDebt,
      healthFactor: 2000000000000000000n, // Improved after repay
      apr: 800n,
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });
});

// === LIQUIDATION EVENTS ===

ponder.on("DomainLendingPool:Liquidated", async ({ event, context }) => {
  const { db } = context;
  
  const borrowerAddress = event.args.borrower;
  const liquidatorAddress = event.args.liquidator;
  const nft = event.args.nft;
  const tokenId = event.args.tokenId;
  const repaidDebt = event.args.repaidDebt;
  const poolAddress = event.log.address;

  // Default collateral value for liquidation events
  const collateralValue = repaidDebt + (repaidDebt * 100n / 1000n); // Assume 10% profit

  // Insert liquidation event
  await db.insert(liquidationEvent)
    .values({
      id: `${event.transaction.hash}-${event.log.logIndex}`,
      borrowerAddress,
      liquidatorAddress,
      poolAddress,
      nft,
      tokenId,
      repayAmount: repaidDebt,
      collateralValue,
      profit: collateralValue - repaidDebt,
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });

  // Insert liquidation collateral transaction
  await db.insert(collateralTransaction)
    .values({
      id: `${event.transaction.hash}-${event.log.logIndex}-liquidation`,
      borrowerAddress,
      poolAddress,
      type: "liquidated",
      nft,
      tokenId,
      valueUsd6: collateralValue,
      timestamp: event.block.timestamp,
      blockNumber: BigInt(event.block.number),
      transactionHash: event.transaction.hash,
    });
});