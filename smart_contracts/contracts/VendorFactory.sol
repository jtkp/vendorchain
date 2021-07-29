// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "./CloneFactory.sol";
import "./Vendor.sol";

/// Factory contract that creates new contracts with different conditions.
contract VendorFactory is CloneFactory {
    address private admin;
    address private implementation;

    mapping (int => address) vendors;   // main address registry
    mapping (int => address) updating;  // temporary registry for unapproved updated contracts

    event ClonedContract(address _cloned);
    event ApprovedContract(address _approved, int index);

    constructor(address _implementation) {
        implementation = _implementation;   // all cloned contracts point to this initial contract
        admin = msg.sender;
    }

    // Initialise a new vendor contract via cloning.
    function createVendor
        ( address _client
        , uint _expiryDate
        , uint _startDate
        , uint _contractHash
        , uint _amount
        , int _index 
        ) external onlyAdmin() returns (address) {

        address newVendor = createClone(implementation);
        Vendor(newVendor).init(_client, _expiryDate, _startDate, _contractHash, _amount);

        if (vendors[_index] != address(0x0)) {  // check if an existing contract lies at the index
            updating[_index] = newVendor;       // if so, do not replace it at the index straightaway
        } else {
            vendors[_index] = newVendor;
        }

        emit ClonedContract(newVendor);
        return newVendor;
    }

    // Approve a new contract.
    function approve(address _contract, int _index) external returns (address, int) {
        require(payable(msg.sender) == Vendor(_contract).payee(), "Only the payee can approve this contract.");
        Vendor(_contract).approve();

        if (updating[_index] != address(0x0)) {     // if it's an update, perform relevant operations
            Vendor(vendors[_index]).destroy();
            delete(updating[_index]);
            vendors[_index] = _contract;
        }

        emit ApprovedContract(_contract, _index);
        return (_contract, _index);
    }

    // Only the company address can create new vendor contracts.
    modifier onlyAdmin() {
        require(msg.sender == admin, 'Only the admin can use this function');
        _;
    }
}
