import React, { Component } from 'react';
import caver from 'klaytn/caver'
import classnames from 'classnames';
import WalletOverview from 'components/WalletOverview';
import UserCurrencyDisplay from 'components/UserCurrencyDisplay';
import Identicon from 'components/Identicon';
import DidButton from 'components/DidButton';
import DIDUtils from 'components/DIDUtils';
//import SearchDID from 'components/SearchDID';
import ui from 'utils/ui'
import {
    getNativeCurrencyImage
} from 'utils/util'
const DID_CREATE_IMAGE_URL = '/images/create.png';
const DID_SEARCH_IMAGE_URL = '/images/search.png';
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
              className={className}
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
              buttons={
                <>
                  <DidButton
                    className="klay-overview__button"
                    image={DID_CREATE_IMAGE_URL}
                    label="DID CREATE"
                    onClick={() => ui.showModal({
                      header: 'Create DID',
                      content: (
                        <DIDUtils type="create"/>
                    ),
                    })}
                  />
                  <DidButton
                    className="klay-overview__button"
                    image={DID_SEARCH_IMAGE_URL}
                    label="DID SEARCH"
                    onClick={() => ui.showModal({
                      header: 'Search DID',
                      content: (
                        <DIDUtils type="search"/>
                      ),
                    })}
                  />
                </>
              }
              icon={<Identicon diameter={32} image={primaryTokenImage} imageBorder />}
          />
        )
    }
}

export default KlayOverview;
