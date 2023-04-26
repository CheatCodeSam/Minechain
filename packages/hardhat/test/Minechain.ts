import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
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
  describe('Tax Amount', () => {
    it('should charge 10 percent tax per year', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })
      await time.increase(60 * 60 * 24 * 365)

      const rent = await minechain.currentRent(1)
      expect(ethers.utils.parseEther('1').div(10)).to.equal(rent)
    })

    it('should charge 8.493 percent over a 31 day span', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })
      await time.increase(60 * 60 * 24 * 31)

      const rent = await minechain.currentRent(1)
      expect(ethers.BigNumber.from('8493150684931506')).to.equal(rent)
    })

    it('should correctly calculate average price after three price changes', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })

      const yearFromNow = (await time.latest()) + 60 * 60 * 24 * 365

      const priceChangeCooldown = await minechain.priceChangeCooldown()
      await time.increase(priceChangeCooldown)
      await minechain.connect(addr1).setPriceOf(1, ethers.utils.parseEther('2'))
      await time.increase(priceChangeCooldown)
      await minechain.connect(addr1).setPriceOf(1, ethers.utils.parseEther('3'))

      await time.increaseTo(yearFromNow)

      const rent = await minechain.currentRent(1)
      expect(ethers.utils.parseEther('0.2')).to.equal(rent)
    })
  })
  describe('Deposit', () => {
    it('should correctly deposit the one ether', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: 0,
      })

      await minechain
        .connect(addr1)
        .depositRent(1, { value: ethers.utils.parseEther('1') })

      const token = await minechain.tokens(1)
      expect(token.deposit).to.equal(ethers.utils.parseEther('1'))
    })
    it('should correctly add an ether to an initial deposit of one ether', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })

      await minechain
        .connect(addr1)
        .depositRent(1, { value: ethers.utils.parseEther('1') })

      const token = await minechain.tokens(1)
      expect(token.deposit).to.equal(ethers.utils.parseEther('2'))
    })
    it('should correctly add an ether to a deposit of one ether', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: 0,
      })

      await minechain
        .connect(addr1)
        .depositRent(1, { value: ethers.utils.parseEther('1') })
      await minechain
        .connect(addr1)
        .depositRent(1, { value: ethers.utils.parseEther('1') })

      const token = await minechain.tokens(1)
      expect(token.deposit).to.equal(ethers.utils.parseEther('2'))
    })
  })
  describe('Withdrawl', () => {
    it('should withdrawl all of one eth deposit', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })

      await minechain
        .connect(addr1)
        .withdrawRent(1, ethers.utils.parseEther('1'))

      const token = await minechain.tokens(1)
      expect(token.deposit).to.equal(0)
    })

    it('should withdrawl half of one eth deposit', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })

      const halfOfEth = ethers.utils.parseEther('1').div(2)
      await minechain.connect(addr1).withdrawRent(1, halfOfEth)

      const token = await minechain.tokens(1)
      expect(token.deposit).to.equal(halfOfEth)
    })

    it('should withdrawl 25% of one eth deposit', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })

      const twentyFivePercentOfEth = ethers.utils
        .parseEther('1')
        .mul(25)
        .div(100)
      await minechain.connect(addr1).withdrawRent(1, twentyFivePercentOfEth)

      const seventyFivePercentOfEth = ethers.utils
        .parseEther('1')
        .mul(75)
        .div(100)
      const token = await minechain.tokens(1)
      expect(token.deposit).to.equal(seventyFivePercentOfEth)
    })

    it('should not withdrawl one eth from a 0.5 eth deposit', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('0.5'),
      })

      await expect(
        minechain.connect(addr1).withdrawRent(1, ethers.utils.parseEther('1'))
      ).to.revertedWith('Minechain: Requested amount is higher than deposit')
    })

    it('should not allow withdrawl from non-token holder', async () => {
      const { minechain, addr1, addr2 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })

      await expect(
        minechain.connect(addr2).withdrawRent(1, ethers.utils.parseEther('1'))
      ).to.revertedWith('Minechain: only token holder can perform this action')
    })

    it('should not allow withdrawl from invalid token', async () => {
      const { minechain, addr1, addr2 } = await loadFixture(deployTokenFixture)

      await expect(
        minechain.withdrawRent(10000, ethers.utils.parseEther('1'))
      ).to.revertedWith(
        'Minechain: attempt to perform action on nonexistent token'
      )
    })
  })
  describe('Buy', () => {
    it('should have the correct user as the token owner', async () => {
      const { minechain, addr1 } = await loadFixture(deployTokenFixture)

      await minechain.connect(addr1).buy(1, ethers.utils.parseEther('1'), {
        value: ethers.utils.parseEther('1'),
      })

      const { owner } = await minechain.tokens(1)
      expect(owner).to.equal(addr1.address)
    })

    it('should not allow token holder to purchase token', async () => {})
    it('should deny purchase with wrong buy amount', async () => {})
    it('should payout to previous owner', async () => {})
    it('should apply tax to previous owner before sending payout', async () => {})
    it('should collect tax from payment if previous owner does not have sufficient deposit', async () => {})
    it('should forgive partial tax if payment and deposit cannot cover tax', async () => {})
    it('should transfer ownership after purchase', async () => {})
    it('should emit sold event', async () => {})

  })
  describe('Collect', () => {})
})
