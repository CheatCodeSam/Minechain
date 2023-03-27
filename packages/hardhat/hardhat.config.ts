import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  typechain: {
    outDir: "../eth-types/src/lib/types",
    target: "ethers-v5"
  },
  paths: {
    cache: "../../dist/hardhat/cache",
    artifacts: "../../dist/hardhat/artifacts"
  },
};

export default config;
