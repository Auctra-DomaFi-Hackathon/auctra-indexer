import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";
import { eq, desc } from "drizzle-orm";

const app = new Hono();

// API endpoint untuk mendapatkan bid history user
app.get("/user-bid-history/:userAddress", async (c) => {
  try {
    const userAddress = c.req.param("userAddress");
    
    const userBids = await db
      .select()
      .from(schema.bid)
      .where(eq(schema.bid.bidder, userAddress as `0x${string}`))
      .orderBy(desc(schema.bid.timestamp));
    
    return c.json({
      success: true,
      data: userBids,
      count: userBids.length
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// API endpoint untuk mendapatkan highest bid berdasarkan listing ID
app.get("/highest-bid/:listingId", async (c) => {
  try {
    const listingId = c.req.param("listingId");
    
    const highestBid = await db
      .select()
      .from(schema.bid)
      .where(eq(schema.bid.listingId, listingId))
      .orderBy(desc(schema.bid.amount))
      .limit(1);
    
    return c.json({
      success: true,
      data: highestBid[0] || null
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// API endpoint untuk mendapatkan semua bids untuk listing tertentu
app.get("/listing-bids/:listingId", async (c) => {
  try {
    const listingId = c.req.param("listingId");
    
    const bids = await db
      .select()
      .from(schema.bid)
      .where(eq(schema.bid.listingId, listingId))
      .orderBy(desc(schema.bid.amount));
    
    return c.json({
      success: true,
      data: bids,
      count: bids.length,
      highestBid: bids[0] || null
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

app.use("/sql/*", client({ db, schema }));

app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

export default app;
