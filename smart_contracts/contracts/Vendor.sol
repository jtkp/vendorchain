// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

/// Contract that handles automated payment, considering if conditions are satisfied.
contract Vendor {
    address public admin;
    address payable public client;
    address payable public payee;
    bool public payeeApproved;
    bool public paid;

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
    
    // List of conditions
    string[8] public names;
    int[8] public values;
    int[8] public operators;
    mapping (string => int) private convert;
    uint private conditionCount = 0;
    
    // Block calculation.
    uint constant blocksDaily = 6400;                       // Average blocks mined per day

    // Values that conditions will check to see if it is satisfied.
    mapping (uint => int) private cumulative;       // sums all values received during the contract, same length as conditionArray
    int private count = 0;                          // keeps track of how many times values were received

    event State(address indexed sender, bool isSatisfied, string message);
    event Details(address client, 
                  address payee, 
                  uint startDate, 
                  uint expiryDate, 
                  uint amount, 
                  uint prevBillingDate, 
                  uint nextBillingDate, 
                  uint contractHash, 
                  string[8] names, 
                  int[8] values, 
                  int[8] operators);
    event Log(string message, uint whatever);

    ////////////////////////////////////////////
    ////////////// INITIALISATION //////////////
    ////////////////////////////////////////////

    function init(address _client, uint _expiredOn, uint _startDate, uint _contractHash, uint _amount) public {
        admin = msg.sender;
        client = payable(_client);
        expiryDate = calcDate(_expiredOn);
        startDate = _startDate;
        prevBillingDate = calcDate(_startDate);
        nextBillingDate = calcDate(_startDate + 30);
        contractHash = _contractHash;
        amount = _amount;
        initOperators();
    }

    
    function initOperators() private {
        convert['>'] = 1;
        convert['=='] = 2;
        convert['>='] = 3;
        convert['<'] = 4;
        convert['!='] = 5;
        convert['<='] = 6;
    }

    // Calculate the block number equivalent to a timestamp.
    function calcDate(uint _billingDate) private view returns (uint) {
        return block.number + _billingDate*blocksDaily;
    }
    
    function setConds(string[8] memory _names, int[8] memory _values, string[8] memory _operators) external atStage(Stages.Initialising) {
        emit Log("inside setConds, current stage is:", uint(stage));
        for (uint i = 0; i < 8; i++) {
            if (keccak256(bytes(_names[i])) == keccak256(bytes("0"))) {
                emit Log("inside setConds if statement, current stage is:", uint(stage));
                endInitStage();
                emit Log("inside setConds if statement, after endInitStage, current stage is:", uint(stage));
                return;     // break out of loop when received condition name equals "None"
            }
            names[i] = _names[i];
            values[i] = _values[i];
            operators[i] = convert[_operators[i]];
            conditionCount++;
        }
    }

    function setPayee(address _payee) external {
        payee = payable(_payee);
    }

    function endInitStage() public atStage(Stages.Initialising) {
        emit Log("inside endInitStage, current stage is:", uint(stage));
        stage = Stages.Pending;

        // initialise the service data mapping
        for (uint i = 0; i < 8; i++) {
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

    function getDetails() external view returns (address, address, uint, uint, uint, uint, uint, uint, string[8] memory, int[8] memory, int[8] memory) {
       emit Details( client, 
                     payee, 
                     startDate, 
                     expiryDate, 
                     amount, 
                     prevBillingDate, 
                     nextBillingDate, 
                     contractHash, 
                     names, 
                     values, 
                     operators);
        return (client, payee, startDate, expiryDate, amount, prevBillingDate, nextBillingDate, contractHash, names, values, operators);
    }

    function storePayment() external payable atStage(Stages.Active) checkBillingDate() {
        if (msg.value != amount) {
            revert();
        }
        paid = true;
    }

    function balanceOf() external view returns (uint) {
        return address(this).balance;
    }
    
    function payVendor() private {
        satisfied = true;
        payee.transfer(amount);
        setNewDates();
    }
    
    function refund() private {
        satisfied = false;
        client.transfer(amount);
        setNewDates();
    }

    function setNewDates() private checkExpiry() {
        for(uint i = 0; i<conditionCount; i++){
            cumulative[i] = 0;
        }
        count = 0;
        paid = false;
        prevBillingDate = nextBillingDate;
        nextBillingDate = nextBillingDate + 30 * blocksDaily;
    }

    // Allows off-chain to push data onto the blockchain.
    // Sums up data received and counts how much of each.
    // Assumes data for each condition are received at the same time.
    function receiveServiceData(int[] memory _cumulative) external atStage(Stages.Active) checkBillingDate() {
        for (uint i = 0; i < conditionCount; i++) {
            cumulative[i] += _cumulative[i];
        }
        count++;
    }
    
    function receiveServiceDataBypass(int[] memory _cumulative) external atStage(Stages.Active) {
        for (uint i = 0; i < conditionCount; i++) {
            cumulative[i] += _cumulative[i];
        }
        count++;
    }

    // Calculates if the contract terms have been satisfied after next billing date has been passed.
    function isSatisfied() public atStage(Stages.Active) {
        for (uint i = 0; i < conditionCount; i++) {
            int operator = operators[i];
            int value = values[i];
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
                if (!checkGreater(operator, _toCheck, value)) {
                    return false;
                }
            } else if (operator & 4 == 4) {
                if (!checkLess(operator, _toCheck, value)) {
                    return false;
                }
            } else if (operator & 2 == 2) {
                if (!checkEqual(operator, _toCheck, value)) {
                    return false;
                }
            }
        }
        return true;
    }
    
    function checkGreater(int operator, int _toCheck, int value) private pure returns (bool) {
        bool status = false;
        if (operator & 1 == 1) {
            if (_toCheck > value) {
                status = true;
            }
            if (checkEqual(operator, _toCheck, value)) {
                status = true;
            }
        }
        return status;
    }
    function checkLess(int operator, int _toCheck, int value) private pure returns (bool) {
        bool status = false;
        if (operator & 4 == 4) {
            if (_toCheck < value) {
                status = true;
            }
            if (checkEqual(operator, _toCheck, value)) {
                status = true;
            }
        }
        return status;
    }
    function checkEqual(int operator, int _toCheck, int value) private pure returns (bool) {
        if (operator & 2 == 2) {
            if (_toCheck == value) {
                return true;
            }
        }
        return false;
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
        if (block.number >= expiryDate) {
            stage = Stages.Expired;  
        }
        _;        
    }

    // Has to be in the correct state.
    modifier atStage(Stages _stage) {
        emit Log("inside atStage, current stage is:", uint(stage));
        emit Log("still inside atStage, trying to compare it to:", uint(_stage));
        require(uint(stage) == uint(_stage), "Contract is not in the required state");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, 'Only the admin can use this function');
        _;
    }
}