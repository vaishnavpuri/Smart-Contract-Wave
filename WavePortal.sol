// SPDX-License-Identifier: UNLICENSED
pragma solidity  ^0.8.4;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    // Generate rand number
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; //address of user who waved
        string message; // message user sent
        uint256 timestamp; //timestamp when the user waved
        }
    
    // to hold the waves
    Wave[] waves;

    // mapping an addy to a number
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("We have been constructed!");
        seed = (block.timestamp + block.difficulty) % 100;
    }
    function wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 30 seconds < block.timestamp,
            "Wait 30 seconds before waving again"
        );
        lastWavedAt[msg.sender] = block.timestamp;
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        // store the wave data in the array
        waves.push(Wave(msg.sender, _message, block.timestamp));

        //gen new seed for next user
        seed = (block.difficulty + block.timestamp + seed) % 100;
        //console.log("Random number generated: %d", seed);

        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);

    }
    // return the struct array, waves
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }
}