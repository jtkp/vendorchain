// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "./CloneFactory.sol";
import "./Vendor.sol";

// events

/// @title Factory contract that creates new contracts with different conditions
contract VendorFactory is CloneFactory {
    address private admin;
    address private implementation;

    mapping (int => address) vendors;
    mapping (int => address) updating;

    event ClonedContract(address _cloned);
    event ApprovedContract(address _approved, int index);

    constructor(address _implementation) {
        implementation = _implementation;   // if this contract is destroyed, all proxies will stop working
        admin = msg.sender;
    }

    function createVendor(address _client, uint _creationDate, uint _expiryDate, uint _startDate, uint _nextBillingDate,
                          uint _contractHash, uint _amount, int _index) external onlyAdmin() returns (address) {

        address newVendor = createClone(implementation);
        Vendor(newVendor).init(_client, _payee, _creationDate, _expiryDate, _startDate, _nextBillingDate, _contractHash, _amount);

        if (vendors[_index] != address(0x0)) {  // if an existing contract lies at the index
            updating[_index] = newVendor;
        } else {
            vendors[_index] = newVendor;
        }

        emit ClonedContract(newVendor);
        return newVendor;
    }

    function approve(address _contract, int _index) external returns (address, int) {
        require(payable(msg.sender) == Vendor(_contract).payee(), "Only the payee can approve this contract.");
        Vendor(_contract).approve();

        if (vendors[_index] != address(0x0)) {     // know if it's an update
            Vendor(vendors[_index]).destroy();
            delete(updating[_index]);
            vendors[_index] = _contract;
        }

        emit ApprovedContract(_contract, _index);
        return (_contract, _index);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, 'Only the admin can use this function');
        _;
    }
}