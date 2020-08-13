pragma solidity ^0.6.0;

interface BFactory {
    function isBPool(address b) external view returns (bool);
    function newBPool() external returns (IBPool);
}
