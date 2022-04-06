import React from 'react';
import classnames from 'classnames';
import './WalletOverview.scss'

const WalletOverview = ({ balance, className, icon }) => {
  return (
    <div className={classnames('wallet-overview', className)}>
      <div className="wallet-overview__balance">
        {balance}
        {icon}
      </div>
      {/* <div className="wallet-overview__buttons">{buttons}</div> */}
    </div>
  );
};

export default WalletOverview;
