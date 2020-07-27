# Alarm-POD

## Alarm-POD developed during Unitize-SFBW Hackathon By Gitcoin Community.

Alarm-POD is no-loss and crypto saving platform to win interest using trustless blockchain technology.

Platform arrange the pod for crypto users. And where users will deposit DAI or any other stablecoins tokens on POD to win the interest. Platform will accure the interest on deposited tokens by participants using AAVE interest bearing tokens for particular time-period. 

The platform will create pod for particular time-period. Platform uses `Chainlink Alarm Clock External Adapters` to recognize that time-period is finished or not. Once the time-period complete, callback function of chainlink alarm clock calls the `Chainlink VRF` to `requestRandomness` to choose the trustless winner among the participants. 

## How to run

1. Clone repo `https://github.com/sunnyRK/chainlinkExternal.git`
2. `cd chainlinkExternal` 
2. `npm install`
3. `node server.js`
4. Currently deployed on Kovan Network

## Current Future Task in mind

1. Use ENS(Ethreum name service) to give more flexibilty to user.

## Tech stack

Ethereum   
Solidity   
Web3.js  
Chainink Decentralized Oracles  
    - Chainlink Alarm Clock - To wait for particular time-period to finish POD  
    - Chainlink VRF - To choose winner
AAVE - To Earn interes  
Next.Js  
Semantic UI React

