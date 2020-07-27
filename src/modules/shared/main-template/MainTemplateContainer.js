import React, { Component } from 'react';

import MainTemplate from './MainTemplate';
import web3 from '../../../../config/web3';
import NetworkTypeDialogContainer from './NetworkTypeDialog/NetworkTypeDialogContainer';

class MainTemplateContainer extends Component {
  state = {
    displayMessage: '',
    metamaskLoginMessage: '',
    metamaskLoading: false,
    metamaskAddress: '',
  };

  async componentDidMount() {
    let networkType;
    this.setState({ metamaskLoading: true });
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      this.enablewindow();
      this.setState({
        metamaskLoginMessage: 'Connect your metamask account (& reload)',
        metamaskLoading: false,
        metamaskAddress: accounts[0],
      });
    } else {
      this.setState({ metamaskAddress: accounts[0], metamaskLoading: false });
    }

    await web3.eth.net.getNetworkType()
      .then((type) => {
        networkType = type;
      });

    if (networkType !== 'kovan') {
      this.setState({
        displayMessage: `Network Error: Change network ${networkType} to kovan`,
      });
    } else {
      this.setState({ displayMessage: '' });
    }
  }

  enablewindow = async () => {
    await window.ethereum.enable();
  }

  render() {
    const { children } = this.props;
    const { displayMessage, metamaskLoginMessage, metamaskAddress } = this.state;
    return (
      <>
        <MainTemplate
          metamaskAddress={metamaskAddress}
        >
          {children}
        </MainTemplate>
        <NetworkTypeDialogContainer
          displayMessage={metamaskLoginMessage || displayMessage}
          openDialog={metamaskLoginMessage || displayMessage}
        />
      </>
    );
  }
}

export default MainTemplateContainer;
