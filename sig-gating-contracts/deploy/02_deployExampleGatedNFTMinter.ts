import { getNamedAccounts, ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const version = "0.2.10";
const contractName = "ExampleGatedNFTMinter";
const testEnv = "testnet";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("deployer", deployer);

  // Fetch deployed Signer Manager
  const signerManagerAddress = (await deployments.get("NexeraIDSignerManager"))
    .address;
  console.log("signerManagerAddress", signerManagerAddress);

  console.log(`\n--------------------------------------------------------`);
  console.log(`Deploying ${contractName}...`);
  console.log(`\n--------------------------------------------------------`);

  const deployResult = await deploy(contractName, {
    deterministicDeployment: ethers.utils.formatBytes32String(
      (process.env.SALT || "SALT") + contractName + version
    ),
    contract: contractName,
    from: deployer,
    args: [signerManagerAddress],
    log: true,
    waitConfirmations: network.name == "hardhat" ? 1 : 10,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });
  console.log("deployed");

  console.log("deployResult", JSON.stringify(deployResult, null, 2));

  console.log("\nDeployed " + contractName + " at " + deployResult.address);

  return true;
};

export default func;
func.id = contractName + version;
func.tags = [contractName, version, testEnv];
func.dependencies = ["NexeraIDSignerManager"];
