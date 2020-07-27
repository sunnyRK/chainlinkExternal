import React from 'react';
import { Button } from '@material-ui/core';

const RedeemDialog = ({ onConfirmClick, onCancelClick }) => (
  <div className="redeem-dialog-content">
    <h3>Are you sure you want to step back and redeem your amount from pod?</h3>
    <div className="form-field redeem-dialog-footer">
      <Button
        className="redeem-cancel-button"
        variant="outlined"
        onClick={() => onCancelClick()}
      >
        Cancel
      </Button>
      <Button
        className="redeem-confirm-button"
        variant="outlined"
        onClick={() => onConfirmClick()}
      >
        Confirm
      </Button>
    </div>
  </div>
);

export default RedeemDialog;
