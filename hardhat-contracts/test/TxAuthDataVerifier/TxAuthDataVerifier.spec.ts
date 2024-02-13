import { expect } from "chai";
import hre, { getNamedAccounts, network, ethers } from "hardhat";

import { ExampleGatedNFTMinter } from "../../typechain";
import { Address } from "@nexeraprotocol/nexera-id-contracts-sdk/lib";
import { fixtureExampleGatedNFTMinter } from "../../fixtures/fixtureExampleGatedNFTMinter";

import { ExampleGatedNFTMinterABI } from "@nexeraprotocol/nexera-id-contracts-sdk/abis";
import { signTxAuthDataLib } from "@nexeraprotocol/nexera-id-contracts-sdk/lib";
import {
  generateFunctionCallData,
  generateFunctionCallDataViem,
} from "../utils/generateFunctionCallData";
import { signTxAuthData, signTxAuthDataViem } from "../utils/signTxAuthData";
import { publicActions } from "viem";

describe(`ExampleGatedNFTMinter`, function () {
  let exampleGatedNFTMinter: ExampleGatedNFTMinter;

  beforeEach(async () => {
    ({ exampleGatedNFTMinter } = await fixtureExampleGatedNFTMinter());
  });
  it(`Should check that user can call the ExampleGatedNFTMinter with a signature from the signer`, async () => {
    const { tester } = await getNamedAccounts();
    const [_, testerSigner, txAuthSigner] = await ethers.getSigners();

    // Build Signature
    const recipient = tester;
    const block = await ethers.provider.getBlock("latest");
    const blockExpiration = block.number + 50;
    const chainID = Number(await network.provider.send("eth_chainId"));
    // encode function data with a fake value for the signature
    const functionCallData = await generateFunctionCallData(
      ExampleGatedNFTMinterABI,
      "mintNFTGated",
      [recipient, blockExpiration, "0x1234"]
    );
    // remove 96 bytes (2 bytes fake sig + 32 bytes offset + 32 bytes length + 30 bytes suffix) for the signature
    // 32 bytes for blockExpiration
    // = 128 bytes = 256 characters
    const argsWithSelector = functionCallData.slice(0, -256) as `0x${string}`;

    const txAuthData = {
      functionCallData: argsWithSelector,
      contractAddress: exampleGatedNFTMinter.address as Address,
      userAddress: tester as Address,
      chainID,
      nonce: Number(await exampleGatedNFTMinter.getUserNonce(tester)),
      blockExpiration,
    };

    const signature = await signTxAuthData(txAuthData, txAuthSigner);

    // try to mint nft
    const tx = await exampleGatedNFTMinter
      .connect(testerSigner)
      .mintNFTGated(recipient, blockExpiration, signature);

    const transactionReceipt = await tx.wait();
    const tokenId = Number(transactionReceipt.events?.[0].args?.tokenId);
    expect(tokenId === 1).to.be.true;
    const tokenOwner = await exampleGatedNFTMinter.ownerOf(tokenId);
    expect(tokenOwner === tester).to.be.true;
  });
  it(`Should check that user can call the ExampleGatedNFTMinter with a signature from the signer - with Viem`, async () => {
    const { tester } = await getNamedAccounts();
    const [_, testerSigner] = await ethers.getSigners();
    const [__, ___, txAuthWalletClient] = await hre.viem.getWalletClients();

    // Build Signature
    const recipient = tester;
    const block = await ethers.provider.getBlock("latest");
    const blockExpiration = block.number + 50;
    const chainID = Number(await network.provider.send("eth_chainId"));
    // encode function data with a fake value for the signature
    const functionCallData = await generateFunctionCallDataViem(
      ExampleGatedNFTMinterABI,
      "mintNFTGated",
      [recipient, blockExpiration, "0x1234"]
    );
    // remove 96 bytes (2 bytes fake sig + 32 bytes offset + 32 bytes length + 30 bytes suffix) for the signature
    // 32 bytes for blockExpiration
    // = 128 bytes = 256 characters
    const argsWithSelector = functionCallData.slice(0, -256) as `0x${string}`;

    const txAuthData = {
      functionCallData: argsWithSelector,
      contractAddress: exampleGatedNFTMinter.address as Address,
      userAddress: tester as Address,
      chainID,
      nonce: Number(await exampleGatedNFTMinter.getUserNonce(tester)),
      blockExpiration,
    };

    const signature = await signTxAuthDataViem(txAuthData, txAuthWalletClient);

    // try to mint nft
    const tx = await exampleGatedNFTMinter
      .connect(testerSigner)
      .mintNFTGated(recipient, blockExpiration, signature);

    const transactionReceipt = await tx.wait();
    const tokenId = Number(transactionReceipt.events?.[0].args?.tokenId);
    expect(tokenId === 1).to.be.true;
    const tokenOwner = await exampleGatedNFTMinter.ownerOf(tokenId);
    expect(tokenOwner === tester).to.be.true;
  });
  it(`Should check that user can call the ExampleGatedNFTMinter with a signature from the signer - with lib function`, async () => {
    const { tester } = await getNamedAccounts();
    const [_, testerSigner] = await ethers.getSigners();
    const [__, ___, txAuthWalletClient] = await hre.viem.getWalletClients();

    // Build Signature
    const recipient = tester;
    const block = await ethers.provider.getBlock("latest");
    const blockExpiration = block.number + 50;

    const txAuthInput = {
      contractAbi: ExampleGatedNFTMinterABI,
      contractAddress: exampleGatedNFTMinter.address as Address,
      functionName: "mintNFTGated",
      args: [recipient],
      userAddress: tester as Address,
      nonce: Number(await exampleGatedNFTMinter.getUserNonce(tester)),
    };

    const signature = await signTxAuthDataLib(
      txAuthWalletClient.extend(publicActions),
      txAuthInput
    );

    // try to mint nft
    const tx = await exampleGatedNFTMinter
      .connect(testerSigner)
      .mintNFTGated(recipient, blockExpiration, signature);

    const transactionReceipt = await tx.wait();
    const tokenId = Number(transactionReceipt.events?.[0].args?.tokenId);
    expect(tokenId === 1).to.be.true;
    const tokenOwner = await exampleGatedNFTMinter.ownerOf(tokenId);
    expect(tokenOwner === tester).to.be.true;
  });
  it(`Should check that user can NOT call the ExampleGatedNFTMinter with a wrong signature from the signer`, async () => {
    const { tester } = await getNamedAccounts();
    const [_, testerSigner, txAuthSigner] = await ethers.getSigners();

    // Build Signature
    const recipient = tester;
    const block = await ethers.provider.getBlock("latest");
    const blockExpiration = block.number + 50;
    const chainID = Number(await network.provider.send("eth_chainId"));
    // encode function data with a fake value for the signature
    const functionCallData = await generateFunctionCallData(
      ExampleGatedNFTMinterABI,
      "mintNFTGated",
      [recipient, blockExpiration, "0x1234"]
    );

    // remove 96 bytes (2 bytes fake sig + 32 bytes offset + 32 bytes length + 30 bytes suffix) for the signature
    // 32 bytes for blockExpiration
    // = 128 bytes = 256 characters
    const argsWithSelector = functionCallData.slice(0, -256);

    const txAuthData = {
      functionCallData: argsWithSelector,
      contractAddress: exampleGatedNFTMinter.address as Address,
      userAddress: tester as Address,
      chainID,
      nonce: Number(await exampleGatedNFTMinter.getUserNonce(tester)),
      blockExpiration,
    };

    // Build Wrong Values
    const wrongValues = {
      functionCallData: (
        await generateFunctionCallData(
          ExampleGatedNFTMinterABI,
          "mintNFTGated",
          [_.address, blockExpiration, "0x1234"]
        )
      ).slice(0, -256), // wrong recipient value
      contractAddress: tester as Address,
      userAddress: _.address as Address,
      chainID: 666,
      nonce: 666,
    };

    for (const wrongValueKey of Object.keys(wrongValues)) {
      let hasReverted = false;
      try {
        const signature = await signTxAuthData(
          //@ts-ignore
          { ...txAuthData, [wrongValueKey]: wrongValues[wrongValueKey] },
          txAuthSigner
        );

        // try to mint nft
        await exampleGatedNFTMinter
          .connect(testerSigner)
          .mintNFTGated(recipient, blockExpiration, signature);
      } catch (e: unknown) {
        expect((e as Error).toString()).to.eq(
          `TransactionExecutionError: VM Exception while processing transaction: revert with unrecognized return data or custom error`
        );
        hasReverted = true;
      }
      expect(hasReverted).to.be.true;
    }
  });
  it(`Should check that user can NOT call the ExampleGatedNFTMinter with an expired signature from the signer`, async () => {
    const { tester } = await getNamedAccounts();
    const [_, testerSigner, txAuthSigner] = await ethers.getSigners();

    // Build Signature
    const recipient = tester;
    const block = await ethers.provider.getBlock("latest");
    const blockExpiration = block.number + 50;
    const chainID = Number(await network.provider.send("eth_chainId"));
    // encode function data with a fake value for the signature
    const functionCallData = await generateFunctionCallData(
      ExampleGatedNFTMinterABI,
      "mintNFTGated",
      [recipient, blockExpiration, "0x1234"]
    );

    // remove 96 bytes (2 bytes fake sig + 32 bytes offset + 32 bytes length + 30 bytes suffix) for the signature
    // 32 bytes for blockExpiration
    // = 128 bytes = 256 characters
    const argsWithSelector = functionCallData.slice(0, -256) as `0x${string}`;

    const wrongTxAuthData = {
      functionCallData: argsWithSelector,
      contractAddress: exampleGatedNFTMinter.address as Address,
      userAddress: tester as Address,
      chainID,
      nonce: Number(await exampleGatedNFTMinter.getUserNonce(tester)),
      blockExpiration: 0,
    };

    let hasReverted = false;
    try {
      const signature = await signTxAuthData(wrongTxAuthData, txAuthSigner);

      // try to mint nft
      await exampleGatedNFTMinter
        .connect(testerSigner)
        .mintNFTGated(recipient, blockExpiration, signature);
    } catch (e: unknown) {
      expect((e as Error).toString()).to.eq(
        `TransactionExecutionError: VM Exception while processing transaction: revert with unrecognized return data or custom error`
      );
      hasReverted = true;
    }
    expect(hasReverted).to.be.true;
  });
});