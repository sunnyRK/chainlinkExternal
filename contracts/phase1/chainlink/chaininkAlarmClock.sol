pragma solidity ^0.6.0;

import "./Ownable.sol";
import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.6/ChainlinkClient.sol";

// Chainlink vrf interface
interface IVrf {
    function requestRandomnesses() external returns (bytes32 requestId);
    function getWinnerRandomness() external view returns (uint256 d20result);
}

// Chainlink alarm clock External adapters
contract ChainlinkAlarmClock is ChainlinkClient, Ownable {
    
    uint256 oraclePayment;
    string public astr;
    IVrf vrf;
    string public otherstring;

    constructor(uint256 _oraclePayment) public {
        // Set VRF address to interact with Chainlink vrf contract 
        vrf = IVrf(0x2a23Db20a09EBaaA00c97F054E8B4F308767d8fd);
        setPublicChainlinkToken();
        oraclePayment = _oraclePayment;
    }
    
    // In future if we change in chainlink vrf functionality then we can change address using this function
    function setChainLinkVRFAddress(address vrfAddress) public {
        vrf = IVrf(vrfAddress);
    }
    
    // This is the function which will execute when new pod is created by contract owner for waiting for predefined time-period
    // and once the time-period complete it will call Chainlink-VRF function in fulfill callback function
    // oracle: "0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e",
    // JobId: "a7ab70d561d34eb49e9b1612fd2e044b","1"
    function delayStart (
        address _oracle,
        string memory _jobId,
        uint256 time
    ) public 
    // onlyOwner 
    returns(bytes32 _requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfill.selector);
        uint256 waitMinute = now.add((time.mul(60)));
        req.addUint("until", waitMinute);
        _requestId = sendChainlinkRequestTo(_oracle, req, oraclePayment);
    }  
    
    // This is the chainlink alarma clock callback function which will execute chainlink VRF function to select winner
    function fulfill(bytes32 _requestId)
        public
        recordChainlinkFulfillment(_requestId) {
        vrf.requestRandomnesses();
    }
    
    function getWinnerRandomness() public view virtual returns(uint256) {
        return vrf.getWinnerRandomness();
    }
    
    function stringToBytes32(string memory source) public view returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
          return 0x0;
        }
        assembly { // solhint-disable-line no-inline-assembly
          result := mload(add(source, 32))
        }
    }
}