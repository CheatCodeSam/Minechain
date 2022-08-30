import { ethers } from "hardhat"

async function main() {
  const minechain = await ethers.getContractFactory("Minechain")
  const deployedContract = await minechain.deploy()

  await deployedContract.deployed()

  console.log("My NFT deployed to:", deployedContract.address)
  await deployedContract.unpause()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
