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
  state = { // eslint-disable-line
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
    lastPodName: 'Last Pod name',
    lastPrizeAmt: '0',
    lastWinnerAddress: '0x0000000000000',
    lastWinnerDeclare: false,
    totalWinning: '0',
    timeStamp: 0,
    days: '0',
    hours: '0',
    minutes: '0',
    seconds: '0',
  };

  handleState = (state = {}) => {
    this.setState(state);
  }

  async componentDidMount() {
    try {
      window.ethereum.on('accountsChanged', accounts => {
        window.location.reload(true);
      });
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0 && accounts[0] === '0x48845392F5a7c6b360A733e0ABE2EdcC74f1F4d6') {
        this.handleState({ isAdmin: true });
      }

      const podFactoryContract = await getPodFactoryContract(web3);
      const podContract = await getPodStorageContract(web3);
      const runningPodbetId = await podContract.methods.getRunningPodBetId().call();
      const podName = await podContract.methods.getPodName(runningPodbetId).call();
      const timeStamp = await podContract.methods.getTimestamp(runningPodbetId).call();

      console.log(timeStamp)

      const numOfStakers = await podContract.methods.getNumOfStakers(runningPodbetId).call();
      const stakerCount = await podContract.methods.getStakeCount(runningPodbetId).call();
      let totalWinning = await podContract.methods.getTotalWinning(accounts[0]).call();
      totalWinning = web3.utils.fromWei(totalWinning.toString(), "ether");
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
        const lastWinnerDeclare = await podContract.methods.getWinnerDeclare(betIds[betIds.length-2]).call();
        let lastPrizeAmt;
        if(lastWinnerDeclare) {
          lastPrizeAmt = await podContract.methods.getInterest(betIds[betIds.length-2]).call();
          lastPrizeAmt = web3.utils.fromWei(lastPrizeAmt.toString(), "ether");  //lastInterestGenerate 
        } else {  
          const lastBalanceWithInterest = await aavePodContract.methods.getBalanceofAaveToken(getPods[getPods.length-2]).call();
          let lastTotalStakeOnBet = await podContract.methods.getTotalStakeFromBet(betIds[betIds.length-2]).call();
          const lastInterest = lastBalanceWithInterest - lastTotalStakeOnBet;
          lastPrizeAmt = web3.utils.fromWei(lastInterest.toString(), "ether");  //lastInterestGenerate 
        }

        lastWinnerDeclare

        this.setState({
          lastPodName,
          lastPrizeAmt,
          lastWinnerAddress,
          lastWinnerDeclare
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
        progress,
        timeStamp,
        totalWinning
      }, () => {
        this.countDownTimer();
        setInterval(() => { this.generateInterest(); }, 10000);
      });
    } catch (error) {
      console.log(error);
    }
  }

  generateInterest = async () => {
    const podFactoryContract = await getPodFactoryContract(web3);
    const getPods = await podFactoryContract.methods.getPods().call();
    const podContract = await getPodStorageContract(web3);
    const aavePodContract = await getAaavePodContract(web3, getPods[getPods.length - 1]);
    const runningPodbetId = await podContract.methods.getRunningPodBetId().call();
    const balanceWithInterest = await aavePodContract.methods.getBalanceofAaveToken(getPods[getPods.length - 1]).call();
    const totalStakeOnBet = await podContract.methods.getTotalStakeFromBet(runningPodbetId).call();

    const interest = balanceWithInterest - totalStakeOnBet;
    const interestGenerate = web3.utils.fromWei(interest.toString(), 'ether');
    this.setState({ interestGenerate });
  }

  countDownTimer = () => {
    const { timeStamp } = this.state;
    console.log(timeStamp);
    const countDownDate = timeStamp || Date.now();

    // Update the count down every 1 second
    const x = setInterval(() => {
      // Get today's date and time
      const now = new Date().getTime();
      console.log(now)
      // Find the distance between now and the count down date
      const distance = (countDownDate*1000) - now;

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      this.setState({
        days,
        hours,
        minutes,
        seconds,
      });

      // If the count down is over, write some text
      if (distance < 0) {
        clearInterval(x);
        this.setState({
          days: 'A',
          hours: 'Winner',
          minutes: 'is',
          seconds: 'Declared',
        });
      }
    }, 1000);
  }

  // onCreatePod = async () => {
  //   try {
  //     const accounts = await web3.eth.getAccounts();
  //     const podFactoryContract = await getPodFactoryContract(web3);
      
  //   } catch (error) {
  //     alert(error);
  //   }
  // };

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
          lastWinnerDeclare={this.state.lastWinnerDeclare}
          totalWinning={this.state.totalWinning}
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
