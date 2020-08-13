pragma solidity ^0.6.0;

interface IPodStorageInterface {
    function setBetIDManager(uint256 betId, address manager) external;
    function setBetIDOnConstructor(
        uint256 betId, 
        uint256 minimumContribution, 
        uint256 numOfStakers, 
        string calldata betName
    ) external;
    function setRunningPodBetId(uint256 betId) external;
    function addNewBetId(uint256 betId, address manager) external;
    function setStakingDone(uint256 betId) external;
    function setWinnerDeclare(uint256 betId) external;
    function setWinnerAddress(uint256 betId, address winnerAddress) external;
    function setStakeforBet(uint256 betId, uint256 amount, address staker) external;
    function addAmountInTotalStake(uint256 betId, uint256 amount) external;
    function subtractAmountInTotalStake(uint256 betId, uint256 amount) external;
    function setNewStakerForBet(uint256 betId, address staker) external;
    function setRedeemFlagStakerOnBet(uint256 betId, address staker) external;
    function setRevertRedeemFlagStakerOnBet(uint256 betId, address staker) external;
    function increaseStakerCount(uint256 betId) external;
    function decreaseStakerCount(uint256 betId) external;
    function setTimestamp(uint256 betId, uint256 timestamp) external;
    function setBetTokens(uint256 betId, address _tokenAddress, address _aaveToken) external;
    
    function getPodName(uint256 betId) external view returns(string memory);
    function getRunningPodBetId() external view returns(uint256);
    function getTimestamp(uint256 betId) external view returns(uint256);
    function getStakeCount(uint256 betId) external view returns(uint256);
    function getBetIdManager(uint256 betId) external view returns(address);
    function getLengthOfBetIds(address manager) external view returns(uint256);
    function getBetIdArrayOfManager(address manager) external view returns(uint256[] memory);
    function getMinimumContribution(uint256 betId) external view returns(uint256);
    function getNumOfStakers(uint256 betId) external view returns(uint256);
    function getStakingDone(uint256 betId) external view returns(bool);
    function getWinnerDeclare(uint256 betId) external view returns(bool);
    function getWinnerAddress(uint256 betId) external view returns(address);
    function getStakeforBet(uint256 betId, address staker) external view returns(uint256);
    function getTotalStakeFromBet(uint256 betId) external view returns(uint256);
    function getStakersArrayForBet(uint256 betId) external view returns(address[] memory);
    function getLengthOfStakersARray(uint256 betId) external view returns(uint256);
    function getRedeemFlagStakerOnBet(uint256 betId, address staker) external view returns(bool);
    function getBetTokens(uint256 betId) external view returns(address, address);
}
