import React, { Component } from 'react';
import { connect } from 'react-redux'
import DownloadContent from 'components/DownloadContent'
import Loading from 'components/Loading'
import CreateVP from 'components/CreateVP'
import CreatePresentation from 'components/CreatePresentation'
import ui from 'utils/ui'
import axios from 'axios';
import { shortenAddress } from 'utils/util'
import './Credential.scss'
const issuerURL = "http://203.250.77.154:6060"
const MY_SERVER = "http://203.250.77.156:9000"

import * as contentActions from 'redux/actions/contents'

class Credential extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: !props.vc,
      type: "VC",
      addr: klaytn.selectedAddress
    }
  }


  static getDerivedStateFromProps = (nextProps, prevState) => {
    const isUpdatedVC = (nextProps.vc !== prevState.vc) && (nextProps.vc !== null)
    if (isUpdatedVC) {
      return { isLoading: false }
    }
    return null
  }
  
  componentDidMount() {
    const { vc, getFiles } = this.props;
    const { type, addr } = this.state;
    if (!vc) {
      getFiles(type, addr);
    }
  }

  createVC = async (e) => {
    const { addr } = this.state;
    e.preventDefault()

    const uInfoPATH = `/home/young/klaytn-wallet/did-wallet/static/meta-${addr}.json`;
    const uInfoMeta = await fetch(`${MY_SERVER}/get-file?path=${uInfoPATH}`);
    const uInfo = await uInfoMeta.json();
    
    const resSign = await axios({
      url: MY_SERVER+'/get-didSign',
      method: 'post',
      data: {
        data: uInfo.did
      },
      json: true
    })
    console.log(resSign);
    const signedDID = resSign.data;

    const resVC = await axios({
      url: issuerURL+'/vc',
      method: "post",
      data: {
        did: uInfo.did,
        publicKeyID: uInfo.publicKeyID,
        address: addr,
        signature: signedDID
      },
      json: true
    })
    console.log(resVC);

    const setVC = await axios({
      url: MY_SERVER+'/issue-credential',
      method: "post",
      data: {
        vc: resVC.data,
        address: addr        
      },
      json: true
    })
    console.log(setVC);
  }

  render() {
    const { vc } = this.props
    if (this.state.isLoading) return <Loading />
    return (
      <>
      <div className="credentials">
        {vc.length !== 0
          ? vc.map(({
              cid,
              claims,
            }) => {
              let SRC = "/images/icon-tx.svg";
              return (
                <div 
                  className="credential" 
                  key={cid}
                  onClick={() => ui.showModal({
                    header: 'Create Presentation',
                    content: (
                      <CreatePresentation 
                        cid = {cid}
                        claims = {claims}
                      />
                    ),
                  })}
                >
                <div className="credential__image">
                  <img 
                  src={SRC} alt="image" />
                </div>
                <h2 className="credential__info">{shortenAddress(cid)}</h2>
              </div>
            )
          })
          : <div>
              <span className="credential__empty">No Credential :D</span>
            </div>
        }
          
      </div>
      <button 
            className="credential__create" 
            onClick={this.createVC}
          >
            Create Credential
          </button>
      </>
    );
  }

}

const mapStateToProps = (state) => ({
  vc: state.contents.vc,

})

const mapDispatchToProps = (dispatch) => ({
  getFiles: (type, addr) => 
  dispatch(contentActions.getFiles(type, addr)),
  
})


export default connect(mapStateToProps, mapDispatchToProps)(Credential)