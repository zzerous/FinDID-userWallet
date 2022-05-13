import React, { Component } from 'react'
import { connect } from 'react-redux'
import ui from 'utils/ui'
import Button from 'components/Button'
import Input from 'components/Input'
import axios from 'axios';
const didServiceURL = "http://203.250.77.154:5000/"
const MY_SERVER = "http://203.250.77.156:9000/"

import './DownloadContent.scss'

class DIDUtils extends Component {
  constructor(props) {
    super(props)
    this.state = {
        uName: '',
        regNum: '',
        phoneNum: '',
        publicKey: '',
        keyType: '',
        isReSearch: false, 
        addr: klaytn.selectedAddress
    }
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  issueDid = async (e) => {
    const { uName, regNum, phoneNum, addr } = this.state;

    e.preventDefault();
    const resDID = await axios({
        url: didServiceURL+"create",
        method: "post",
        data: {
            name: uName,
            regNum: regNum,
            phone: phoneNum,
            address: klaytn.selectedAddress
        },
        json: true
    })
    //console.log('DID Service '+resDID.statusText);
    //const userInfo = resDID.body; //object형태로 다시 정리하기
    console.log(resDID);
    const re = resDID.data.reSearch

    if (re) {
      const resInfo = await axios({
        url: MY_SERVER+"issue-did",
        method: "post",
        data: {
          publicKey: addr,
        },
        json: true
    })
      
      this.setState({
        isReSearch : true
      });


    } else {
        const resInfo = await axios({
          url: MY_SERVER+"issue-did",
          method: "post",
          data: {
            did: resDID.data.did,
            publicKey: resDID.data.publicKey,
            publicKeyID: resDID.data.publicKeyID,
            keyType: resDID.data.keyType,
          },
          json: true
      })
      //console.log('Save UserInfo - issue did '+resDID.statusText);
      console.log(resInfo);
      
    }
    
  }

  searchDID = async (e) => {
    const { uName, regNum, phoneNum, addr } = this.state;
    e.preventDefault();
    const resDID = await axios({
        url: didServiceURL+"searchDID",
        method: "post",
        data: {
            name: uName,
            regNum: regNum,
            phone: phoneNum,
            address: addr
        },
        json: true
    })
    console.log(resDID);
    //console.log('DID Service - search did '+resDID.statusText);
    const userInfo = resDID;

    //search된 did 어떻게 show할지 ?

  }

  reSearchDid = async (e) => {
    const { uName, regNum, phoneNum, addr } = this.state;
    e.preventDefault()

    // const uInfoPATH = `/home/young/klaytn-wallet/did-wallet/static/meta-${addr}.json`;
    // const uInfoMeta = await fetch(`${MY_SERVER}/get-file?path=${uInfoPATH}`);
    // const uInfo = await uInfoMeta.json();
    // console.log(uInfo);

    const resDID = await axios ({
      url: didServiceURL+"reSearchDID",
      method: "post",
      data: {
        name: uName,
        regNum: regNum,
        phone: phoneNum,
        address: addr,
        keyType: 'EcdsaSecp256k1RecoveryMethod2020',
      },
      json: true
    })
    console.log(resDID);
    
    const didInfo = resDID.data;
    const res = await axios ({
      url: MY_SERVER+"update-did",
      method: "post",
      data: {
        did: didInfo.did,
        publicKey: didInfo.publicKey,
        publicKeyID: didInfo.publicKeyID,
        keyType: didInfo.keyType,
      },
      json: true
    })
    console.log(res);


    //search된 did 어떻게 show할지 ?
  }

  
  render() {
    const { type } = this.props;
    const { uName, regNum, phoneNum, isReSearch } = this.state;
    return (
      <div className="DownloadContent">
        <Input
          className="DownloadContent__infoType"
          name="uName"
          label="User name"
          value={uName}
          onChange={this.handleInputChange}
          placeholder="홍길동"
          required
        />
        <Input
          className="DownloadContent__infoName"
          name="regNum"
          label="Register Number"
          value={regNum}
          onChange={this.handleInputChange}
          placeholder="890704-1234567"
          required
        />
        <Input
          className="DownloadContent__infoName"
          name="phoneNum"
          label="Phone Number"
          value={phoneNum}
          onChange={this.handleInputChange}
          placeholder="01012345678"
          required
        />
        { !isReSearch && type == "create" && <Button className="DownloadContent__auction" onClick={this.issueDid} title="Create DID" />}
        { !isReSearch && type == "search" && <Button className="DownloadContent__auction" onClick={this.searchDID} title="Search DID"/>}
        { isReSearch && <Button className="DownloadContent__auction" onClick={this.reSearchDid} title="Re-Search DID" /> }
      </div>
    )
  }
}

export default DIDUtils;
