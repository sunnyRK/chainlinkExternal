import React from 'react';
import Button from '@material-ui/core/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import BlockUI from 'react-block-ui';

import DaiIcon from '../../../assets/icons/dai.svg';
import GoogleLoader from '../../shared/GoogleLoader';
import JoinDialog from './JoinDialog/JoinDialogContainer';
import RedeemDialog from './RedeemDialog/RedeemDilogContainer';
import CreateDialog from './CreateDialog/CreateDialogContainer';
import DisburseDialog from './DisburseDilog/DisburseDialogContainer';

const Landing = ({
  isJoinDialogOpen, handleState, isRedeemDialogOpen, progress, totalWinning, lastWinnerDeclare,
  isCreateDialogOpen, isDisburseDialogOpen, isAdmin, podName, numOfStakers, stakerCount, interestGenerate, minimumContribution, 
  yourInvestment, totalStakeOnBet, lastPodName, lastPrizeAmt, lastWinnerAddress,
  days, hours, seconds, minutes, landingLoading,
}) => {
  const podInfo = [
    {
      header: 'Total Contract Balances',
      value: totalStakeOnBet,
    },
    {
      header: 'Your Investment',
      value: yourInvestment,
    },
    {
      header: 'Joining Amount',
      value: parseInt(minimumContribution)/1e18,
    },
  ];

  const countdownInfo = [
    {
      value: days,
      label: 'Days',
    },
    {
      value: hours,
      label: 'Hours',
    },
    {
      value: minutes,
      label: 'Minutes',
    },
    {
      value: seconds,
      label: 'Seconds',
    },
  ];
  return (
    <BlockUI
      tag="div"
      blocking={landingLoading}
      loader={<GoogleLoader height={50} width={50} />}
      className="block-ui-landing-page"
    >
      <div className="landing">
        <JoinDialog
          openDialog={isJoinDialogOpen}
          handleState={handleState}
        />
        <RedeemDialog
          openDialog={isRedeemDialogOpen}
          handleState={handleState}
        />
        <CreateDialog
          openDialog={isCreateDialogOpen}
          handleState={handleState}
        />
        <DisburseDialog
          openDialog={isDisburseDialogOpen}
          handleState={handleState}
        />
        <div className="pod">
          <h3 className="pod-name">{podName}</h3>
          <div className="join-pod">
            <div className="pod-progressbar">
              <ProgressBar now={progress} />
              <div className="total-investor">{stakerCount}/{numOfStakers}</div>
            </div>
            <div className="button-wrapper">
              <Button
                className="button-content join-pod-button"
                disableRipple
                disableElevation
                onClick={() => handleState({ isJoinDialogOpen: true })}
              >
                Join
              </Button>
              <Button
                className="button-content redeem-button"
                disableRipple
                disableElevation
                onClick={() => handleState({ isRedeemDialogOpen: true })}
              >
                Redeem
              </Button>
            </div>
          </div>
          <div className="stats">
            <div className="stats-info-header">
              <div className="estimated-info">
                <div className="estimated-header">Estimated Prize</div>
                <h1 className="estimated-value">
                  <img src={DaiIcon} className="coin-icon" alt="coin" />
                  &nbsp;{interestGenerate}
                </h1>
              </div>
            </div>
            <div className="stats-info-footer">
              {
                podInfo.map((pod) => (
                  <div className="total-contract-balance stats-info">
                    <div className="stats-header">{pod.header}</div>
                    <h2 className="stats-value">{`$${pod.value}`}</h2>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="timer">
            {
              countdownInfo.map((countdown) => (
                <div className="days-countdown countdown">
                  <h1 className="countdown-value">{countdown.value}</h1>
                  <div className="countdown-footer">{countdown.label}</div>
                </div>
              ))
            }
          </div>
        </div>
        <div className="right-content">
          {
            isAdmin && (
              <div className="create-pod button-wrapper">
                <h4 className="header">Create Pod</h4>
                <Button
                  className="button-style create-button"
                  disableRipple
                  disableElevation
                  onClick={() => handleState({ isCreateDialogOpen: true })}
                >
                  Create
                </Button>
              </div>
            )
          }
          {
            !isAdmin && (
              <div className="total-winning">
                <h4 className="header">Your Total Winning</h4>
                <h4 className="value">{totalWinning}</h4>
              </div>
            )
          }
          <div className="last-pod-winner">
            <h4 className="header">Last Pod Details</h4>
            <div className="winner-info">
              <div className="label">Pod Name</div>
              <h6 className="value">{lastPodName}</h6>
              <div className="label">Prize Amount</div>
              <h6 className="value">{lastPrizeAmt}</h6>
              <div className="label">Winner Address</div>
              <h6 className="value">{lastWinnerAddress}</h6>
              {
                isAdmin ?
                  lastWinnerDeclare
                    ? <div className="disburse-button button-wrapper">
                    <Button
                      className="button-style"
                      disableRipple
                      disableElevation
                    >
                      Prize already disbursed
                    </Button>
                    </div>
                    : <div className="disburse-button button-wrapper">
                    <Button
                      className="button-style"
                      disableRipple
                      disableElevation
                      onClick={() => handleState({ isDisburseDialogOpen: true })}
                    >
                      Disburse
                    </Button>
                  </div>
                : lastWinnerDeclare
                ? <div className="disburse-button button-wrapper">
                <Button
                  className="button-style"
                  disableRipple
                  disableElevation
                >
                  Prize already disbursed
                </Button>
                </div>
                : <div className="disburse-button button-wrapper">
                <Button
                  className="button-style"
                  disableRipple
                  disableElevation
                  onClick={() => handleState({ isDisburseDialogOpen: true })}
                >
                  Prize will be Disbursed soon
                </Button>
              </div>
              }                    
            </div>
          </div>
        </div>
      </div>
    </BlockUI>
  );
};

export default Landing;
