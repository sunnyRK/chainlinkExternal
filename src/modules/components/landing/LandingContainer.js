import React, { Component } from 'react';

import MainTemplate from '../../shared/main-template/MainTemplateContainer';
import Landing from './Landing';
import web3 from "../../../../config/web3";
import { 
  getPodFactoryContract,
  getAaavePodContract,
  getPodStorageContract
} from "../../../../config/instances/contractinstances";

class LandingContainer extends Component {
  state = {
    isJoinDialogOpen: false,
    isRedeemDialogOpen: false,
    isDisburseDialogOpen: false,
    isCreateDialogOpen: false,
    isAdmin: false,
    podName: 'Pod Name',
    numOfStakers: '0',
    stakerCount: '0',
    progress: '0',
    interestGenerate: '0',
    minimumContribution: '0',
    yourInvestment: '0',
    totalStakeOnBet: '0',
    lastPodName: 'fake',
    lastPrizeAmt: '0',
    lastWinnerAddress: '0x..',
    days: '5',
    hours: '10',
    minutes: '29',
    seconds: '40'
  };

  handleState = (state = {}) => {
    this.setState(state);
  }

  async componentDidMount() {
    try {
      
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0 && accounts[0] === '0x48845392F5a7c6b360A733e0ABE2EdcC74f1F4d6') {
        this.handleState({ isAdmin: true });
      }

      const podFactoryContract = await getPodFactoryContract(web3);
      const podContract = await getPodStorageContract(web3);
      const runningPodbetId = await podContract.methods.getRunningPodBetId().call();
      const podName = await podContract.methods.getPodName(runningPodbetId).call();
      // const timeStamp = await podContract.methods.getTimestamp(runningPodbetId).call();

      const numOfStakers = await podContract.methods.getNumOfStakers(runningPodbetId).call();
      const stakerCount = await podContract.methods.getStakeCount(runningPodbetId).call();

      // const betIdManager = await podContract.methods.getBetIdManager(runningPodbetId).call();

      const getPods = await podFactoryContract.methods.getPods().call();
      const aavePodContract = await getAaavePodContract(web3, getPods[getPods.length-1]);

      console.log(getPods[getPods.length-1]);
      const balanceWithInterest = await aavePodContract.methods.getBalanceofAaveToken(getPods[getPods.length-1]).call();
      let totalStakeOnBet = await podContract.methods.getTotalStakeFromBet(runningPodbetId).call();

      const interest = balanceWithInterest - totalStakeOnBet;
      const interestGenerate = web3.utils.fromWei(interest.toString(), "ether");
      // console.log(interestGenerate);

      const minimumContribution = await podContract.methods.getMinimumContribution(runningPodbetId).call();

      const investment = await podContract.methods.getStakeforBet(runningPodbetId, accounts[0]).call();
      const yourInvestment = web3.utils.fromWei(investment.toString(), "ether");
      // console.log(minimumContribution);

      totalStakeOnBet = web3.utils.fromWei(totalStakeOnBet.toString(), "ether");

      const betIds = await podContract.methods.getBetIdArrayOfManager("0x48845392F5a7c6b360A733e0ABE2EdcC74f1F4d6").call();

      if(getPods.length > 1) {
        const lastPodName = await podContract.methods.getPodName(betIds[betIds.length-2]).call();
        const lastWinnerAddress = await podContract.methods.getWinnerAddress(betIds[betIds.length-2]).call();
        const isWinnerDeclare = await podContract.methods.getWinnerDeclare(betIds[betIds.length-2]).call();
        let lastPrizeAmt;
        if(isWinnerDeclare) {
          lastPrizeAmt = await podContract.methods.getInterest(betIds[betIds.length-2]).call();
        } else {  
          const lastBalanceWithInterest = await aavePodContract.methods.getBalanceofAaveToken(getPods[getPods.length-2]).call();
          let lastTotalStakeOnBet = await podContract.methods.getTotalStakeFromBet(betIds[betIds.length-2]).call();
          const lastInterest = lastBalanceWithInterest - lastTotalStakeOnBet;
          lastPrizeAmt = web3.utils.fromWei(lastInterest.toString(), "ether");  //lastInterestGenerate 
        }

        this.setState({
          lastPodName,
          lastPrizeAmt,
          lastWinnerAddress
        });
      }

      const mul = stakerCount * 100;
      const progress = mul/numOfStakers;

      console.log(progress)

      this.setState({
        podName,
        numOfStakers,
        interestGenerate, 
        minimumContribution, 
        yourInvestment,
        totalStakeOnBet,
        stakerCount,
        progress
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <MainTemplate>
        <Landing
          handleState={this.handleState}
          isJoinDialogOpen={this.state.isJoinDialogOpen}
          isRedeemDialogOpen={this.state.isRedeemDialogOpen}
          isDisburseDialogOpen={this.state.isDisburseDialogOpen}
          isCreateDialogOpen={this.state.isCreateDialogOpen}
          isAdmin={this.state.isAdmin}
          podName={this.state.podName}
          numOfStakers={this.state.numOfStakers}
          progress={this.state.progress}
          stakerCount={this.state.stakerCount}
          interestGenerate={this.state.interestGenerate}
          minimumContribution={this.state.minimumContribution}
          yourInvestment={this.state.yourInvestment}
          totalStakeOnBet={this.state.totalStakeOnBet}
          // onCreatePod={this.onCreatePod}
          days={this.state.days}
          hours={this.state.hours}
          minutes={this.state.minutes}
          seconds={this.state.seconds}
          lastPodName={this.state.lastPodName}
          lastPrizeAmt={this.state.lastPrizeAmt}
          lastWinnerAddress={this.state.lastWinnerAddress}
        />
      </MainTemplate>
    );
  }
}

export default LandingContainer;
