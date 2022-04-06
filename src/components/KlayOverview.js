import React, { Component } from 'react';
import caver from 'klaytn/caver'
import classnames from 'classnames';
import WalletOverview from 'components/WalletOverview';
import UserCurrencyDisplay from 'components/UserCurrencyDisplay';
import Identicon from 'components/Identicon';
import {
    getNativeCurrencyImage
} from 'utils/util'
import './KlayOverview.scss'


class KlayOverview extends Component {
    state = {
        balance: '0',
    }

    componentDidMount() {
        this.getBalance(klaytn.selectedAddress)
    }

    getBalance = (account) => {
        if (!account) return
        caver.klay.getBalance(account).then((balance) => {
            this.setState({
                balance: caver.utils.fromPeb(balance, 'KLAY'),
            })
        })
    }

    render(){
        const {className} = this.props
        const primaryTokenImage = getNativeCurrencyImage()
        return(
            <WalletOverview
            balance={
                <div className="klay-overview__balance">
                  <div className="klay-overview__primary-container">
                    <UserCurrencyDisplay
                      className={classnames('klay-overview__primary-balance')}
                      value={Math.round(this.state.balance * 1000000)/1000000} 
                      numberOfDecimals={4}
                      hideTitle
                    />
                  </div>
                </div>
            }
            className={className}
            icon={<Identicon diameter={32} image={primaryTokenImage} imageBorder />}
          />
        )
    }
}

export default KlayOverview;
