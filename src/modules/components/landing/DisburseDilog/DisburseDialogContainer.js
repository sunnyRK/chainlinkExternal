import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import DisburseDialog from './DisburseDialog';

import web3 from "../../../../../config/web3";
import { 
  getPodFactoryContract,
  getAaavePodContract,
  getPodStorageContract
} from "../../../../../config/instances/contractinstances";

class DisburseDialogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onDisburseClick = async (event) => {
    event.preventDefault();
    this.props.handleState({ isDisburseDialogOpen: false });
    const accounts = await web3.eth.getAccounts();

    const podFactoryContract = await getPodFactoryContract(web3);
    const getPods = await podFactoryContract.methods.getPods().call();
    const aavePodContract = await getAaavePodContract(web3, getPods[getPods.length-2]);

    const podContract = await getPodStorageContract(web3);
    const betIds = await podContract.methods.getBetIdArrayOfManager(accounts[0]).call();
    let shouldDisburse = false;
    let isWinnerDeclare = true;
    let winnerAddress;

    if(betIds.length == 0) {
      alert("You can't disburse");
    } else if(betIds.length == 1) {
      isWinnerDeclare = await podContract.methods.getWinnerDeclare(betIds[betIds.length-1]).call();
      winnerAddress = await podContract.methods.getWinnerAddress(betIds[betIds.length-1]).call();
      if(winnerAddress != "0x0000000000000000000000000000000000000000" && !isWinnerDeclare){
        await aavePodContract.methods.disburseAmount(
          betIds[betIds.length-1]
        ).send({
          from: accounts[0]
        });
      } else {
        alert("You can't disburse");
      }
    } else {
      isWinnerDeclare = await podContract.methods.getWinnerDeclare(betIds[betIds.length-2]).call();
      winnerAddress = await podContract.methods.getWinnerAddress(betIds[betIds.length-2]).call();
      if(winnerAddress != "0x0000000000000000000000000000000000000000" && !isWinnerDeclare){
        await aavePodContract.methods.disburseAmount(
          betIds[betIds.length-2]
        ).send({
          from: accounts[0]
        });
      } else {
        alert("You can't disburse");
      }
    }

    // if(shouldDisburse && !isWinnerDeclare) {
    //   await aavePodContract.methods.disburseAmount(
    //     betIds[betIds.length-2]
    //   ).send({
    //     from: accounts[0]
    //   });
    // } else {
    //   alert("You can't disburse");
    // }
  }

  render() {
    return (
      <Dialog
        className="custom-dialog custom-content-style join-dialog"
        open={this.props.openDialog}
      >
        <DialogTitle className="dialog-title">
          Disburse Last Pod Amounts
          <IconButton
            onClick={() => { this.props.handleState({ isDisburseDialogOpen: false }); }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="dialog-content join-dialog">
          <DisburseDialog onDisburseClick={this.onDisburseClick} />
        </DialogContent>
      </Dialog>
    );
  }
}

export default DisburseDialogContainer;
