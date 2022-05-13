import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';
import Button from 'components/Button';
import './Credential.scss'
const dbURL = "http://203.250.77.156:9000/"

export default class Credential extends Component {
  static defaultProps = {
    defaultActiveTabName: null,
    onTabClick: null,
    tabsClassName: undefined,
  };

  createcredential = async (e) => {

    const res = await axios({
    url: dbURL+"create-credential",
    method: "post",
    data:{
      cid: '1',
      ciid: '01',
      claims: 'claims',
      issuerdid: 'did:wallet:18000',
      ownerdid: 'did:owner:18000',
      issuerpkid: '#issuerid',
      ownerpkid: '#ownerid',
      infos: 'signing'
    },
    json:true
    })
    console.log(res);
  }
  
  getVCiid = async (e) => {
    const res = await axios({
      url: dbURL+"get-vciid",
      method: "post",
      data:{
        address: klaytn.selectedAddress,
        cid:'1'
      },
      json:true
    })
    console.log(res);
  }

  getissuerPKID = async (e) => {
    const res = await axios({
      url: dbURL+"get-issuerPKID",
      method: "post",
      data:{
        issuerDID:'did:wallet:18000'
      },
      json:true
    })
    console.log(res);
  }

  render() {
    return (
      <div className="credential">
        {/* <div className="credential__content"> cred</div> */}
        <Button
          className="DownloadContent__auction"
          onClick={this.createcredential}
          title="Credential create test"
        />
        <Button
          className="DownloadContent__auction"
          onClick={this.getVCiid}
          title="get VC IID test"
        />
        <Button
          className="DownloadContent__auction"
          onClick={this.getissuerPKID}
          title="get Issuer PKID test"
        />
      </div>
    );
  }

}
