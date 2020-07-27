pragma solidity ^0.6.0;

interface IVrf {
    function requestRandomness(bytes32 _keyHash, uint256 _fee, uint256 _seed)
    external returns (bytes32 requestId);
    function getWinnerRandomness() external view returns (uint256 d20result);
}
