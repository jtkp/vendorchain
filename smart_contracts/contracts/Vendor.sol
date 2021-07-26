// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// npm install @openzeppelin/contracts
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Contract that handles automated payment, considering if conditions are satisfied
contract Vendor is Ownable {
    address private manager;
    address payable private payee;
    uint private createdOn;
    uint private expiredOn;
    uint private nextBillingDate;
    uint private contractHash;      // need to check variable definition, should be hash of contract terms
    uint private amount;

    bool private satisfied = false;
    
    // Allows custom conditions and length,
    // but will require multiple small transactions to populate list of conditions
    struct Conditions {
        string name;
        int mode;
        int value;
    }

    Conditions[] conditionArray;
    
    // checking if the next billing date has been passed
    uint constant blocksDaily = 6480;             // Average blocks mined per day
    uint blockHour = blocksDaily/24;              // Average blocks per hour
    uint blockMinute = blockHour/60;              // Average blocks per minute
    uint blockSecond = blockMinute/60;            // Average blocks per second

    // values that conditions will check to see if it is satisfied
    int[] private cumulative;   // sums all values received during the contract
    int private count;          // keeps track of how many times values were received

    // event 
    

    // creation is done with factory, so no constructor needed

    function init(address _manager, address _payee, uint _createdOn, uint _expiredOn, uint _nextBillingDate, uint _contractHash, uint _amount) public {
        manager = _manager;
        payee = payable(_payee);
        createdOn = _createdOn;
        expiredOn = _expiredOn;
        setNextBilling(_nextBillingDate);
        contractHash = _contractHash;
        amount = _amount;
    }
    
    /// from the input timestamp, calculate the block after which data will not be accepted
    function setNextBilling(uint _nextBillingDate) public onlyOwner() {
        uint blockInterval = (_nextBillingDate - block.timestamp)/blockSecond; // timestamp difference in seconds/blocks per second = blocks from now
        nextBillingDate = block.number + blockInterval;
    }
    
    function setConds(string[8] memory _names, int[8] memory _values, int[8] memory _modes) public {
        for (uint i = 0; i < 8; i++) {
            conditionArray.push(Conditions(_names[i], _values[i], _modes[i]));
        }
    }
    
    /// mode has to be valid
    function isSatisfied() private {
        for (uint i = 0; i < conditionArray.length; i++) {
            int mode = conditionArray[i].mode;
            int value = conditionArray[i].value;
            int _value = cumulative[i];
            
            if (!condValid(mode, _value, value)) {
                return;
            }
        }
        satisfied = true;
    }
    
    // mode is checked against binary 111,
    // left bit means less than, middle bit means equal to, right bit means greater than
    function condValid(int mode, int _value, int value) private pure returns (bool) {
        if (mode != -1) {
            if (mode & 1 == 1) {
                if (!(_value > value)) {
                    return false;
                }
            }
            if (mode & 2 == 2) {
                if (!(_value == value)) {
                    return false;
                }
            }
            if (mode & 4 == 4) {
                if (!(_value < value)) {
                    return false;
                }
            }
        }
        return true;
    }

    // allows off-chain to push data onto the blockchain
    // immutable, transactions can be tracked
    function sendServiceData(int[] memory _cumulative) public checkBillingDate() {
        for (uint i = 0; i < _cumulative.length; i++) {
            cumulative[i] = _cumulative[i];
        }
        count++;
    }

    // only allow data to be pushed before the billing date
    modifier checkBillingDate() {
        if (block.number < nextBillingDate) {
            _;
        }
        isSatisfied();
    }
}