import React, { Component } from 'react';
import PropTypes from 'prop-types';
import copyToClipboard from 'copy-to-clipboard';
import { connect } from 'react-redux'

import { toChecksumHexAddress } from 'utils/crypto'
import { shortenAddress } from 'utils/util'

import './SelectedAccount.scss'

class SelectedAccount extends Component {
  state = {
    copied: false,
  };

  componentDidMount(){
    this.copyTimeout = null;
  }

  componentWillUnmount() {
    if(this.copyTimeout){
      clearTimeout(this.copyTimeout);
      this.copyTimeout = null;
    }
  }

  render() {
    const { selectedIdentity } = this.props;
    const checksummedAddress = toChecksumHexAddress(selectedIdentity);

    return (
      <div className="selected-account">
        <button
            className="selected-account__clickable"
            onClick={() => {
              this.setState({ copied: true });
              this.copyTimeout = setTimeout(
                () => this.setState({ copied: false }),
                (1*1000) * 3,
              );
              copyToClipboard(checksummedAddress);
            }}
        >
            <div className="selected-account__name">
              {/* {selectedIdentity.name} */}
            </div>
            <div className="selected-account__address">
              {shortenAddress(checksummedAddress)}
              <div className="selected-account__copy">
            </div>
            </div>
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
    selectedIdentity: state.login.address,
})

export default connect(mapStateToProps, null)(SelectedAccount);
