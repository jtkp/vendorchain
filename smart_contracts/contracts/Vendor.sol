// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

// todo: handle contract destruction

/// @title Contract that handles automated payment, considering if conditions are satisfied
contract Vendor {
    enum Stages {
        Initialising,
        Inactive,
        Active
    }
    Stages public stage = Stages.Initialising;

    address public manager;
    address payable public client;
    address payable public payee;

    string public title;
    string public description;
    uint public creationDate;
    uint public expiryDate;
    uint public amount;
    uint public prevBillingDate;
    uint public nextBillingDate;
    uint public contractHash;      // need to check variable definition, should be hash of contract terms

    bool public satisfied = false;
    
    // Allows custom conditions and length,
    // but will require multiple small transactions to populate list of conditions
    struct Conditions {
        string name;
        int mode;
        int value;
    }
    Conditions[] public conditionArray;
    mapping (string => int) private operators;
    
    // block calculation
    uint constant blocksDaily = 6400;                       // Average blocks mined per day
    uint blocksSecond = blocksDaily/24/60/60;               // Average blocks per second

    // values that conditions will check to see if it is satisfied
    mapping (uint => int) private cumulative;       // sums all values received during the contract, same length as conditionArray
    int private count;                              // keeps track of how many times values were received

    // contract is satisfied/unsatisfied at end of valid period
    event State(address indexed sender, bool isSatisfied);

    ////////////////////////////////////////////
    ////////////// INITIALISATION //////////////
    ////////////////////////////////////////////

    constructor(string memory _title, string memory _description, address _manager, address _client, address _payee, uint _createdOn, uint _expiredOn, uint _prevBillingDate, uint _nextBillingDate, uint _contractHash, uint _amount) {
        title = _title;
        description = _description;
        manager = _manager;
        client = payable(_client);
        payee = payable(_payee);
        creationDate = _createdOn;
        expiryDate = _expiredOn;
        prevBillingDate = calcDate(_prevBillingDate);
        nextBillingDate = calcDate(_nextBillingDate);
        contractHash = _contractHash;
        amount = _amount;

        // init operators
        // >=, <=, ==, <, >
    }

    // calculate the block number equivalent to a timestamp
    function calcDate(uint _billingDate) private view returns (uint) {
        uint blockInterval = (_billingDate - block.timestamp)/blocksSecond; // timestamp difference in seconds/blocks per second = blocks from now
        return block.number + blockInterval;
    }

    // todo: set so only VendorFactory can call this
    function setConds(string[8] memory _names, int[8] memory _values, int[8] memory _modes) external atStage(Stages.Initialising) {
        for (uint i = 0; i < 8; i++) {
            if (keccak256(bytes(_names[i])) == keccak256(bytes("None"))) {
                endInitStage();
                return;     // break out of loop when received condition name equals "None"
            }
            conditionArray.push(Conditions(_names[i], _values[i], _modes[i]));
        }
    }

    function endInitStage() public atStage(Stages.Initialising) {
        stage = Stages.Inactive;

        // initialise the service data mapping
        for (uint i = 0; i < conditionArray.length; i++) {
            cumulative[i] = 0;
        }
    }

    function setActive() external atStage(Stages.Inactive) {
        stage = Stages.Active;
    }

    function setInactive() external atStage(Stages.Active) {
        stage = Stages.Inactive;
    }
    
    ////////////////////////////////////////////
    ////////// DEPLOYED FUNCTIONALITY //////////
    ////////////////////////////////////////////

    function payContract() external payable atStage(Stages.Active) checkBillingDate() {
        if (msg.value != amount) {
            revert();
        }
    }

    function balanceOf() external view atStage(Stages.Active) returns (uint) {
        return address(this).balance;
    }
    
    // todo: what happens when there is no stored balance in the contract???
    function payVendor() private {
        payee.transfer(amount);
        // todo: automated billing date adjustment here??
    }
    
    function refund() private {
        client.transfer(amount);
        // todo: automated billing date adjustment here??
    }

    // Allows off-chain to push data onto the blockchain.
    // Sums up data received and counts how much of each.
    // Assumes data for each condition are received at the same time.
    function receiveServiceData(int[] memory _cumulative) external atStage(Stages.Active) checkBillingDate() {
        for (uint i = 0; i < _cumulative.length; i++) {
            cumulative[i] += _cumulative[i];
        }
        count++;
    }
    
    // Calculates if the contract terms have been satisfied after next billing date has been passed.
    function isSatisfied() private atStage(Stages.Active) {
        for (uint i = 0; i < conditionArray.length; i++) {
            int mode = conditionArray[i].mode;
            int value = conditionArray[i].value;
            int _value = cumulative[i]/count;
            
            if (!condValid(mode, _value, value)) {
                refund();
                emit State(msg.sender, satisfied);
                return;
            }
        }
        satisfied = true;
        emit State(msg.sender, satisfied);
        
        // Automatically attempts to make payment.
        payVendor();
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
    
    ////////////////////////////////////////////
    //////////////// MODIFIERS /////////////////
    ////////////////////////////////////////////

    // Only allow data to be pushed within the period.
    modifier checkBillingDate() {
        // Already checked if contract was active before this function,
        // do not allow new data to be pushed if period is passed.
        if (block.number > nextBillingDate) {
            isSatisfied();
        } else {
            require(block.number >= prevBillingDate && block.number <= nextBillingDate, "Not within the billing period");
            _;
        }
    }

    // Has to be in the correct state.
    modifier atStage(Stages _stage) {
        require(stage == _stage, "Contract is not in the required state");
        _;
    }
}