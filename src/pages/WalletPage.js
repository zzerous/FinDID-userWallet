import React, { Component } from 'react'
import { connect } from 'react-redux'
import UserWallet from 'components/UserWallet'
import './WalletPage.scss'

class WalletPage extends Component{
    
    render(){
        const { isUserAuction } = this.props;
        return (
            <main className = "WalletPage">
                {isUserAuction ?  null : <UserWallet/> }
            </main>
        )
    }
}

const mapStateToProps = (state) => ({
    isUserAuction: state.auctions.userAuction,
})

export default connect(mapStateToProps, null)(WalletPage)