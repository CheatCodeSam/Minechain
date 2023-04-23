// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Minechain is Ownable {
    uint256 public constant numberOfTokens = 1024;
    uint256 public constant priceChangeCooldown = 3 days;
    uint256 public constant taxRateInPercent = 10;
    uint256 public constant taxPeriod = 365 days;

    struct Token {
        address owner;
        uint256 price;
        uint256 deposit;
        uint256 lastTaxPaidDate;
        uint256 lastPriceChangeDate;
        uint256 cumulativePrice;
        uint256 priceChangeCount;
    }

    mapping(uint256 => Token) public tokens;

    event PriceChanged(
        address indexed owner,
        uint256 indexed tokenId,
        uint256 oldPrice,
        uint256 newPrice
    );
    event Sold(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId,
        uint256 price
    );
    event Repossessed(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    modifier onlyTokenHolder(uint256 tokenId) {
        require(
            msg.sender == tokens[tokenId].owner,
            'Minechain: only token holder can perform this action'
        );
        _;
    }

    modifier onlyNonTokenHolder(uint256 tokenId) {
        require(
            msg.sender != tokens[tokenId].owner,
            'Minechain: only non-token holders can perform this action'
        );
        _;
    }

    modifier onlyValidToken(uint256 tokenId) {
        require(
            tokenId < numberOfTokens,
            'Minechain: attempt to perform action on nonexistent token'
        );
        _;
    }

    function calculateTaxAmount(Token storage token) internal view returns (uint256) {
        uint256 holdingDuration = block.timestamp - token.lastTaxPaidDate;
        uint256 averagePrice = (token.cumulativePrice) / (token.priceChangeCount + 1);
        uint256 taxAmount = (averagePrice * taxRateInPercent * holdingDuration) / (100 * taxPeriod);
        return taxAmount;
    }

    function setPriceOf(
        uint256 tokenId,
        uint256 price
    ) public onlyTokenHolder(tokenId) onlyValidToken(tokenId) {
        Token storage token = tokens[tokenId];

        require(
            block.timestamp >= token.lastPriceChangeDate + priceChangeCooldown,
            'Minechain: Price change cooldown not met'
        );

        uint256 oldPrice = token.price;

        token.cumulativePrice += price;
        token.priceChangeCount += 1;

        token.price = price;
        token.lastPriceChangeDate = block.timestamp;

        emit PriceChanged(token.owner, tokenId, oldPrice, price);
    }

    function buy(
        uint256 tokenId,
        uint256 newPrice
    ) public payable onlyNonTokenHolder(tokenId) onlyValidToken(tokenId) {
        Token storage token = tokens[tokenId];

        require(msg.value >= token.price, 'Minechain: Insufficient payment');

        uint256 outstandingTax = calculateTaxAmount(token);
        uint256 payment = token.deposit + token.price;
        if (outstandingTax < payment) {
            payment -= outstandingTax;
        } else {
            payment = 0;
        }

        address previousOwner = token.owner;
        token.owner = msg.sender;
        token.deposit = msg.value - token.price;
        token.lastTaxPaidDate = block.timestamp;

        token.cumulativePrice = newPrice;
        token.priceChangeCount = 0;
        token.price = newPrice;
        token.lastPriceChangeDate = block.timestamp;

        (bool success, ) = previousOwner.call{value: payment}('');
        require(success, 'Minechain: Transfer failed');

        emit Sold(previousOwner, msg.sender, tokenId, newPrice);
    }

    function currentRent(
        uint256 tokenId
    ) public view onlyValidToken(tokenId) returns (uint256) {
        Token storage token = tokens[tokenId];
        return calculateTaxAmount(token);
    }

    function depositRent(
        uint256 tokenId
    ) public payable onlyValidToken(tokenId) {
        Token storage token = tokens[tokenId];
        token.deposit += msg.value;
    }

    function withdrawRent(
        uint256 tokenId,
        uint256 amount
    ) public onlyTokenHolder(tokenId) onlyValidToken(tokenId) {
        Token storage token = tokens[tokenId];
        token.deposit -= amount;
        payable(msg.sender).transfer(amount);
    }

    function collectRent(
        uint256 tokenId
    ) public onlyOwner onlyValidToken(tokenId) {
        Token storage token = tokens[tokenId];
        uint256 outstandingTax = calculateTaxAmount(token);

        if (token.deposit >= outstandingTax) {
            token.deposit -= outstandingTax;
            token.lastTaxPaidDate = block.timestamp;
            token.lastPriceChangeDate = block.timestamp;
            token.cumulativePrice = token.price;
            token.priceChangeCount = 0;
        } else {
            if (token.deposit > 0) {
                payable(token.owner).transfer(token.deposit);
                token.deposit = 0;
            }
            address previousOwner = token.owner;
            token.owner = address(0);
            token.price = 0;
            token.lastTaxPaidDate = block.timestamp;
            token.lastPriceChangeDate = block.timestamp;
            token.cumulativePrice = 0;
            token.priceChangeCount = 0;

            emit Repossessed(previousOwner, owner(), tokenId);
        }
    }
}
