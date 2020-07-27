const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
let web3;
if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
}else{
    // we are in the server and matamask is not using by user
    provider = new Web3.providers.HttpProvider (
        'https://kovan.infura.io/v3/944f5399c18049d9920b3bc9c60583de'
    );
    web3 = new Web3(provider);
}
// export default web3;
module.exports = web3
