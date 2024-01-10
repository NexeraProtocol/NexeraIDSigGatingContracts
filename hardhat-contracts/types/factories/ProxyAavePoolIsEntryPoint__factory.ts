/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ProxyAavePoolIsEntryPoint,
  ProxyAavePoolIsEntryPointInterface,
} from "../ProxyAavePoolIsEntryPoint";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "scenarioVerifierAddress",
        type: "address",
      },
    ],
    name: "ScenarioVerifierAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "scenarioVerifierAddress",
        type: "address",
      },
    ],
    name: "ScenarioVerifierDeleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "scenarioVerifierAddress",
        type: "address",
      },
    ],
    name: "ScenarioVerifierDisabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "scenarioVerifierAddress",
        type: "address",
      },
    ],
    name: "ScenarioVerifierEnabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldScenarioVerifierAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newScenarioVerifierAddress",
        type: "address",
      },
    ],
    name: "ScenarioVerifierUpdated",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "aavePoolAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "scenarioVerifierAddress",
        type: "address",
      },
    ],
    name: "addScenarioVerifier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "scenarioVerifierAddress",
        type: "address",
      },
    ],
    name: "deleteScenarioVerifier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "scenarioVerifierAddress",
        type: "address",
      },
    ],
    name: "disableScenario",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "scenarioVerifierAddress",
        type: "address",
      },
    ],
    name: "enableScenario",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "scenarioVerifierAddress",
        type: "address",
      },
    ],
    name: "getIsScenarioEnabled",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getScenarioVerifierAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "isAllowedForEntrypoint",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "supply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "referralCode",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "permitV",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "permitR",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "permitS",
        type: "bytes32",
      },
    ],
    name: "supplyWithPermit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "oldScenarioVerifierAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "newScenarioVerifierAddress",
        type: "address",
      },
    ],
    name: "updateScenarioVerifier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5062000032620000266200004860201b60201c565b6200005060201b60201c565b620000426200011560201b60201c565b620002bf565b600033905090565b60008060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600060026101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600060019054906101000a900460ff161562000168576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200015f9062000262565b60405180910390fd5b60ff801660008054906101000a900460ff1660ff1614620001d95760ff6000806101000a81548160ff021916908360ff1602179055507f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249860ff604051620001d09190620002a2565b60405180910390a15b565b600082825260208201905092915050565b7f496e697469616c697a61626c653a20636f6e747261637420697320696e69746960008201527f616c697a696e6700000000000000000000000000000000000000000000000000602082015250565b60006200024a602783620001db565b91506200025782620001ec565b604082019050919050565b600060208201905081810360008301526200027d816200023b565b9050919050565b600060ff82169050919050565b6200029c8162000284565b82525050565b6000602082019050620002b9600083018462000291565b92915050565b611b2f80620002cf6000396000f3fe6080604052600436106100ec5760003560e01c80638b7458c61161008a578063d1a2851d11610059578063d1a2851d14610328578063da872ffa14610365578063ee567cd91461038e578063f2fde38b146103b9576100fb565b80638b7458c61461025a5780638da5cb5b14610297578063b347e741146102c2578063c4d66de8146102ff576100fb565b80633288c682116100c65780633288c682146101c8578063715018a6146101f157806386ba2519146102085780638b2a4df514610231576100fb565b8063010f25d71461014d5780630192e6c81461017657806302c205f01461019f576100fb565b366100fb576100f96103e2565b005b610104336103fc565b610143576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161013a906112d1565b60405180910390fd5b61014b6104d7565b005b34801561015957600080fd5b50610174600480360381019061016f9190611354565b61057f565b005b34801561018257600080fd5b5061019d60048036038101906101989190611394565b61061e565b005b3480156101ab57600080fd5b506101c660048036038101906101c191906114a0565b6106b6565b005b3480156101d457600080fd5b506101ef60048036038101906101ea9190611394565b610710565b005b3480156101fd57600080fd5b506102066107a8565b005b34801561021457600080fd5b5061022f600480360381019061022a9190611394565b6107bc565b005b34801561023d57600080fd5b5061025860048036038101906102539190611556565b610887565b005b34801561026657600080fd5b50610281600480360381019061027c9190611394565b6108dc565b60405161028e91906115c4565b60405180910390f35b3480156102a357600080fd5b506102ac610906565b6040516102b991906115ee565b60405180910390f35b3480156102ce57600080fd5b506102e960048036038101906102e49190611394565b6103fc565b6040516102f691906115c4565b60405180910390f35b34801561030b57600080fd5b5061032660048036038101906103219190611394565b61092f565b005b34801561033457600080fd5b5061034f600480360381019061034a9190611609565b610a6f565b60405161035c91906115ee565b60405180910390f35b34801561037157600080fd5b5061038c60048036038101906103879190611394565b610a83565b005b34801561039a57600080fd5b506103a3610b25565b6040516103b091906115ee565b60405180910390f35b3480156103c557600080fd5b506103e060048036038101906103db9190611394565b610b3d565b005b6103ea610bc0565b6103fa6103f5610bc2565b610bde565b565b60008060019050600061040f6001610c04565b905060008151905060005b818110156104cb5782818151811061043557610434611636565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1663398cfb76876040518263ffffffff1660e01b815260040161047591906115ee565b602060405180830381865afa158015610492573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104b69190611691565b935083156104cb57808060010191505061041a565b50829350505050919050565b600073cc6114b983e4ed2737e9bd3961c9924e6216c7049050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361055f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105569061170a565b60405180910390fd5b61057c73cc6114b983e4ed2737e9bd3961c9924e6216c704610bde565b50565b610587610c25565b61059082610ca3565b6105cf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105c69061179c565b60405180910390fd5b6105d882610a83565b6105e1816107bc565b7f7e895ef684dc2bc346da08dc2f907aee03d3f2fbaf9634e53d9c848081e354bc82826040516106129291906117bc565b60405180910390a15050565b610626610c25565b61062f81610ca3565b61066e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106659061179c565b60405180910390fd5b61067b6003826001610cb7565b507f18694eb16874b3190b87ff4555f9e0bf11824582bbff638dbf1cf695c9ead06d816040516106ab91906115ee565b60405180910390a150565b6106bf336103fc565b6106fe576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106f5906112d1565b60405180910390fd5b6107066104d7565b5050505050505050565b610718610c25565b61072181610ca3565b610760576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107579061179c565b60405180910390fd5b61076d6003826000610cb7565b507fc24ce0afc93b75393d529101473eace78db706e505db6dff99f36a6098b6527f8160405161079d91906115ee565b60405180910390a150565b6107b0610c25565b6107ba6000610cec565b565b6107c4610c25565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610833576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161082a90611857565b60405180910390fd5b61083e600182610db1565b5061084c6003826001610cb7565b507f9cb35b4d87a29c981b43fe2b083241b12e94b901ee8278d73d81ce7dc3180ac78160405161087c91906115ee565b60405180910390a150565b610890336103fc565b6108cf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108c6906112d1565b60405180910390fd5b6108d76104d7565b505050565b60008060006108ec600385610de1565b915091508180156108fd5750600181145b92505050919050565b60008060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60008060019054906101000a900460ff161590508080156109605750600160008054906101000a900460ff1660ff16105b8061098d575061096f30610e23565b15801561098c5750600160008054906101000a900460ff1660ff16145b5b6109cc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109c3906118e9565b60405180910390fd5b60016000806101000a81548160ff021916908360ff1602179055508015610a09576001600060016101000a81548160ff0219169083151502179055505b610a1282610cec565b8015610a6b5760008060016101000a81548160ff0219169083151502179055507f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024986001604051610a62919061194e565b60405180910390a15b5050565b6000610a7c600183610e46565b9050919050565b610a8b610c25565b610a9481610ca3565b610ad3576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aca9061179c565b60405180910390fd5b610ade600182610e60565b50610aea600382610e90565b507f6d2f0e1df68c030383a28d88dd5c68415e7a6546fbe379c429b28b5cc9339e0c81604051610b1a91906115ee565b60405180910390a150565b73cc6114b983e4ed2737e9bd3961c9924e6216c70481565b610b45610c25565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610bb4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bab906119db565b60405180910390fd5b610bbd81610cec565b50565b565b600073cc6114b983e4ed2737e9bd3961c9924e6216c704905090565b3660008037600080366000845af43d6000803e8060008114610bff573d6000f35b3d6000fd5b60606000610c1483600001610ec0565b905060608190508092505050919050565b610c2d610f1c565b73ffffffffffffffffffffffffffffffffffffffff16610c4b610906565b73ffffffffffffffffffffffffffffffffffffffff1614610ca1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c9890611a47565b60405180910390fd5b565b6000610cb0600183610f24565b9050919050565b6000610ce3846000018473ffffffffffffffffffffffffffffffffffffffff1660001b8460001b610f54565b90509392505050565b60008060029054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600060026101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000610dd9836000018373ffffffffffffffffffffffffffffffffffffffff1660001b610f8f565b905092915050565b600080600080610e0d866000018673ffffffffffffffffffffffffffffffffffffffff1660001b610fff565b91509150818160001c9350935050509250929050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b6000610e55836000018361104e565b60001c905092915050565b6000610e88836000018373ffffffffffffffffffffffffffffffffffffffff1660001b611079565b905092915050565b6000610eb8836000018373ffffffffffffffffffffffffffffffffffffffff1660001b61118d565b905092915050565b606081600001805480602002602001604051908101604052809291908181526020018280548015610f1057602002820191906000526020600020905b815481526020019060010190808311610efc575b50505050509050919050565b600033905090565b6000610f4c836000018373ffffffffffffffffffffffffffffffffffffffff1660001b6111c6565b905092915050565b60008184600201600085815260200190815260200160002081905550610f8683856000016111e990919063ffffffff16565b90509392505050565b6000610f9b83836111c6565b610ff4578260000182908060018154018082558091505060019003906000526020600020016000909190919091505582600001805490508360010160008481526020019081526020016000208190555060019050610ff9565b600090505b92915050565b60008060008460020160008581526020019081526020016000205490506000801b810361103e576110308585611200565b6000801b9250925050611047565b60018192509250505b9250929050565b600082600001828154811061106657611065611636565b5b9060005260206000200154905092915050565b600080836001016000848152602001908152602001600020549050600081146111815760006001826110ab9190611a96565b90506000600186600001805490506110c39190611a96565b90508181146111325760008660000182815481106110e4576110e3611636565b5b906000526020600020015490508087600001848154811061110857611107611636565b5b90600052602060002001819055508387600101600083815260200190815260200160002081905550505b8560000180548061114657611145611aca565b5b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050611187565b60009150505b92915050565b6000826002016000838152602001908152602001600020600090556111be828460000161122090919063ffffffff16565b905092915050565b600080836001016000848152602001908152602001600020541415905092915050565b60006111f88360000183610f8f565b905092915050565b6000611218828460000161123790919063ffffffff16565b905092915050565b600061122f8360000183611079565b905092915050565b600061124683600001836111c6565b905092915050565b600082825260208201905092915050565b7f4e65786572612056657269666965723a2053656e646572206973206e6f74207660008201527f6572696669656400000000000000000000000000000000000000000000000000602082015250565b60006112bb60278361124e565b91506112c68261125f565b604082019050919050565b600060208201905081810360008301526112ea816112ae565b9050919050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611321826112f6565b9050919050565b61133181611316565b811461133c57600080fd5b50565b60008135905061134e81611328565b92915050565b6000806040838503121561136b5761136a6112f1565b5b60006113798582860161133f565b925050602061138a8582860161133f565b9150509250929050565b6000602082840312156113aa576113a96112f1565b5b60006113b88482850161133f565b91505092915050565b6000819050919050565b6113d4816113c1565b81146113df57600080fd5b50565b6000813590506113f1816113cb565b92915050565b600061ffff82169050919050565b61140e816113f7565b811461141957600080fd5b50565b60008135905061142b81611405565b92915050565b600060ff82169050919050565b61144781611431565b811461145257600080fd5b50565b6000813590506114648161143e565b92915050565b6000819050919050565b61147d8161146a565b811461148857600080fd5b50565b60008135905061149a81611474565b92915050565b600080600080600080600080610100898b0312156114c1576114c06112f1565b5b60006114cf8b828c0161133f565b98505060206114e08b828c016113e2565b97505060406114f18b828c0161133f565b96505060606115028b828c0161141c565b95505060806115138b828c016113e2565b94505060a06115248b828c01611455565b93505060c06115358b828c0161148b565b92505060e06115468b828c0161148b565b9150509295985092959890939650565b60008060006060848603121561156f5761156e6112f1565b5b600061157d8682870161133f565b935050602061158e868287016113e2565b925050604061159f8682870161133f565b9150509250925092565b60008115159050919050565b6115be816115a9565b82525050565b60006020820190506115d960008301846115b5565b92915050565b6115e881611316565b82525050565b600060208201905061160360008301846115df565b92915050565b60006020828403121561161f5761161e6112f1565b5b600061162d848285016113e2565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b61166e816115a9565b811461167957600080fd5b50565b60008151905061168b81611665565b92915050565b6000602082840312156116a7576116a66112f1565b5b60006116b58482850161167c565b91505092915050565b7f496d706c656d656e746174696f6e2061646472657373206e6f74207365740000600082015250565b60006116f4601e8361124e565b91506116ff826116be565b602082019050919050565b60006020820190508181036000830152611723816116e7565b9050919050565b7f4e65786572612056657269666965723a205363656e6172696f2056657269666960008201527f6572204164647265737320646f65736e27742065786973740000000000000000602082015250565b600061178660388361124e565b91506117918261172a565b604082019050919050565b600060208201905081810360008301526117b581611779565b9050919050565b60006040820190506117d160008301856115df565b6117de60208301846115df565b9392505050565b7f496e707574205363656e6172696f20616464726573732063616e6e6f7420626560008201527f20746865207a65726f2061646472657373000000000000000000000000000000602082015250565b600061184160318361124e565b915061184c826117e5565b604082019050919050565b6000602082019050818103600083015261187081611834565b9050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b60006118d3602e8361124e565b91506118de82611877565b604082019050919050565b60006020820190508181036000830152611902816118c6565b9050919050565b6000819050919050565b6000819050919050565b600061193861193361192e84611909565b611913565b611431565b9050919050565b6119488161191d565b82525050565b6000602082019050611963600083018461193f565b92915050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b60006119c560268361124e565b91506119d082611969565b604082019050919050565b600060208201905081810360008301526119f4816119b8565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000611a3160208361124e565b9150611a3c826119fb565b602082019050919050565b60006020820190508181036000830152611a6081611a24565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000611aa1826113c1565b9150611aac836113c1565b9250828203905081811115611ac457611ac3611a67565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fdfea2646970667358221220e4e72ac919a87beaf83c28ca8e82674eaa16fbb335bff2afb91a789ee3fc530364736f6c63430008100033";

export class ProxyAavePoolIsEntryPoint__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ProxyAavePoolIsEntryPoint> {
    return super.deploy(overrides || {}) as Promise<ProxyAavePoolIsEntryPoint>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ProxyAavePoolIsEntryPoint {
    return super.attach(address) as ProxyAavePoolIsEntryPoint;
  }
  connect(signer: Signer): ProxyAavePoolIsEntryPoint__factory {
    return super.connect(signer) as ProxyAavePoolIsEntryPoint__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ProxyAavePoolIsEntryPointInterface {
    return new utils.Interface(_abi) as ProxyAavePoolIsEntryPointInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ProxyAavePoolIsEntryPoint {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ProxyAavePoolIsEntryPoint;
  }
}
