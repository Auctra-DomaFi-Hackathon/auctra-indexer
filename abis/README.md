# ABIs Directory

This directory should contain the contract ABIs for all the auction contracts:

## Required ABI files:
- `DomainAuctionHouse.json` - Main auction house contract ABI
- `EnglishAuction.json` - English auction strategy ABI
- `DutchAuction.json` - Dutch auction strategy ABI  
- `SealedBidAuction.json` - Sealed bid auction strategy ABI
- `FeeManager.json` - Fee manager contract ABI
- `RegistrarBridge.json` - Registrar bridge contract ABI

## How to get ABIs:
1. From your Hardhat/Foundry build artifacts
2. From contract verification on block explorer
3. Export from your smart contract deployment scripts

## Note:
Make sure the ABI files are in JSON format and contain the full contract ABI including all events that need to be indexed.