// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

/**
 * @title Temp
 * @dev Stores trusted sources
 */

contract Temp {

    mapping(string => bool) public isTrustedSource;
    
    function addTrustableSource(string memory source) public {
        isTrustedSource[source] = true;
    }
    
    function removeTrustableSource(string memory source) public {
        isTrustedSource[source] = false;
    }
    
}