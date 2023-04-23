import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Minechain } from '../../eth-types/src'
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";


describe('Minechain', () => {
  const deployTokenFixture = async () => {
    const Minechain = await ethers.getContractFactory('Minechain')
    const [owner, addr1, addr2] = await ethers.getSigners()
    const minechain = (await Minechain.deploy()) as Minechain
    await minechain.deployed()
    return { Minechain, minechain, owner, addr1, addr2 }
  }

  it('should have the correct user as the token owner', async () => {
    const { minechain, addr1 } = await loadFixture(deployTokenFixture)

    await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
      value: ethers.utils.parseEther('1'),
    })

    const { owner } = await minechain.tokens(1)
    expect(owner).to.equal(addr1.address)
  })

  it('should charge 10 percent tax per year', async () => {
    const { minechain, addr1 } = await loadFixture(deployTokenFixture)

    await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
      value: ethers.utils.parseEther('1'),
    })
    await time.increase(60 * 60 * 24 * 365)

    const rent = await minechain.currentRent(1)
    expect(ethers.utils.parseEther('1').div(10)).to.equal(rent)
  })

  it('should charge 8.493 percent over a 31 day span ', async () => {
    const { minechain, addr1 } = await loadFixture(deployTokenFixture)

    await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
      value: ethers.utils.parseEther('1'),
    })
    await time.increase(60 * 60 * 24 * 31)

    const rent = await minechain.currentRent(1)
    expect(ethers.BigNumber.from('8493150684931506')).to.equal(rent)
  })

  describe('Price Change', () => {
    it('should prevent changes before cooldown', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })

      await expect(
        minechain.connect(addr1).setPriceOf(1, ethers.utils.parseEther('2'))
      ).to.be.revertedWith('Minechain: Price change cooldown not met')
    })
    it('should allow change after cooldown', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })

      const priceChangeCooldown = await minechain.priceChangeCooldown()
      await time.increase(priceChangeCooldown)
      await minechain.connect(addr1).setPriceOf(1, ethers.utils.parseEther('2'))

      const token = await minechain.tokens(1)
      expect(token.price).to.equal(ethers.utils.parseEther('2'))
    })
    it('should calculate correct average three changes', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })

      const priceChangeCooldown = await minechain.priceChangeCooldown()
      await time.increase(priceChangeCooldown)
      await minechain.connect(addr1).setPriceOf(1, ethers.utils.parseEther('2'))
      await time.increase(priceChangeCooldown)
      await minechain.connect(addr1).setPriceOf(1, ethers.utils.parseEther('3'))

      const token = await minechain.tokens(1)
      expect(token.priceChangeCount).to.equal(2)
      expect(token.cumulativePrice).to.equal(ethers.utils.parseEther('6'))
    })
    it('should calculate correct average of inital change', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })

      const token = await minechain.tokens(1)
      expect(token.priceChangeCount).to.equal(0)
      expect(token.cumulativePrice).to.equal(ethers.utils.parseEther('1'))
    })
    it('should reset change counter after buy', async () => {
      const { minechain, addr1, addr2 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })

      const priceChangeCooldown = await minechain.priceChangeCooldown()
      await time.increase(priceChangeCooldown)
      await minechain.connect(addr1).setPriceOf(1, ethers.utils.parseEther('2'))

      await minechain.connect(addr2).buy(1, ethers.utils.parseEther('5'), {
        value: ethers.utils.parseEther('2'),
      })
      await minechain
        .connect(addr2)
        .buy(1, ethers.utils.parseEther('5'), {
          value: ethers.utils.parseEther('2'),
        })

      const token = await minechain.tokens(1)
      expect(token.priceChangeCount).to.equal(0)
      expect(token.cumulativePrice).to.equal(ethers.utils.parseEther('5'))
    })
    it('should reset change counter after rent collection', async () => {
      const { minechain, addr1, addr2 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })

      const priceChangeCooldown = await minechain.priceChangeCooldown()
      await time.increase(priceChangeCooldown)
      await minechain.connect(addr1).setPriceOf(1, ethers.utils.parseEther('2'))

      await minechain.collectRent(1)

      const token = await minechain.tokens(1)
      expect(token.priceChangeCount).to.equal(0)
      expect(token.cumulativePrice).to.equal(ethers.utils.parseEther('2'))
    })
    it('should emit price changed', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })

      const priceChangeCooldown = await minechain.priceChangeCooldown()
      await time.increase(priceChangeCooldown)
      await expect(
        minechain.connect(addr1).setPriceOf(1, ethers.utils.parseEther('2'))
      )
        .to.emit(minechain, 'PriceChanged')
        .withArgs(
          addr1.address,
          1,
          ethers.utils.parseEther('1'),
          ethers.utils.parseEther('2')
        )
    })
  })
})
