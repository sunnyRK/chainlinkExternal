import React from 'react';
import { Button } from '@material-ui/core';

const DisburseDialog = ({ onDisburseClick }) => (
  <form onSubmit={onDisburseClick} className="join-dialog-content">
    <h3>Are you sure?</h3>
    <div className="form-field join-dialog-footer">
      <Button
        className="join-submit-button"
        variant="outlined"
        type="submit"
      >
        Disburse
      </Button>
    </div>
  </form>
);

export default DisburseDialog;
