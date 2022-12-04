import "@nomicfoundation/hardhat-chai-matchers"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import "@typechain/hardhat"
import service from "dotenv"
import { HardhatUserConfig } from "hardhat/config"
import "solidity-coverage"

service.config()

const { API_URL, PRIVATE_KEY, ETHERSCAN_API } = process.env

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
  etherscan: {
    apiKey: ETHERSCAN_API
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
}

export default config
