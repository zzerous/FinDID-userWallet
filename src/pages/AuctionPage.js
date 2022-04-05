import React, { Component } from 'react'
import { connect } from 'react-redux'
import AuctionFeed from 'components/AuctionFeed'
import UserAuctionFeed from 'components/UserAuctionFeed'
import AuctionButton from 'components/AuctionButton'
import UserWallet from 'components/UserWallet'
import './AuctionPage.scss'

class AuctionPage extends Component {

  render(){
    const { isUserAuction } = this.props;
    console.log(isUserAuction);
    return (
      <main className="AuctionPage">
        {isUserAuction ? <UserAuctionFeed/> : <UserWallet/>}
        {isUserAuction ? <AuctionButton/> : null}
      </main>    
    )
  }
}

const mapStateToProps = (state) => ({
  isUserAuction: state.auctions.userAuction,
})

export default connect(mapStateToProps, null)(AuctionPage)