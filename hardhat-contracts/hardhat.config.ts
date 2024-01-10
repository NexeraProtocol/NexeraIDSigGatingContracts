import { HardhatUserConfig } from "hardhat/config";

import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

import dotenv from "dotenv";

import namedAccounts from "./hardhat.accounts";
import { networks } from "./hardhat.networks";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.16",
  etherscan: {
    apiKey: {
      polygonMumbai: `${process.env.ETHERSCAN_MUMBAI_API_KEY}`,
    },
  },
  networks,
  namedAccounts,
  typechain: {
    outDir: "types",
  },
  mocha: {
    timeout: 3000000,
  },
};
export default config;
