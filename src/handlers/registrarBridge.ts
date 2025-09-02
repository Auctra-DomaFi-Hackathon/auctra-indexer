// @ts-nocheck
import { ponder } from "ponder:registry";

ponder.on("RegistrarBridge:DomainTransferRequested", async ({ event, context }) => {
  const { db } = context;
  
  await db.insert("domainTransferRequest", {
    id: event.args.listingId.toString(),
    listingId: event.args.listingId,
    registrarRef: event.args.registrarRef,
    buyer: event.args.buyer,
    nft: event.args.nft,
    tokenId: event.args.tokenId,
    pending: true,
    completed: false,
    success: false,
    message: "",
    requestedAt: event.block.timestamp,
  });
});

ponder.on("RegistrarBridge:DomainTransferConfirmed", async ({ event, context }) => {
  const { db } = context;
  
  await db.update("domainTransferRequest", {
    id: event.args.listingId.toString(),
    pending: false,
    completed: true,
    success: event.args.success,
    message: event.args.message,
    confirmedAt: event.block.timestamp,
  });
});