// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "./CloneFactory.sol";
import "./Vendor.sol";

// events

/// @title Factory contract that creates new contracts with different conditions
contract VendorFactory is CloneFactory {
    address private admin;
    address private implementation;

    address[] public approved;   // this is a list of proxy contract addresses, functionally the same as the implementation contract
    mapping (address => int) pendingIndex;

    event ClonedContract(address _cloned);
    event ApprovedContract(address _approved, int index);

    constructor(address _implementation) {
        implementation = _implementation;   // if this contract is destroyed, all proxies will stop working
        admin = msg.sender;
    }

    function createVendor(address _client, address _payee, uint _creationDate, uint _expiryDate, uint _prevBillingDate, uint _nextBillingDate,
                          uint _contractHash, uint _amount, int index) external onlyAdmin() returns (address) {

        address newVendor = createClone(implementation);
        Vendor(newVendor).init(_client, _payee, _creationDate, _expiryDate, _prevBillingDate, _nextBillingDate, _contractHash, _amount);

        pendingIndex[newVendor] = index;     // if index is not -1, it has an existing contract

        emit ClonedContract(newVendor);
        return newVendor;
    }

    function approve(address _contract) external {
        require(payable(msg.sender) == Vendor(_contract).payee(), "Only the payee can approve this contract.");
        Vendor(_contract).approve();

        int index = pendingIndex[_contract];
        if (index == -1) {
            approved.push(_contract);
            delete(pendingIndex[_contract]);

            emit ApprovedContract(_contract, int(approved.length) - 1);
            return;
        }

        // Update to existing contract is approved, replace with the new one
        address toDelete = approved[uint(index)];
        Vendor(toDelete).destroy();

        approved[uint(index)] = _contract;
        delete(pendingIndex[_contract]);

        emit ApprovedContract(_contract, index);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, 'Only the admin can use this function');
        _;
    }
}
