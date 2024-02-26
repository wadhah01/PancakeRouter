import { network, run, ethers } from "hardhat";
import config from "../config";

import '@nomiclabs/hardhat-ethers';

const main = async () => {
  try {
    // Compile contracts
    await run("compile");
    console.log("Compiled contracts.");

    const networkName = network.name;
    console.log("Deploying to network:", networkName);

    const routerAddress = config.PancakeRouter[networkName];
    const wbnbAddress = config.WBNB[networkName];

    console.log("Deploying PancakeRouter..");

    // Get the ContractFactory for PancakeRouter
    const PancakeRouterFactory = await ethers.getContractFactory("PancakeRouter");
    if (!PancakeRouterFactory) {
      throw new Error("Failed to retrieve ContractFactory for PancakeRouter.");
    }

    // Deploy PancakeRouter contract with the addresses from config
    const pancakeRouter = await PancakeRouterFactory.deploy(routerAddress, wbnbAddress);
    await pancakeRouter.deployed();

    console.log("PancakeRouter deployed to:", pancakeRouter.address);

    // Get the contract instance of IWETH deployed on the network
    const iwethAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; // Replace with the actual address of IWETH
    const iweth = await ethers.getContractAt("IWETH", iwethAddress);

    // Now you can use the iweth interface to interact with the IWETH contract
  } catch (error) {
    console.error("Error deploying contracts:", error);
    process.exit(1);
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
