//SPDX-License-Identifier: MIT
pragma solidity <0.7;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value >= 10000 wei, "Minimum requirement is 10000 wei.");
        players.push(msg.sender);
    }

    function pickWinner() public view restricted returns (address) {
        return players[randomGenerator() % players.length];
    }

    function sendMoney(address payable winner)
        public
        restricted
        returns (uint32)
    {
        winner.transfer(address(this).balance);
        players = new address[](0);
        return 1;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function randomGenerator() public view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.coinbase, players)
                )
            );
    }

    modifier restricted {
        require(
            msg.sender == manager,
            "Unauthorized, only manager can do this operation."
        );
        require(players.length > 0, "Minimum number of players not present.");
        _;
    }
}
