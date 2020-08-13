pragma solidity ^0.6.0;

import "../aavepod.sol";

contract PodFactory is Ownable{
    address[] public podAddress;
        
    function createPod( 
        uint256 minimum, 
        uint256 numstakers, 
        uint256 timeStamp, 
        address tokenAddress, 
        address aaveAddress, 
        string memory betName
        
    ) public onlyOwner {
        aavepod newPod = new aavepod(minimum, numstakers, timeStamp, tokenAddress, aaveAddress, msg.sender, betName);
        podAddress.push(address(newPod));
    }
    
    function getPods() public view returns (address[] memory){
        return podAddress;
    }
}
