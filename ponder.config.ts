import { createConfig } from "ponder";
import { http } from "viem";
import { DomainAuctionHouseAbi } from "./abis/DomainAuctionHouse";
import { EnglishAuctionAbi } from "./abis/EnglishAuction";
import { DutchAuctionAbi } from "./abis/DutchAuction";
import { SealedBidAuctionAbi } from "./abis/SealedBidAuction";
import { FeeManagerAbi } from "./abis/FeeManager";
import { RegistrarBridgeAbi } from "./abis/RegistrarBridge";
import { DomainLendingAbi } from "./abis/DomainLending";
import { DomainRentalVaultAbi } from "./abis/DomainRentalVault";

export default createConfig({
  chains: {
    domaTestnet: {
      id: 97476,
      rpc:
        process.env.PONDER_RPC_URL_DOMA_TESTNET ||
        "https://rpc-testnet.doma.xyz",
    },
  },
  contracts: {
    DomainAuctionHouse: {
      chain: "domaTestnet",
      abi: DomainAuctionHouseAbi,
      address: "0xCD6DD013877570678449E788ab4fb221d37d6f88",
      startBlock: 10431208,
    },
    EnglishAuction: {
      chain: "domaTestnet",
      abi: EnglishAuctionAbi,
      address: "0xA8083D094cCD8a4B0843C014Dc11AF7b97283906",
      startBlock: 10431205,
    },
    DutchAuction: {
      chain: "domaTestnet",
      abi: DutchAuctionAbi,
      address: "0xCB0c653f110e469B9d74DBCC3aD632e7B58454b0",
      startBlock: 10431206,
    },
    SealedBidAuction: {
      chain: "domaTestnet",
      abi: SealedBidAuctionAbi,
      address: "0xDcD92889cDf7C0D56AD02da1e99bc9Dc022E033a",
      startBlock: 10431210,
    },
    FeeManager: {
      chain: "domaTestnet",
      abi: FeeManagerAbi,
      address: "0xec709b51F24801243313F0931525fcAecFE30cEC",
      startBlock: 10431202,
    },
    RegistrarBridge: {
      chain: "domaTestnet",
      abi: RegistrarBridgeAbi,
      address: "0x964B0d2eA0896F694710b9f4a20290F470B7801D",
      startBlock: 10431204,
    },
    DomainLendingPool: {
      chain: "domaTestnet",
      abi: DomainLendingAbi,
      address: "0x133272720610d669Fa4C5891Ab62a302455585Dd",
      startBlock: 10126589,
    },
    DomainRentalVault: {
      chain: "domaTestnet",
      abi: DomainRentalVaultAbi,
      address: "0x57Cf6d83589Da81DBB8fD99bcA48B64f52f89eA7",
      startBlock: 10126591,
    },
  },
});
