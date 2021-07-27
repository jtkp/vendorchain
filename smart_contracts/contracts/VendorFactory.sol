// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./Vendor.sol";

// events

/// @title Factory contract that creates new contracts with different conditions
contract VendorFactory {
    Vendor[] public vendors;
    // mapping (address => uint) index;

    function createContract(address _manager, address _payee, uint _createdOn, uint _expiredOn, 
                            uint _nextBillingDate, uint _contractHash, uint _amount, int _contractID) external returns (int) {
        Vendor newVendor = new Vendor(_manager, _payee, _createdOn, _expiredOn, _nextBillingDate, _contractHash, _amount);

        // no valid contractID index is supplied, therefore it is a new vendor contract
        if (_contractID == -1) {
            vendors.push(newVendor);
            return (vendors.length - 1);
        }

        // update an old contract
        // todo: destroy old contract here
        vendors[_contractID] = newVendor;

        return _contractID;
    }
}