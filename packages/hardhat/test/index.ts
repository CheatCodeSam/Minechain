import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"

describe("Minechain Contract", () => {
  const deployTokenFixture = async () => {
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
  it("Shouldn't have over 1024 items.", async () => {
    const { hardhatToken, owner } = await loadFixture(deployTokenFixture)

    await hardhatToken.unpause()

    await expect(
      hardhatToken.safeMint(owner.address, 1024, { value: ethers.utils.parseEther("1") })
    ).to.be.revertedWith("Invalid Token Id.")
  })
  it("Should mint token 1023.", async () => {
    const { hardhatToken, owner } = await loadFixture(deployTokenFixture)

    expect(await hardhatToken.balanceOf(owner.address)).to.equal(0)

    await hardhatToken.unpause()
    await hardhatToken.safeMint(owner.address, 1023, { value: ethers.utils.parseEther("1") })

    expect(await hardhatToken.ownerOf(1023)).to.equal(owner.address)
    expect(await hardhatToken.balanceOf(owner.address)).to.equal(1)
  })
  it("Shouldn't mint twice", async () => {
    const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture)

    await hardhatToken.unpause()

    hardhatToken.safeMint(owner.address, 0, { value: ethers.utils.parseEther("1") })

    await expect(
      hardhatToken
        .connect(addr1)
        .safeMint(addr1.address, 0, { value: ethers.utils.parseEther("1") })
    ).to.be.revertedWith("ERC721: token already minted")
  })
  it("Should generate CID", async () => {
    const { hardhatToken, owner } = await loadFixture(deployTokenFixture)

    await hardhatToken.unpause()

    await hardhatToken.safeMint(owner.address, 0, { value: ethers.utils.parseEther("1") })

    expect(await hardhatToken.tokenURI(0)).to.equal(
      "ipfs://bafybeigysqfreudx7htimkhafviv6yjycuxee7mb263t3mljjnza4qn2be/0"
    )
  })
})
