// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Minechain is ERC721, Pausable, Ownable {
  uint256 public mintRate = 0.01 ether;
  uint256 public MAX_SUPPLY = 1024;

  constructor() ERC721("Minechain", "MNCHN") {
    pause();
  }

  function _baseURI() internal pure override returns (string memory) {
    return "ipfs://bafybeigysqfreudx7htimkhafviv6yjycuxee7mb263t3mljjnza4qn2be/";
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function safeMint(address to, uint256 tokenId) public payable {
    require(msg.value >= mintRate, "Not Enough ether to mint.");
    require(tokenId < MAX_SUPPLY, "Invalid Token Id.");

    _safeMint(to, tokenId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override whenNotPaused {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
