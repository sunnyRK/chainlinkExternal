import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Button } from '@material-ui/core';

import DaiIcon from '../../../../assets/icons/dai.svg';
import BatIcon from '../../../../assets/icons/bat.svg';

const options = [
  {
    key: 'DAI',
    text: (
      <div className="token-price-pair">
        <img src={DaiIcon} className="ui avatar image" alt="coin" />
        &nbsp;20$
      </div>
    ),
    value: 'DAI',
  },
  {
    key: 'BAT',
    text: (
      <div className="token-price-pair">
        <img src={BatIcon} className="ui avatar image" alt="coin" />
        &nbsp;20$
      </div>
    ),
    value: 'BAT',
  },
];

const JoinDialog = ({ onJoinClick }) => (
  <div className="join-dialog-content">
    <FormControl fullWidth variant="outlined" classes={{ root: 'token-price-dropdown' }}>
      <InputLabel>Choose Your Token</InputLabel>
      <Select
        // value={checkPairAddress}
        // onChange={handlecheckPairs}
        label="Choose Your Token"
      >
        {
          options.map((option) => (
            <MenuItem value={option.value}>{option.text}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
    <div className="form-field join-dialog-footer">
      <Button
        className="join-submit-button"
        variant="outlined"
        onClick={() => onJoinClick()}
      >
        Join
      </Button>
    </div>
  </div>
);

export default JoinDialog;
