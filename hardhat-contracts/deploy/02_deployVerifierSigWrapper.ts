import { getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const version = "0.1.0";
const contractName = "VerifierSigWrapper";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(`\n--------------------------------------------------------`);
  console.log(`Deploying ${contractName}...`);
  console.log(`\n--------------------------------------------------------`);

  const verifierWrapperResult = await deploy(contractName, {
    contract: contractName,
    from: deployer,
    log: true,
    // Will be enabled when refactored into a factory
    skipIfAlreadyDeployed: false,
    nonce: "pending",
    waitConfirmations: 1,
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  });
  console.log(
    "\nDeployed " + contractName + " at " + verifierWrapperResult.address
  );

  return true;
};

export default func;
func.id = contractName + version;
func.tags = [contractName, version];
