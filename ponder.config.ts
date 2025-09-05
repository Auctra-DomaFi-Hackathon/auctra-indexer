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
      address: "0x83760459190611Dd86cFD6fb209c24A291317bf7",
      startBlock: 10284634,
    },
    EnglishAuction: {
      chain: "domaTestnet",
      abi: EnglishAuctionAbi,
      address: "0x2CD3f3f8aeb2ad0db8325401B402a3B3724e0F7a",
      startBlock: 10284628,
    },
    DutchAuction: {
      chain: "domaTestnet",
      abi: DutchAuctionAbi,
      address: "0x0d11150F7351BA646f1Ad6bd1EA4AdCd0f88e98b",
      startBlock: 10284630,
    },
    SealedBidAuction: {
      chain: "domaTestnet",
      abi: SealedBidAuctionAbi,
      address: "0xd2F7db7925d653F8b2ff74848C9d90A5E37713A2",
      startBlock: 10284632,
    },
    FeeManager: {
      chain: "domaTestnet",
      abi: FeeManagerAbi,
      address: "0x0d03cF675aF0bd9cAe503BC5Fa2762804867356B",
      startBlock: 10284624,
    },
    RegistrarBridge: {
      chain: "domaTestnet",
      abi: RegistrarBridgeAbi,
      address: "0x0272AD2345a2eB27b2db3F436Fb25Da69b66ea48",
      startBlock: 10284626,
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
