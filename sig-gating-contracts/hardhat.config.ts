import { HardhatUserConfig } from "hardhat/config";

import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomicfoundation/hardhat-viem";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@nomicfoundation/hardhat-verify";

import dotenv from "dotenv";

import namedAccounts from "./hardhat.accounts";
import { networks } from "./hardhat.networks";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          yul: true, // this resolves the issue when running coverage:: `Stack too deep when compiling inline assembly: Variable value0 is 2 slot(s) too deep inside the stack`
        },
      },
      viaIR: true,
    },
  },
  etherscan: {
    apiKey: {
      polygon: `${process.env.ETHERSCAN_POLYGON_MAINNET_API_KEY}`,
      polygonAmoy: `${process.env.ETHERSCAN_POLYGON_MAINNET_API_KEY}`,
      base: `${process.env.ETHERSCAN_BASE_API_KEY}`,
      bsc: `${process.env.ETHERSCAN_BSC_API_KEY}`,
      mainnet: `${process.env.ETHERSCAN_ETHEREUM_API_KEY}`,
      sepolia: `${process.env.ETHERSCAN_ETHEREUM_API_KEY}`,
      optimisticEthereum: `${process.env.ETHERSCAN_OPTIMISM_API_KEY}`,
    },
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true,
  },
  networks,
  namedAccounts,
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  mocha: {
    timeout: 3000000,
  },
};
export default config;
