pragma solidity ^0.6.0;

interface IchainlinkAlarm {
    function delayStart(address _oracle, string calldata _jobId, uint256 min) external returns(bytes32 _requestId);  
    function getUint() external view returns(uint256);
}
