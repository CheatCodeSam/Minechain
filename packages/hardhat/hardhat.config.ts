import "@nomicfoundation/hardhat-chai-matchers"
import "@nomiclabs/hardhat-ethers"
import "@typechain/hardhat"
import "hardhat-abi-exporter"
import { HardhatUserConfig } from "hardhat/config"
import "solidity-coverage"

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  typechain: {
    outDir: "../abi-typings/src/lib/types",
    target: "ethers-v5"
  },
  paths: {
    cache: "../../dist/hardhat/cache",
    artifacts: "../../dist/hardhat/artifacts"
  },
  networks: {
    hardhat: {
      chainId: 1337
    }
  },
  abiExporter: {
    path: "../abi-typings/src/lib",
    runOnCompile: true,
    clear: true,
    format: "json",
    flat: true,
    only: [":Minechain$"]
  }
}

export default config
