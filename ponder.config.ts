import { createConfig } from "ponder";
import { http } from "viem";
import { DomainAuctionHouseAbi } from "./abis/DomainAuctionHouse";
import { EnglishAuctionAbi } from "./abis/EnglishAuction";
import { DutchAuctionAbi } from "./abis/DutchAuction";
import { SealedBidAuctionAbi } from "./abis/SealedBidAuction";
import { FeeManagerAbi } from "./abis/FeeManager";
import { RegistrarBridgeAbi } from "./abis/RegistrarBridge";

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
      address: "0x346d94b66072D8b9d678058073A0fe7eF449f03f",
      startBlock: 10148727,
    },
    EnglishAuction: {
      chain: "domaTestnet",
      abi: EnglishAuctionAbi,
      address: "0x947e70b9362eeCA8a3994F839Ebcc2C1c7d63C5d",
      startBlock: 10135129,
    },
    DutchAuction: {
      chain: "domaTestnet",
      abi: DutchAuctionAbi,
      address: "0x084DA94314FE36Cf957191A78a7d6395dC951686",
      startBlock: 10135131,
    },
    SealedBidAuction: {
      chain: "domaTestnet",
      abi: SealedBidAuctionAbi,
      address: "0x7Cb994c76074064E6003f7DE048c35A285055c5C",
      startBlock: 10135133,
    },
    FeeManager: {
      chain: "domaTestnet",
      abi: FeeManagerAbi,
      address: "0xaCd0B6598768d597Ad6c322f88969E687617Dd28",
      startBlock: 10135127,
    },
    RegistrarBridge: {
      chain: "domaTestnet",
      abi: RegistrarBridgeAbi,
      address: "0x76D2559Dc8C5C092649C2A0dDFb3d6395157CC18",
      startBlock: 10135128,
    },
  },
});
