//SPDX-License-Identifier: MIT
pragma solidity <0.7;

contract Lottery {
    address public manager;

    constructor() public {
        manager = msg.sender;
    }
}
