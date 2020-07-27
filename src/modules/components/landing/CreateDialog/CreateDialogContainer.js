import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import CreateDialog from './CreateDialog';

import web3 from "../../../../../config/web3";
import { 
  getPodFactoryContract,
  getPodStorageContract
} from "../../../../../config/instances/contractinstances";

class CreateDialogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      podName: '',
      joinAmt: '',
      totalDays: '',
      numStakers: ''
    };
  }

  onCreateClick = async (event) => {
    event.preventDefault();
    this.props.handleState({ isCreateDialogOpen: false });
    const accounts = await web3.eth.getAccounts();

    const podContract = await getPodStorageContract(web3);

    const betIds = await podContract.methods.getBetIdArrayOfManager(accounts[0]).call();
    let isWinnerDeclareofLast = false;
    let isWinnerDeclareofCurrent = false;
    let winnerAddress;

    if(betIds.length <= 0) {
      isWinnerDeclareofLast = true;
      isWinnerDeclareofCurrent = true;
    } else if(betIds.length == 1) {
      // isWinnerDeclareofLast = await podContract.methods.getWinnerDeclare(betIds[betIds.length-1]).call();
      isWinnerDeclareofLast = true;
      winnerAddress = await podContract.methods.getWinnerAddress(betIds[betIds.length-1]).call();
      if(winnerAddress != "0x0000000000000000000000000000000000000000") {
        isWinnerDeclareofCurrent = true;
      }
    } else {
      isWinnerDeclareofLast = await podContract.methods.getWinnerDeclare(betIds[betIds.length-2]).call();
      winnerAddress = await podContract.methods.getWinnerAddress(betIds[betIds.length-1]).call();
      if(winnerAddress != "0x0000000000000000000000000000000000000000") {
        isWinnerDeclareofCurrent = true;
      }
    }

    if(isWinnerDeclareofLast && isWinnerDeclareofCurrent) {
      const podFactoryContract = await getPodFactoryContract(web3);
      await podFactoryContract.methods.createPod(
        web3.utils.toWei(this.state.joinAmt.toString(), "ether"),
        this.state.numStakers,
        this.state.totalDays,
        // (parseInt(this.state.totalDays)*1440),
        "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD",
        "0x58ad4cb396411b691a9aab6f74545b2c5217fe6a",
        this.state.podName
      ).send({
        from: accounts[0]
      });
    } else {
      alert("Please wait for disburse old pod!");
    }
  }

  handleState = (value, callback) => {
    this.setState(value, () => {
      if (callback) callback();
    });
  }

  render() {
    return (
      <Dialog
        className="custom-dialog custom-content-style join-dialog"
        open={this.props.openDialog}
      >
        <DialogTitle className="dialog-title">
          Create Pod
          <IconButton
            onClick={() => { this.props.handleState({ isCreateDialogOpen: false }); }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="dialog-content join-dialog">
          <CreateDialog 
            handleState={this.handleState}
            onCreateClick={this.onCreateClick} 
            podName={this.state.podName}
            joinAmt={this.state.joinAmt}
            totalDays={this.state.totalDays}
            numStakers={this.state.numStakers}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

export default CreateDialogContainer;
