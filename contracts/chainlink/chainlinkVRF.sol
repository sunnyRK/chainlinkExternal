pragma solidity 0.6.6;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/7a4e19a8ff07db1be0b397465d38d175bc0bb5b5/evm-contracts/src/v0.6/VRFConsumerBase.sol";
import "./IPodStorageInterface.sol";
import "./IERC20.sol";

contract ChainlinkVRF is VRFConsumerBase {
    
    uint256[] public vrfAllResults;
    bytes32 internal keyHash;
    uint256 internal fee;
    IPodStorageInterface iPodStorageInterface;
    IERC20 public regularToken;
    IERC20 public aaveToken;
    event WinnerDecided(uint256 _betId, address indexed winner);

    // _vrfCoordinator: 0xc1031337fe8E75Cf25CAe9828F3BF734d83732e4
    // _link:           0xa36085F69e2889c224210F603D836748e7dC0088
     
    
    modifier onlyVRFCoordinator {
        require(msg.sender == vrfCoordinator, 'Fulfillment only allowed by VRFCoordinator');
        _;
    }

    constructor(address _vrfCoordinator, address _link)
        VRFConsumerBase(_vrfCoordinator, _link) public
    {
        iPodStorageInterface = IPodStorageInterface(0xED284850d2259FcF519174ebf6E972de4d7591d8);
        vrfCoordinator = _vrfCoordinator;
        LINK = LinkTokenInterface(_link);
        keyHash = 0x0218141742245eeeba0660e61ef8767e6ce8e7215289a4d18616828caf4dfe33;
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }
    
    // This is storage of Pod smart contract.
    // In future if we change the storage we can set that address using this function
    function setPodStorageAddress(address podStorageAddress) public {
        iPodStorageInterface = IPodStorageInterface(podStorageAddress);
    }
    
    /* This is the requestRandomness function which is execute by callback function of 
    Chainlink Alarm clock to get the random number from VRF
    You can check in ChainlinkAlarmClock.sol file code
    */
    function requestRandomnesses() public returns (bytes32 requestId){
        uint256 seed = 1000; 
        requestId =requestRandomness(keyHash, fee, seed);
    }

    /** 
    This is call back function which is defined by chainlink
    We take the randomness as a result for our participants(stakers) array address
    and declare the winner that address for that bet ID(or pod ID)
    */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) external override onlyVRFCoordinator {
        uint256 _betId = iPodStorageInterface.getRunningPodBetId();
        
        // VRF randomness result
        uint256 vrfWinnerResult = randomness.mod(iPodStorageInterface.getLengthOfStakersARray(_betId)); // Simplified example
        vrfAllResults.push(vrfWinnerResult);

        // Get the participants array
        address[] memory stakerArray = iPodStorageInterface.getStakersArrayForBet(_betId);

        // set the VRF result as a winner in pod address array
        iPodStorageInterface.setWinnerAddress(_betId, stakerArray[vrfWinnerResult]);

        // Winner declare event emit
        emit WinnerDecided(_betId, stakerArray[vrfWinnerResult]);
    }
    
    function getWinnerRandomness() public view returns (uint256 vrfAllResult) {
        return vrfAllResults[vrfAllResults.length.sub(1)];
    }

    // Chainlink code
    function rollDice(uint256 userProvidedSeed) public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) > fee, "Not enough LINK - fill contract with faucet");
        bytes32 _requestId = requestRandomness(keyHash, fee, userProvidedSeed);
        return _requestId;
    }
}