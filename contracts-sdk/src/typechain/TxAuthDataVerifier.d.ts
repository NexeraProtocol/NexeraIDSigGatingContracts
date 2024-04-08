/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface TxAuthDataVerifierInterface extends ethers.utils.Interface {
  functions: {
    "getMessageHash((uint256,uint256,uint256,address,address,bytes))": FunctionFragment;
    "getUserNonce(address)": FunctionFragment;
    "nonces(address)": FunctionFragment;
    "signerAddress()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getMessageHash",
    values: [
      {
        chainID: BigNumberish;
        nonce: BigNumberish;
        blockExpiration: BigNumberish;
        contractAddress: string;
        userAddress: string;
        functionCallData: BytesLike;
      }
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserNonce",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "nonces", values: [string]): string;
  encodeFunctionData(
    functionFragment: "signerAddress",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "getMessageHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserNonce",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "nonces", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "signerAddress",
    data: BytesLike
  ): Result;

  events: {
    "NexeraIDSignatureVerified(uint256,uint256,uint256,address,address,bytes)": EventFragment;
    "SignerChanged(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "NexeraIDSignatureVerified"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SignerChanged"): EventFragment;
}

export type NexeraIDSignatureVerifiedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, string, string, string] & {
    chainID: BigNumber;
    nonce: BigNumber;
    blockExpiration: BigNumber;
    contractAddress: string;
    userAddress: string;
    functionCallData: string;
  }
>;

export type SignerChangedEvent = TypedEvent<[string] & { newSigner: string }>;

export class TxAuthDataVerifier extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: TxAuthDataVerifierInterface;

  functions: {
    getMessageHash(
      _txAuthData: {
        chainID: BigNumberish;
        nonce: BigNumberish;
        blockExpiration: BigNumberish;
        contractAddress: string;
        userAddress: string;
        functionCallData: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<[string]>;

    getUserNonce(user: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    nonces(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    signerAddress(overrides?: CallOverrides): Promise<[string]>;
  };

  getMessageHash(
    _txAuthData: {
      chainID: BigNumberish;
      nonce: BigNumberish;
      blockExpiration: BigNumberish;
      contractAddress: string;
      userAddress: string;
      functionCallData: BytesLike;
    },
    overrides?: CallOverrides
  ): Promise<string>;

  getUserNonce(user: string, overrides?: CallOverrides): Promise<BigNumber>;

  nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  signerAddress(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    getMessageHash(
      _txAuthData: {
        chainID: BigNumberish;
        nonce: BigNumberish;
        blockExpiration: BigNumberish;
        contractAddress: string;
        userAddress: string;
        functionCallData: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<string>;

    getUserNonce(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    signerAddress(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "NexeraIDSignatureVerified(uint256,uint256,uint256,address,address,bytes)"(
      chainID?: null,
      nonce?: null,
      blockExpiration?: null,
      contractAddress?: null,
      userAddress?: null,
      functionCallData?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber, string, string, string],
      {
        chainID: BigNumber;
        nonce: BigNumber;
        blockExpiration: BigNumber;
        contractAddress: string;
        userAddress: string;
        functionCallData: string;
      }
    >;

    NexeraIDSignatureVerified(
      chainID?: null,
      nonce?: null,
      blockExpiration?: null,
      contractAddress?: null,
      userAddress?: null,
      functionCallData?: null
    ): TypedEventFilter<
      [BigNumber, BigNumber, BigNumber, string, string, string],
      {
        chainID: BigNumber;
        nonce: BigNumber;
        blockExpiration: BigNumber;
        contractAddress: string;
        userAddress: string;
        functionCallData: string;
      }
    >;

    "SignerChanged(address)"(
      newSigner?: string | null
    ): TypedEventFilter<[string], { newSigner: string }>;

    SignerChanged(
      newSigner?: string | null
    ): TypedEventFilter<[string], { newSigner: string }>;
  };

  estimateGas: {
    getMessageHash(
      _txAuthData: {
        chainID: BigNumberish;
        nonce: BigNumberish;
        blockExpiration: BigNumberish;
        contractAddress: string;
        userAddress: string;
        functionCallData: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserNonce(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    nonces(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    signerAddress(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getMessageHash(
      _txAuthData: {
        chainID: BigNumberish;
        nonce: BigNumberish;
        blockExpiration: BigNumberish;
        contractAddress: string;
        userAddress: string;
        functionCallData: BytesLike;
      },
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserNonce(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nonces(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    signerAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
