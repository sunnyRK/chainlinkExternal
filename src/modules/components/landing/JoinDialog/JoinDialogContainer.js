import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import JoinDialog from './JoinDialog';

import web3 from "../../../../../config/web3";
import { 
  getPodFactoryContract,
  getAaavePodContract,
  getERCContractInstance,
  getPodStorageContract
} from "../../../../../config/instances/contractinstances";

class JoinDialogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onJoinClick = async () => {
    this.props.handleState({ isJoinDialogOpen: false });
    const accounts = await web3.eth.getAccounts();
    const podContract = await getPodStorageContract(web3);
    const runningPodbetId = await podContract.methods.getRunningPodBetId().call();    
    const minimumContribution = await podContract.methods.getMinimumContribution(runningPodbetId).call();

    const podFactoryContract = await getPodFactoryContract(web3);
    const getPods = await podFactoryContract.methods.getPods().call();
    const aavePodContract = await getAaavePodContract(web3, getPods[getPods.length-1]);
    const regularToken = await aavePodContract.methods.regularToken().call();
    const ercContract = getERCContractInstance(web3, regularToken);

    const allowance = await ercContract.methods.allowance(accounts[0], getPods[getPods.length-1]).call();

    // if(allowance < minimumContribution) {
      await ercContract.methods.approve(getPods[getPods.length-1], minimumContribution).send({
        from:accounts[0]
      })
    // } 

    await aavePodContract.methods.addStakeOnBet(runningPodbetId, minimumContribution).send({
      from: accounts[0]
    })
  };

  render() {
    return (
      <Dialog
        className="custom-dialog custom-content-style join-dialog"
        open={this.props.openDialog}
      >
        <DialogTitle className="dialog-title">
          Join
          <IconButton
            onClick={() => { this.props.handleState({ isJoinDialogOpen: false }); }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="dialog-content join-dialog">
          <JoinDialog onJoinClick={this.onJoinClick} />
        </DialogContent>
      </Dialog>
    );
  }
}

export default JoinDialogContainer;
