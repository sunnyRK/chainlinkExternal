import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import RedeemDialog from './ReedemDialog';

import web3 from "../../../../../config/web3";
import { 
  getPodFactoryContract,
  getAaavePodContract,
  getERCContractInstance,
  getPodStorageContract
} from "../../../../../config/instances/contractinstances";

class RedeemDialogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onConfirmClick = async () => {
    this.props.handleState({ isRedeemDialogOpen: false });
    const accounts = await web3.eth.getAccounts();
    const podContract = await getPodStorageContract(web3);
    const runningPodbetId = await podContract.methods.getRunningPodBetId().call();    

    const podFactoryContract = await getPodFactoryContract(web3);
    const getPods = await podFactoryContract.methods.getPods().call();
    const aavePodContract = await getAaavePodContract(web3, getPods[getPods.length-1]);

    await aavePodContract.methods.redeemFromBetBeforeFinish(runningPodbetId).send({
      from: accounts[0]
    })
  }

  onCancelClick = () => {
    this.props.handleState({ isRedeemDialogOpen: false });
  }

  render() {
    return (
      <Dialog
        className="custom-dialog custom-content-style redeem-dialog"
        open={this.props.openDialog}
      >
        <DialogTitle className="dialog-title">
          Join
          <IconButton
            onClick={() => { this.props.handleState({ isRedeemDialogOpen: false }); }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="dialog-content redeem-dialog">
          <RedeemDialog
            onConfirmClick={this.onConfirmClick}
            onCancelClick={this.onCancelClick}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

export default RedeemDialogContainer;
