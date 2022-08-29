import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("Minechain Contract", () => {
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory("Minechain")
    const [owner, addr1, addr2] = await ethers.getSigners()

    const hardhatToken = await Token.deploy()

    await hardhatToken.deployed()

    return { Token, hardhatToken, owner, addr1, addr2 }
  }
  it("Should deploy.", async () => {
    const { hardhatToken } = await loadFixture(deployTokenFixture)

    const tokenName = await hardhatToken.name()
    expect(tokenName).to.equal("Minechain")
  })
  it("Should shouldn't mint while paused.", async () => {
    const { hardhatToken, addr1 } = await loadFixture(deployTokenFixture)
    await expect(
      hardhatToken
        .connect(addr1)
        .safeMint(addr1.address, 0, { value: ethers.utils.parseEther("1") })
    ).to.be.revertedWith("Pausable: paused")
  })
  it("Should mint after unpaused.", async () => {
    const { hardhatToken, owner } = await loadFixture(deployTokenFixture)

    expect(await hardhatToken.balanceOf(owner.address)).to.equal(0)

    await hardhatToken.unpause()
    await hardhatToken.safeMint(owner.address, 0, { value: ethers.utils.parseEther("1") })

    expect(await hardhatToken.ownerOf(0)).to.equal(owner.address)
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1)
  })
})
