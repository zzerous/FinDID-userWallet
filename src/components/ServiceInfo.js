import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import caver from 'klaytn/caver'
import './ServiceInfo.scss'
const MY_SERVER = "http://203.250.77.156:9000"
const VERIFY_SERVER = "http://203.250.77.154:8000"

import * as contentActions from 'redux/actions/contents'


class ServiceInfo extends Component {
  state = {
    balance: '0',
  }

  componentDidMount() {
    this.getServiceList()
  }

  getServiceList = () => {

  }

  serviceConnect = async () => {
      const { setEndPoint, verifyEndPoint } = this.props;

      //user-info read
      const uInfoPath = `/home/young/klaytn-wallet/did-wallet/static/meta-${klaytn.selectedAddress}.json`;
      let res = await fetch(`${MY_SERVER}/get-file?path=${uInfoPath}`);
      const uInfo = await res.json();

      //did-sign
      const resSign = await axios({
          url: MY_SERVER+"/get-didSign",
          method: "post",
          data: {
              data: uInfo.did
          },
          json: true
      })
      console.log(resSign);
      
      //get-accesstoken
      const resAccess = await axios({
          url: VERIFY_SERVER+'/accessToken',
          method: "post",
          data: {
              did: uInfo.did,
              publicKey: uInfo.publicKey,
              publicKeyID: uInfo.publicKeyID,
              keyType: uInfo.keyType,
              signature: resSign.data
          }
      })

      console.log(resAccess);
      const accessToken = resAccess.data.accessToken;
      const endPoint = resAccess.data.endPoint;

      //get-claimlist
      const resClaimProp = await axios({
          url: endPoint,
          method: "post",
          data: {
              accessToken: accessToken,
          },
          json: true
      })
    //   .then(function (response){
    //       console.log(response);
    //   })
      console.log(resClaimProp);
      const claimProp = resClaimProp.data.claimPro;
      const resEndPoint = resClaimProp.data.endPoint;

      const result = await setEndPoint(resEndPoint);


    //   //vp verifying
    //   const resVerifying = await axios({
    //       url: endPointToVeri,
    //       method: "post",
    //       data: {
    //           vp: vp
    //       },
    //       json: true
    //   })
    //   console.log(resVerifying)
  }


  render() {
    return (
      <div className="ServiceInfo">
          <button
            className = "ServiceInfo__servicebtn"
            name = "Service"
            onClick = {this.serviceConnect}
          >service 01</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  verifyEndPoint: state.contents.verifyEndPoint,
})

const mapDispatchToProps = (dispatch) => ({
  setEndPoint: (endPoint) => 
    dispatch(contentActions.setEndPoint(endPoint)),
  
})  
  
export default connect(mapStateToProps, mapDispatchToProps)(ServiceInfo)

