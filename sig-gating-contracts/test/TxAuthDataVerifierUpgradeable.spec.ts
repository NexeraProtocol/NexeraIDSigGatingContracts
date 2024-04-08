import { expect } from "chai";
import hre, { getNamedAccounts, network, ethers } from "hardhat";

import { ExampleGatedNFTMinterUpgradeable } from "../typechain";
import {
  Address,
  signTxAuthDataLibEthers,
} from "@nexeraprotocol/nexera-id-sig-gating-contracts-sdk/lib";
import { fixtureExampleGatedNFTMinterUpgradeable } from "../fixtures/fixtureExampleGatedNFTMinterUpgradeable";

import { ExampleGatedNFTMinterUpgradeableABI } from "@nexeraprotocol/nexera-id-sig-gating-contracts-sdk/abis";
import { signTxAuthDataLib } from "@nexeraprotocol/nexera-id-sig-gating-contracts-sdk/lib";
import {
  generateFunctionCallData,
  generateFunctionCallDataViem,
} from "./utils/generateFunctionCallData";
import { signTxAuthData, signTxAuthDataViem } from "./utils/signTxAuthData";
import { publicActions } from "viem";
import { Wallet } from "ethers";
import { setupThreeAccounts } from "./utils/fundAccounts";

describe(`ExampleGatedNFTMinterUpgradeable`, function () {
  let exampleGatedNFTMinterUpgradeable: ExampleGatedNFTMinterUpgradeable;

  beforeEach(async () => {
    await setupThreeAccounts();
    ({ exampleGatedNFTMinterUpgradeable } =
      await fixtureExampleGatedNFTMinterUpgradeable());
  });
  it(`Should not be able to be intialized twice`, async () => {
    const { tester } = await getNamedAccounts();
    const [txAuthSigner, testerSigner] = await ethers.getSigners();

    // try to mint nft
    expect(exampleGatedNFTMinterUpgradeable.initialize(tester)).to.revertedWith(
      "Initializable: contract is already initialized"
    );
  });
  it(`Should check that user can call the ExampleGatedNFTMinterUpgradeable with a signature from the signer`, async () => {
    const { tester } = await getNamedAccounts();
    const [txAuthSigner, testerSigner] = await ethers.getSigners();

    // Build Signature
    const recipient = tester;
    const block = await ethers.provider.getBlock("latest");
    const blockExpiration = block.number + 50;
    if (!txAuthSigner.provider) {
      throw new Error("missing provider on signer");
    }
    const { chainId: chainID } = await txAuthSigner.provider.getNetwork();
    // encode function data with a fake value for the signature
    const functionCallData = await generateFunctionCallData(
      ExampleGatedNFTMinterUpgradeableABI,
      "mintNFTGated",
      [recipient, blockExpiration, "0x1234"]
    );
    // remove 64 bytes (32 bytes for the length and 32 bytes for the fake signature itself)
    // = 128 characters
    const argsWithSelector = functionCallData.slice(0, -128) as `0x${string}`;

    const txAuthData = {
      functionCallData: argsWithSelector,
      contractAddress: exampleGatedNFTMinterUpgradeable.address as Address,
      userAddress: tester as Address,
      chainID,
      nonce: Number(
        await exampleGatedNFTMinterUpgradeable.getUserNonce(tester)
      ),
      blockExpiration,
    };

    const signature = await signTxAuthData(txAuthData, txAuthSigner);

    // try to mint nft
    await exampleGatedNFTMinterUpgradeable
      .connect(testerSigner)
      .mintNFTGated(recipient, blockExpiration, signature);

    const tokenId = Number(
      await exampleGatedNFTMinterUpgradeable.getLastTokenId()
    );
    expect(tokenId === 1).to.be.true;
    const tokenOwner = await exampleGatedNFTMinterUpgradeable.ownerOf(tokenId);
    expect(tokenOwner === tester).to.be.true;
  });
  it(`Should check that user can call the ExampleGatedNFTMinterUpgradeable with a signature from the signer - with Viem`, async () => {
    const { tester } = await getNamedAccounts();
    const [_, testerSigner] = await ethers.getSigners();
    const [txAuthWalletClient, ___] = await hre.viem.getWalletClients();

    // Build Signature
    const recipient = tester;
    const block = await ethers.provider.getBlock("latest");
    const blockExpiration = block.number + 50;
    if (!testerSigner.provider) {
      throw new Error("missing provider on signer");
    }
    const { chainId: chainID } = await testerSigner.provider.getNetwork();
    // encode function data with a fake value for the signature
    const functionCallData = await generateFunctionCallDataViem(
      ExampleGatedNFTMinterUpgradeableABI,
      "mintNFTGated",
      [recipient, blockExpiration, "0x1234"]
    );
    // remove 64 bytes (32 bytes for the length and 32 bytes for the fake signature itself)
    // = 128 characters
    const argsWithSelector = functionCallData.slice(0, -128) as `0x${string}`;

    const txAuthData = {
      functionCallData: argsWithSelector,
      contractAddress: exampleGatedNFTMinterUpgradeable.address as Address,
      userAddress: tester as Address,
      chainID,
      nonce: Number(
        await exampleGatedNFTMinterUpgradeable.getUserNonce(tester)
      ),
      blockExpiration,
    };

    const signature = await signTxAuthDataViem(txAuthData, txAuthWalletClient);

    // try to mint nft
    const tx = await exampleGatedNFTMinterUpgradeable
      .connect(testerSigner)
      .mintNFTGated(recipient, blockExpiration, signature);

    const transactionReceipt = await tx.wait();
    const tokenId = Number(transactionReceipt.events?.[1].args?.tokenId);
    expect(tokenId === 1).to.be.true;
    const tokenOwner = await exampleGatedNFTMinterUpgradeable.ownerOf(tokenId);
    expect(tokenOwner === tester).to.be.true;
  });
  it(`Should check that user can call the ExampleGatedNFTMinterUpgradeable with a signature from the signer - with lib function`, async () => {
    const { tester } = await getNamedAccounts();
    const [_, testerSigner] = await ethers.getSigners();
    const [txAuthWalletClient, ___] = await hre.viem.getWalletClients();

    // Build Signature
    const recipient = tester;

    const txAuthInput = {
      contractAbi: Array.from(ExampleGatedNFTMinterUpgradeableABI),
      contractAddress: exampleGatedNFTMinterUpgradeable.address as Address,
      functionName: "mintNFTGated",
      args: [recipient],
      userAddress: tester as Address,
    };

    const signatureResponse = await signTxAuthDataLib(
      txAuthWalletClient.extend(publicActions),
      txAuthInput
    );

    // try to mint nft
    const tx = await exampleGatedNFTMinterUpgradeable
      .connect(testerSigner)
      .mintNFTGated(
        recipient,
        signatureResponse.blockExpiration,
        signatureResponse.signature
      );

    const transactionReceipt = await tx.wait();
    const tokenId = Number(transactionReceipt.events?.[1].args?.tokenId);
    expect(tokenId === 1).to.be.true;
    const tokenOwner = await exampleGatedNFTMinterUpgradeable.ownerOf(tokenId);
    expect(tokenOwner === tester).to.be.true;

    // Also check for signagure verified emitted event
    expect(transactionReceipt.events?.[0].args?.userAddress === tester).to.be
      .true;
    expect(transactionReceipt.events?.[0].event === "NexeraIDSignatureVerified")
      .to.be.true;
  });
  it(`Should check that user can call the ExampleGatedNFTMinterUpgradeable with a signature from the signer -  with custom address for contract to be able to call it`, async () => {
    const { tester } = await getNamedAccounts();
    const [txAuthSigner, testerSigner] = await ethers.getSigners();
    const [_, ___] = await hre.viem.getWalletClients();

    // Build Signature
    const recipient = tester;

    const txAuthInput = {
      contractAbi: Array.from(ExampleGatedNFTMinterUpgradeableABI),
      contractAddress: exampleGatedNFTMinterUpgradeable.address as Address,
      functionName: "mintNFTGatedWithAddress",
      args: [recipient, recipient],
      userAddress: tester as Address,
    };

    const signatureResponse = await signTxAuthDataLibEthers(
      txAuthSigner as unknown as Wallet,
      txAuthInput
    );

    // try to mint nft
    const tx = await exampleGatedNFTMinterUpgradeable
      .connect(testerSigner)
      .mintNFTGatedWithAddress(
        recipient,
        recipient,
        signatureResponse.blockExpiration,
        signatureResponse.signature
      );

    const transactionReceipt = await tx.wait();
    const tokenId = Number(transactionReceipt.events?.[1].args?.tokenId);
    expect(tokenId === 1).to.be.true;
    const tokenOwner = await exampleGatedNFTMinterUpgradeable.ownerOf(tokenId);
    expect(tokenOwner === tester).to.be.true;

    // Also check for signagure verified emitted event
    expect(transactionReceipt.events?.[0].args?.userAddress === tester).to.be
      .true;
    expect(transactionReceipt.events?.[0].event === "NexeraIDSignatureVerified")
      .to.be.true;
  });
  it(`Should check that user can NOT call the ExampleGatedNFTMinterUpgradeable with a wrong signature from the signer`, async () => {
    const { tester } = await getNamedAccounts();
    const [txAuthSigner, testerSigner] = await ethers.getSigners();

    // Build Signature
    const recipient = tester;
    const block = await ethers.provider.getBlock("latest");
    const blockExpiration = block.number + 50;
    if (!txAuthSigner.provider) {
      throw new Error("missing provider on signer");
    }
    const { chainId: chainID } = await txAuthSigner.provider.getNetwork();
    // encode function data with a fake value for the signature
    const functionCallData = await generateFunctionCallData(
      ExampleGatedNFTMinterUpgradeableABI,
      "mintNFTGated",
      [recipient, blockExpiration, "0x1234"]
    );

    // remove 96 bytes (2 bytes fake sig + 32 bytes offset + 32 bytes length + 30 bytes suffix) for the signature
    // 32 bytes for blockExpiration
    // = 128 bytes = 256 characters
    const argsWithSelector = functionCallData.slice(0, -256);

    const txAuthData = {
      functionCallData: argsWithSelector,
      contractAddress: exampleGatedNFTMinterUpgradeable.address as Address,
      userAddress: tester as Address,
      chainID,
      nonce: Number(
        await exampleGatedNFTMinterUpgradeable.getUserNonce(tester)
      ),
      blockExpiration,
    };

    // Build Wrong Values
    const wrongValues = {
      functionCallData: (
        await generateFunctionCallData(
          ExampleGatedNFTMinterUpgradeableABI,
          "mintNFTGated",
          [txAuthSigner.address, blockExpiration, "0x1234"]
        )
      ).slice(0, -256), // wrong recipient value
      contractAddress: tester as Address,
      userAddress: txAuthSigner.address as Address,
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
        await exampleGatedNFTMinterUpgradeable
          .connect(testerSigner)
          .mintNFTGated(recipient, blockExpiration, signature);
      } catch (e: unknown) {
        expect((e as Error).toString()).to.eq(
          `Error: VM Exception while processing transaction: reverted with custom error 'InvalidSignature()'`
        );
        hasReverted = true;
      }
      expect(hasReverted).to.be.true;
    }
  });
  it(`Should check that user can NOT call the ExampleGatedNFTMinterUpgradeable with an expired signature from the signer`, async () => {
    const { tester } = await getNamedAccounts();
    const [txAuthSigner, testerSigner] = await ethers.getSigners();

    // Build Signature
    const recipient = tester;
    const block = await ethers.provider.getBlock("latest");
    const blockExpiration = block.number + 50;
    if (!txAuthSigner.provider) {
      throw new Error("missing provider on signer");
    }
    const { chainId: chainID } = await txAuthSigner.provider.getNetwork();
    // encode function data with a fake value for the signature
    const functionCallData = await generateFunctionCallData(
      ExampleGatedNFTMinterUpgradeableABI,
      "mintNFTGated",
      [recipient, blockExpiration, "0x1234"]
    );

    // remove 96 bytes (2 bytes fake sig + 32 bytes offset + 32 bytes length + 30 bytes suffix) for the signature
    // 32 bytes for blockExpiration
    // = 128 bytes = 256 characters
    const argsWithSelector = functionCallData.slice(0, -256) as `0x${string}`;

    const wrongTxAuthData = {
      functionCallData: argsWithSelector,
      contractAddress: exampleGatedNFTMinterUpgradeable.address as Address,
      userAddress: tester as Address,
      chainID,
      nonce: Number(
        await exampleGatedNFTMinterUpgradeable.getUserNonce(tester)
      ),
      blockExpiration: 0,
    };

    let hasReverted = false;
    try {
      const signature = await signTxAuthData(wrongTxAuthData, txAuthSigner);

      // try to mint nft
      await exampleGatedNFTMinterUpgradeable
        .connect(testerSigner)
        .mintNFTGated(recipient, blockExpiration, signature);
    } catch (e: unknown) {
      expect((e as Error).toString()).to.eq(
        `Error: VM Exception while processing transaction: reverted with custom error 'InvalidSignature()'`
      );
      hasReverted = true;
    }
    expect(hasReverted).to.be.true;
  });
  it(`Should check that admin can change the signer`, async () => {
    const [deployer, _testerSigner, address3] = await ethers.getSigners();
    // try to mint nft
    await exampleGatedNFTMinterUpgradeable
      .connect(deployer)
      .setSigner(address3.address);

    const newSigner = await exampleGatedNFTMinterUpgradeable.signerAddress();
    expect(newSigner === address3.address).to.be.true;
  });
  it(`Should check that non-admin can NOT change the signer`, async () => {
    const [_deployer, _testerSigner, address3] = await ethers.getSigners();
    // try to mint nft
    try {
      await exampleGatedNFTMinterUpgradeable
        .connect(address3)
        .setSigner(address3.address);
    } catch (e) {
      expect((e as Error).toString().substring(0, 112)).to.eq(
        "Error: VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'"
      );
    }

    const newSigner = await exampleGatedNFTMinterUpgradeable.signerAddress();
    expect(newSigner !== address3.address).to.be.true;
  });
});
