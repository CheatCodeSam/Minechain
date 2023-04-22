import { ethers } from 'hardhat'

async function main() {
  const Minechain = await ethers.getContractFactory('Minechain')
  const minechain = await Minechain.deploy()

  await minechain.deployed()

  console.log(`Minechain deployed to ${minechain.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
