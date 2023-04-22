import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Minechain } from '../../eth-types/src'

describe('Minechain', () => {
  const deployTokenFixture = async () => {
    const Minechain = await ethers.getContractFactory('Minechain')
    const [owner, addr1, addr2] = await ethers.getSigners()
    const minechain = (await Minechain.deploy()) as Minechain
    await minechain.deployed()
    return { Minechain, minechain, owner, addr1, addr2 }
  }

  it('Should fail if the unlockTime is not in the future', async () => {
    const { minechain, addr1 } = await loadFixture(deployTokenFixture)

    await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {value: ethers.utils.parseEther("1")})
    
    const {owner} = await minechain.tokens(1);
    expect(owner).to.equal(addr1.address);
  })
})
