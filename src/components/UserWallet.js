import React, {Component} from 'react'
import {connect} from 'react-redux'
import AccountBar from 'components/AccountBar'
import KlayOverview from 'components/KlayOverview'
import Tabs from 'components/Tabs'

import './UserWallet.scss'

class UserWallet extends Component {
    constructor(props){
        super(props)
        this.state={

        }
    }
    
    render() {
        return(
            <div className="UserWallet-wrapper">
                <div className="UserWallet">
                    <div className="wallet__container">
                        <div className="wallet__main-view">
                            <AccountBar/>
                            <div className="wallet__balance-wrapper">
                                <KlayOverview/>
                            </div>
                            <Tabs
                                tabsClassName="home__tabs"
                            >    
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default connect(null, null)(UserWallet)