// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

/// Contract that handles automated payment, considering if conditions are satisfied.
contract Vendor {
    address public admin;
    address payable public client;
    address payable public payee;
    bool public payeeApproved;

    uint public creationDate;
    uint public startDate;
    uint public expiryDate;
    uint public amount;
    uint public prevBillingDate;
    uint public nextBillingDate;
    uint public contractHash;
    
    enum Stages {
        Initialising,
        Pending,
        Inactive,
        Active,
        Expired
    }
    Stages public stage = Stages.Initialising;

    bool public satisfied = false;
    
    // Allows custom conditions and length,
    // but will require multiple small transactions to populate list of conditions.
    struct Conditions {
        int value;
        int operator;
        string name;
    }
    Conditions[] public conditionArray;
    mapping (string => int) private operators;
    
    // Block calculation.
    uint constant blocksDaily = 6400;                       // Average blocks mined per day
    uint blocksSecond = blocksDaily/24/60/60;               // Average blocks per second

    // Values that conditions will check to see if it is satisfied.
    mapping (uint => int) private cumulative;       // sums all values received during the contract, same length as conditionArray
    int private count;                              // keeps track of how many times values were received

    event State(address indexed sender, bool isSatisfied, string message);

    ////////////////////////////////////////////
    ////////////// INITIALISATION //////////////
    ////////////////////////////////////////////

    function init(address _client, uint _createdOn, uint _expiredOn, uint _startDate, uint _nextBillingDate, uint _contractHash, uint _amount) public {
        admin = msg.sender;
        client = payable(_client);
        creationDate = _createdOn;
        expiryDate = _expiredOn;
        startDate = _startDate;
        prevBillingDate = calcDate(_startDate);
        nextBillingDate = calcDate(_nextBillingDate);
        contractHash = _contractHash;
        amount = _amount;
        initOperators();
    }

    function initOperators() private {
        operators['>'] = 1;
        operators['=='] = 2;
        operators['=>'] = 3;
        operators['<'] = 4;
        operators['!='] = 5;
        operators['<='] = 6;
    }

    // Calculate the block number equivalent to a timestamp.
    function calcDate(uint _billingDate) private view returns (uint) {
        uint blockInterval = (_billingDate - block.timestamp)/blocksSecond; // timestamp difference in seconds/blocks per second = blocks from now
        return block.number + blockInterval;
    }

    function setConds(string[8] memory _names, int[8] memory _values, string[8] memory _operators) external atStage(Stages.Initialising) {
        for (uint i = 0; i < 8; i++) {
            if (keccak256(bytes(_names[i])) == keccak256(bytes(""))) {
                endInitStage();
                return;     // break out of loop when received condition name equals "None"
            }
            conditionArray.push(Conditions(_values[i], operators[_operators[i]], _names[i]));
        }
    }

    function setPayee(address _payee) external {
        payee = payable(_payee);
    }

    function endInitStage() public atStage(Stages.Initialising) {
        stage = Stages.Pending;

        // initialise the service data mapping
        for (uint i = 0; i < conditionArray.length; i++) {
            cumulative[i] = 0;
        }
    }

    ////////////////////////////////////////////
    ///////////////// PENDING //////////////////
    ////////////////////////////////////////////

    // Assumes client has already approved because the contract is deployed.
    function approve() external atStage(Stages.Pending) {
        require(msg.sender == admin, "Cannot call this function directly, use VendorFactory.");
        payeeApproved = true;
        stage = Stages.Active;
    }
    
    ////////////////////////////////////////////
    ////////// DEPLOYED FUNCTIONALITY //////////
    ////////////////////////////////////////////

    function storePayment() external payable atStage(Stages.Active) checkBillingDate() {
        if (msg.value != amount) {
            revert();
        }
    }

    function balanceOf() external view returns (uint) {
        return address(this).balance;
    }
    
    function payVendor() private {
        payee.transfer(amount);
        setNewDates();
    }
    
    function refund() private {
        client.transfer(amount);
        setNewDates();
    }

    function setNewDates() private checkExpiry() {
        satisfied = false;
        prevBillingDate = nextBillingDate;
        nextBillingDate = nextBillingDate + 30 * blocksDaily;
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
            int operator = conditionArray[i].operator;
            int value = conditionArray[i].value;
            int _toCheck = cumulative[i]/count;
            
            if (!condValid(operator, _toCheck, value)) {
                refund();
                emit State(msg.sender, satisfied, "Refunding payment.");
                return;
            }
        }
        satisfied = true;
        emit State(msg.sender, satisfied, "Sending payment.");
        
        // Automatically make payment.
        payVendor();
    }
    
    // Operator is checked against binary 111,
    // left bit means less than, middle bit means equal to, right bit means greater than.
    function condValid(int operator, int _toCheck, int value) private pure returns (bool) {
        if (operator != -1) {
            if (operator & 1 == 1) {
                if (!(_toCheck > value)) {
                    return false;
                }
            }
            if (operator & 2 == 2) {
                if (!(_toCheck == value)) {
                    return false;
                }
            }
            if (operator & 4 == 4) {
                if (!(_toCheck < value)) {
                    return false;
                }
            }
        }
        return true;
    }

    ////////////////////////////////////////////
    /////////////// CHANGE STATE ///////////////
    ////////////////////////////////////////////

    function setActive() external atStage(Stages.Inactive) {
        stage = Stages.Active;
    }

    function setInactive() external atStage(Stages.Active) {
        stage = Stages.Inactive;
    }

    function destroy() external atStage(Stages.Inactive) {
        selfdestruct(client);
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

    // Cannot be expired.
    modifier checkExpiry() {
        if (block.number < expiryDate) {
            _;
        }
        stage = Stages.Expired;
    }

    // Has to be in the correct state.
    modifier atStage(Stages _stage) {
        require(stage == _stage, "Contract is not in the required state");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, 'Only the admin can use this function');
        _;
    }
}