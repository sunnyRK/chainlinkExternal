import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import NetworkTypeDialog from './NetworkTypeDialog';

class NetworkTypeDialogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Dialog
        // onClose={handleClose}
        // aria-labelledby="simple-dialog-title"
        className="custom-dialog custom-content-style"
        open={this.props.openDialog}
      >
        <DialogTitle className="dialog-title">Set backup account</DialogTitle>
        <DialogContent className="dialog-content">
          <NetworkTypeDialog displayMessage={this.props.displayMessage} />
        </DialogContent>
      </Dialog>
    );
  }
}

export default NetworkTypeDialogContainer;
