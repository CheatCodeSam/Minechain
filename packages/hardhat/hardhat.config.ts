import "@nomiclabs/hardhat-ethers"
import "@typechain/hardhat"
import { HardhatUserConfig } from "hardhat/config"
import "solidity-coverage"

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  typechain: {
    outDir: "../../dist/hardhat/types",
    target: "ethers-v5"
  },
  paths: {
    cache: "../../dist/hardhat/cache",
    artifacts: "../../dist/hardhat/artifacts"
  }
}

export default config
