pragma solidity ^0.6.0;

import "./interfaces/balancerInterface/IBPool.sol";
import "./interfaces/balancerInterface/BFactory.sol";

import "./interfaces/aaveInterface/ILendingPoolAddressesProvider.sol";
import "./interfaces/aaveInterface/ILendingPool.sol";
import "./interfaces/aaveInterface/IAToken.sol";

import "./interfaces/helper/Ownable.sol";
import "./interfaces/helper/SafeMath.sol";

import "./interfaces/IERC20.sol";

interface AaveCoreInterface {
    function getReserveATokenAddress(address _reserve) external view returns (address);
}

interface ATokenInterface {
    function redeem(uint256 _amount) external;
    function balanceOf(address _user) external view returns(uint256);
    function principalBalanceOf(address _user) external view returns(uint256);
}

contract AaveBalancerAggregator is Ownable {
    
    using SafeMath for uint256;

    IERC20 public erc20Token;
    BFactory public bFactory;
    IBPool public bpool;


    // Aave contracts
    ILendingPoolAddressesProvider aaveProvider;
    ILendingPool aaveLendingPool;
    IAToken aTokenInstance;

    ATokenInterface public atoken;
    AaveCoreInterface public aaveCore;

    uint16 constant private referral = 0;
    bool private aaveInitialised;
        
    event Deposit(address indexed user, address indexed liquidityPool, uint256 amount);
    event Withdraw(address indexed user, address indexed liquidityPool, uint256 amount);
    event DepositAave(address indexed owner, uint256 transferAmount);
    event RedeemAave(address indexed owner, uint256 redeemAmount);
    
    constructor() public Ownable() {
        bFactory = BFactory(0x8f7F78080219d4066A8036ccD30D588B416a40DB); // Kovan network
    }
    
    function initialiseAave() public  {
        // kovan addresses
        address aaveLendingPoolAddressesProvider = 0x506B0B2CF20FAA8f38a4E2B524EE43e1f4458Cc5;
        
        aaveProvider = ILendingPoolAddressesProvider(aaveLendingPoolAddressesProvider);
        aaveLendingPool = ILendingPool(aaveProvider.getLendingPool());
    }
    
    function newBPool() public {
        bpool = IBPool(bFactory.newBPool());   
    }
    
    function setExistingPoolAddress(address _addr) public{
        bpool = IBPool(_addr);   
    }
    
    function bindTokenToPoolAfterApprove(address[] memory _erc20Address, uint[] memory _balance, uint _denorem) public {
        for (uint i=0; i<_erc20Address.length; i++) {
            erc20Token = IERC20(_erc20Address[i]);
            erc20Token.approve(address(bpool), _balance[i]);
            bpool.bind(_erc20Address[i], _balance[i], _denorem);
        }
    }
    
    function deposit(address[] memory _erc20Addresss, uint256[] memory balances, uint _denorem) public {
        
        for(uint i=0; i<_erc20Addresss.length; i++) {
            address tokenAddress = address(_erc20Addresss[i]); // mainnet DAI
    
            // Approve LendingPool contract to move your DAI
            IERC20(tokenAddress).approve(aaveProvider.getLendingPoolCore(), balances[i]);
            
            // Deposit 1000 DAI
            aaveLendingPool.deposit(tokenAddress, balances[i], referral);
        }
        bindTokenToPoolAfterApprove(_erc20Addresss, balances, _denorem);
    }
    
    function redeem(address[] memory _erc20Addresss, uint256[] memory balances) public  {
        for(uint i=0; i<_erc20Addresss.length; i++) {
            aaveCore = AaveCoreInterface(aaveProvider.getLendingPoolCore());
            atoken = ATokenInterface(aaveCore.getReserveATokenAddress(_erc20Addresss[i]));
            atoken.redeem(balances[i]);
            bpool.unbind(address(_erc20Addresss[i]));
        }
    }
    
    function finalize() public {
        bpool.finalize();
    }
    
    function setController(address _addr) public {
        bpool.setController(_addr);
    }
    
}