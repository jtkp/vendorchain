// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// npm install @openzeppelin/contracts
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CloneFactory.sol";
import "./Vendor.sol";

/// @title Factory contract that creates new contracts with different conditions
contract VendorFactory is CloneFactory, Ownable {
    Vendor[] private vendors;
}