// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./Vendor.sol";

// events

/// @title Factory contract that creates new contracts with different conditions
contract VendorFactory {
    Vendor[] public vendors;
    mapping (address => uint) index;
    address public manager;

    constructor(){
        manager = msg.sender;
    }

    function createContract
        ( address _manager
        , address _client
        , address _payee
        , uint _createdOn
        , uint _expiredOn
        , uint _prevBillingDate
        , uint _nextBillingDate
        , uint _contractHash
        , uint _amount
        , int _contractID
        ) external returns (int) {
        Vendor newVendor = new Vendor( _client, _manager, _payee, _createdOn, _expiredOn, _prevBillingDate, _nextBillingDate, _contractHash, _amount);

        // no valid contractID index is supplied, therefore it is a new vendor contract
        if (_contractID == -1) {
            vendors.push(newVendor);
            return (int(vendors.length - 1));
        }

        // update an old contract
        // todo: destroy old contract here
        vendors[uint(_contractID)] = newVendor;

        return _contractID;
    }
}