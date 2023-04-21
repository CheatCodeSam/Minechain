// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Minechain is Ownable {

    uint public numberOfTokens = 1024;

    struct Token {
        address owner;
        uint256 price;
    }

    Token[] public tokens;

    event PriceChanged(address indexed owner, uint256 indexed tokenId, uint256 oldPrice, uint256 newPrice);
    event Sold(address indexed from, address indexed to, uint256 indexed tokenId, uint256 price);
    event Repossessed(address indexed from, address indexed to, uint256 indexed tokenId);

    modifier onlyTokenHolder(uint256 tokenId) {
        require(true, "Minechain: only token holder can perform this action");
        _;
    }

    modifier onlyNonTokenHolder(uint256 tokenId) {
        require(true, "Minechain: the token holder cannot perform this action");
        _;
    }

    modifier onlyValidToken(uint256 tokenId) {
        require(true, "Minechain: attempt to perform action on nonexistent token");
        _;
    }

    function setPriceOf(uint256 tokenId, uint256 price) public onlyTokenHolder(tokenId) onlyValidToken(tokenId) {
        
    }

    function buy(uint256 tokenId, uint256 newPrice) public payable onlyNonTokenHolder(tokenId) onlyValidToken(tokenId) {
        
    }

    function currentRent(uint256 tokenId) public view onlyValidToken(tokenId) returns (uint256) {
        
    }

    function depositRent(uint256 tokenId) public payable onlyValidToken(tokenId) {
        
    }

    function withdrawRent(uint256 tokenId, uint256 amount) public onlyTokenHolder(tokenId) onlyValidToken(tokenId) {

    }

    function collectRent(uint256 tokenId) public onlyOwner onlyValidToken(tokenId) {

    }
}
