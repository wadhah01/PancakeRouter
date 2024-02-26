// Import necessary modules for testing
import * as chai from "chai";
import { expect } from "chai";
import { ethers } from "hardhat";
import { IWETH } from './interfaces/IWETH.sol';
const IERC20_ABI = [
    {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    
];
const customProvider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.binance.org:443");

// Define the test suite for PancakeRouter contract
describe("PancakeRouter", function () {
    let owner;
    let user1;
    let user2;
    let pancakeRouter;
    let tokenA;
    let tokenB;
    let weth;
    let factory;

    // Placeholder for owner and normal user addresses
    const ownerAddress = "0xf0BB2eAB15a5A31231D21c99694A6f9876F5d876";
    const userAddress = "0xc70C3EC8fD497B70C8c4b094aa3D39627e531a97";

    // Deploy contracts and set up accounts before each test
    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        ethers.provider = customProvider;

        // Deploy WETH contract
        const wethAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; // Replace this with the deployed WETH contract address
        const WETH = await ethers.getContractAt("IWETH", wethAddress);
        console.log("weth Address:", wethAddress);

        // Deploy factory contract
        const factoryAddress = " 0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"; 

        // Deploy Factory contract
        console.log("Factory Address:", factoryAddress);
        const Factory = await ethers.getContractAt("IPancakeFactory", factoryAddress);
                // Deploy token contracts
        const busdAddress = "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee";
        const TokenA = new ethers.Contract(busdAddress, IERC20_ABI, ethers.provider);

// Update to use BNB token
const bnbAddress = "0x2b8ff854c5e16cf35b9a792390cc3a2a60ec9ba2";
const TokenB = new ethers.Contract(bnbAddress, IERC20_ABI, ethers.provider);

        // Deploy PancakeRouter contract
        const PancakeRouter = await ethers.getContractFactory("PancakeRouter");
        pancakeRouter = await PancakeRouter.deploy(Factory.address, WETH.address);
        await pancakeRouter.deployed();
    });

    describe("swapExactTokensForTokens", function () {
        it("should swap tokens from one to another", async function () {
            // Mint tokens to user1
            const amountIn = ethers.utils.parseEther("100");
            await tokenA.connect(owner).transfer(user1.address, amountIn);

            // Approve PancakeRouter to spend user1's tokens
            await tokenA.connect(user1).approve(pancakeRouter.address, amountIn);

            // Check owner's balance before swap
            const ownerBalanceBefore = await tokenB.balanceOf(ownerAddress);
            console.log("Owner Balance Before Swap:", ownerBalanceBefore.toString());

            // Check user's balance before swap
            const userBalanceBefore = await tokenB.balanceOf(userAddress);
            console.log("User Balance Before Swap:", userBalanceBefore.toString());

            // Swap tokens
            const amountOutMin = ethers.utils.parseEther("90");
            const path = [tokenA.address, tokenB.address];
            const deadline = Math.floor(Date.now() / 1000) + 60; // 1 minute from now
            await pancakeRouter.connect(user1).swapExactTokensForTokens(amountIn, amountOutMin, path, user2.address, deadline);

            // Check owner's balance after swap
            const ownerBalanceAfter = await tokenB.balanceOf(ownerAddress);
            console.log("Owner Balance After Swap:", ownerBalanceAfter.toString());

            // Check user's balance after swap
            const userBalanceAfter = await tokenB.balanceOf(userAddress);
            console.log("User Balance After Swap:", userBalanceAfter.toString());
        });
    });

    // Test swapTokensForExactTokens function
    describe("swapTokensForExactTokens", function () {
        it("should swap tokens from one to another", async function () {
            // Mint tokens to user1
            const amountIn = ethers.utils.parseEther("100");
            await tokenA.connect(owner).transfer(user1.address, amountIn);

            // Approve PancakeRouter to spend user1's tokens
            await tokenA.connect(user1).approve(pancakeRouter.address, amountIn);

            // Check owner's balance before swap
            const ownerBalanceBefore = await tokenB.balanceOf(ownerAddress);
            console.log("Owner Balance Before Swap:", ownerBalanceBefore.toString());

            // Check user's balance before swap
            const userBalanceBefore = await tokenB.balanceOf(userAddress);
            console.log("User Balance Before Swap:", userBalanceBefore.toString());

            // Swap tokens
            const amountOut = ethers.utils.parseEther("90");
            const amountInMax = ethers.utils.parseEther("110");
            const path = [tokenA.address, tokenB.address];
            const deadline = Math.floor(Date.now() / 1000) + 60; // 1 minute from now
            await pancakeRouter.connect(user1).swapTokensForExactTokens(amountOut, amountInMax, path, user2.address, deadline);

            // Check owner's balance after swap
            const ownerBalanceAfter = await tokenB.balanceOf(ownerAddress);
            console.log("Owner Balance After Swap:", ownerBalanceAfter.toString());

            // Check user's balance after swap
            const userBalanceAfter = await tokenB.balanceOf(userAddress);
            console.log("User Balance After Swap:", userBalanceAfter.toString());
        });
    });
});