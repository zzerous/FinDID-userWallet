import React, { Component } from 'react';
import classnames from 'classnames';
import Credential from 'components/Credential'
import Presentation from 'components/Presentation'

export default class VerifiableItem extends Component {
  static defaultProps = {
  };

  renderCredential() {
    return(
      <Credential/>
    );
  }

  renderPresentation() {
    return(
      <Presentation/>
    );
  }
  render() {
    const { type } = this.props;
    return (
      <div className="verifiable">
        {type == 'Credential' ? <div className = "verifiable__credential">{this.renderCredential()}</div> 
        : <div className = "verifiable__presentation">{this.renderPresentation()}</div>}
      </div>
    );
  }

}
