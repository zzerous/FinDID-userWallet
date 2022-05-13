import React,{Component}  from 'react'
import { connect } from 'react-redux'
import ServiceInfo from 'components/ServiceInfo'
import ui from 'utils/ui'
import cx from 'classnames'
import {isNull} from 'lodash'
import networks from 'constants/networks'

import * as loginActions from 'redux/actions/login'
import * as aucActions from 'redux/actions/auctions'

import './Nav.scss'

class Nav extends Component {
  state={
    network:null,
  }
  componentDidMount(){
    this.setNetworkInfo()
  }

  showAddressInfo = () => {
    const {klaytn} = window
    if (klaytn === undefined) return

    klaytn.enable()
  }

  setNetworkInfo = () => {
    const { klaytn } = window
    if (klaytn === undefined) return

    this.setState({ network: klaytn.networkVersion })
    klaytn.on('networkChanged', () => this.setNetworkInfo(klaytn.networkVersion))
  }

  render(){
    const { address, logout, title, userAuction } = this.props
    const { network } = this.state
    console.log(this.props)
    return(
      <header className="Nav">
        <div className="Nav__inner">
          <h1 className="Nav__logo">
            {title}
          </h1>
          <div className="Nav__menus">
            <button
              className="Nav__wallet"
              alt="Service Info"
              onClick={() => ui.showModal({
                header: 'Available Service',
                content: (
                  <ServiceInfo />
                ),
              })}
            >
              Service
            </button>

            <button
              className="Nav__logout"
              alt="Logout"
              onClick={logout}
            >
              Logout
            </button>

            <div className={cx('Nav__network', {
              'Nav__network--error': isNull(network),
              'Nav__network--loading': network === 'loading',
            })}>
            <span>&#9679;</span>
            {isNull(network) ? 'No connection' : networks[network]}
            </div>
          </div>
        </div>
      </header>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(loginActions.logout()),

  userAuction: () => dispatch(aucActions.activeUserAuction()),
})

export default connect(null, mapDispatchToProps)(Nav)
