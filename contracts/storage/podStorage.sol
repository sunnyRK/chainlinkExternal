contract podStorage {
    
    using SafeMath for uint256;
    
    struct betInfo {
        uint256 betId; // constructor
        uint256 minimumContribution; //constructor
        uint256 numOfStakers; // constructor
        uint256 stakerCount;
        bool isWinnerDeclare; // WinnerDeclation  or reddemPod
        bool isStakingDone; // DepositPod
        string betName; //constructor
        address winnerAddress; // Winner declare during
    }
    
    struct betTokens {
        address tokenAddress;
        address aaveToken;
    }
    
    mapping(uint256 => uint256) public timeStamp;
    mapping(uint256 => address) public betIdMapping; // address manger of bet id
    mapping(address => uint256[]) public betIdsOfManager;
    mapping(uint256 => betInfo) public betInfoMapping; // bet info in struct for bet id
    mapping(uint256 => mapping(address => uint256)) public stakeOnBetId; // amount of stakers on betId
    mapping(uint256 => uint256) public totalValueOnBet; // totak stake on bet id
    mapping(uint256 => address[]) public stakersOfBet; // stakers array address for bet id  
    mapping(uint256 => betTokens) public betIdTokensMapping;
    mapping(uint256 => mapping(address => bool)) isRedeem; // redeem money before bet ends
    
    uint256 public runningPodBetId;
    // If true then cant be winner and after completion 
    //stake will not refund because it is already redeem
    
    function setBetIDManager(uint256 betId, address manager) public {
        betIdMapping[betId] = manager;
    }
    
    function getBetIdManager(uint256 betId) public view returns(address) {
        return betIdMapping[betId];
    }
    
    function setRunningPodBetId(uint256 betId) public {
        runningPodBetId = betId;
    }
    
    function getRunningPodBetId() public view returns(uint256) {
        return runningPodBetId;
    }
    
    function addNewBetId(uint256 betId, address manager) public {
        betIdsOfManager[manager].push(betId);
    }
    
    function getBetIdArrayOfManager(address manager) public view returns(uint256[] memory) {
        return betIdsOfManager[manager];
    }
    
    function getLengthOfBetIds(address manager) public view returns(uint256) {
        return betIdsOfManager[manager].length;
    }
    
    function setBetIDOnConstructor(
        uint256 betId, 
        uint256 minimumContribution, 
        uint256 numOfStakers, 
        string memory betName
    ) public {
        betInfoMapping[betId].minimumContribution = minimumContribution;
        betInfoMapping[betId].numOfStakers = numOfStakers;
        betInfoMapping[betId].betName = betName;
    }
    
    function setStakingDone(uint256 betId) public {
        betInfoMapping[betId].isStakingDone = true;
    }
    
    function setWinnerDeclare(uint256 betId) public {
        betInfoMapping[betId].isWinnerDeclare = true;
    }
    
    function setWinnerAddress(uint256 betId, address winnerAddress) public {
        betInfoMapping[betId].winnerAddress = winnerAddress;
    }
    
    function setTimestamp(uint256 betId, uint256 timestamp) public {
        // timeStamp[betId] = now + (timestamp*86400);
        timeStamp[betId] = now.add(timestamp.mul(86400));
    }
    
    function getPodName(uint256 betId) public view returns(string memory) {
        return betInfoMapping[betId].betName;
    }
    
    function getTimestamp(uint256 betId) public view returns(uint256) {
        return timeStamp[betId];
    }
    
    function getMinimumContribution(uint256 betId) public view returns(uint256) {
        return betInfoMapping[betId].minimumContribution;
    }
    
    function getNumOfStakers(uint256 betId) public view returns(uint256) {
        return betInfoMapping[betId].numOfStakers;
    }
    
    function getStakingDone(uint256 betId) public view returns(bool) {
        return betInfoMapping[betId].isStakingDone;
    }
    
    function getWinnerDeclare(uint256 betId) public view returns(bool) {
        return betInfoMapping[betId].isWinnerDeclare;
    }
    
    function getWinnerAddress(uint256 betId) public view returns(address) {
        return betInfoMapping[betId].winnerAddress;
    }

    function increaseStakerCount(uint256 betId) public {
        // betInfoMapping[betId].stakerCount = betInfoMapping[betId].stakerCount + 1;
        betInfoMapping[betId].stakerCount = betInfoMapping[betId].stakerCount.add(1);

    }
    
    function decreaseStakerCount(uint256 betId) public {
        // betInfoMapping[betId].stakerCount = betInfoMapping[betId].stakerCount - 1;
        betInfoMapping[betId].stakerCount = betInfoMapping[betId].stakerCount.sub(1);
    }
    
    function getStakeCount(uint256 betId) public view returns(uint256) {
        return betInfoMapping[betId].stakerCount;
    }

    function setStakeforBet(uint256 betId, uint256 amount, address staker) public {
        stakeOnBetId[betId][staker] = amount;
    }
    
    function getStakeforBet(uint256 betId, address staker) public view returns(uint256) {
        return stakeOnBetId[betId][staker];
    }
    
    function addAmountInTotalStake(uint256 betId, uint256 amount) public {
        totalValueOnBet[betId] = totalValueOnBet[betId].add(amount);
    }
    
    function subtractAmountInTotalStake(uint256 betId, uint256 amount) public {
        totalValueOnBet[betId] = totalValueOnBet[betId].sub(amount);
    }
    
    function getTotalStakeFromBet(uint256 betId) public view returns(uint256) {
        return totalValueOnBet[betId];
    }
    
    function setNewStakerForBet(uint256 betId, address staker) public {
        stakersOfBet[betId].push(staker);
    }
    
    function getStakersArrayForBet(uint256 betId) public view returns(address[] memory){
        return stakersOfBet[betId];
    }
    
    function setBetTokens(uint256 betId, address _tokenAddress, address _aaveToken) public {
        betIdTokensMapping[betId].tokenAddress = _tokenAddress;
        betIdTokensMapping[betId].aaveToken = _aaveToken;
    }
    
    function getBetTokens(uint256 betId) public view returns(address, address){
        return (
            betIdTokensMapping[betId].tokenAddress,
            betIdTokensMapping[betId].aaveToken
        ); 
    }
    
    function getLengthOfStakersARray(uint256 betId) public view returns(uint256) {
        return stakersOfBet[betId].length;
    }
    
    function setRedeemFlagStakerOnBet(uint256 betId, address staker) public {
        isRedeem[betId][staker] = true;
    }
    
    function setRevertRedeemFlagStakerOnBet(uint256 betId, address staker) public {
        isRedeem[betId][staker] = false;
    }
    
    function getRedeemFlagStakerOnBet(uint256 betId, address staker) public view returns(bool) {
        return isRedeem[betId][staker];
    }
}