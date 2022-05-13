import object from 'klaytn/Contracts' //1. contract instance import
import { feedParser } from 'utils/misc'
import axios from 'axios'
const StorageContract = object.StorageContract
const MY_SERVER = 'http://203.250.77.156:9000';

import {
  SET_FEED,
  SET_VC,
  SET_VP,
  SET_EP,
  REQ_CREDENTIAL,
  REQ_ACCESSTOKEN,
  DOWNLOAD_CONTENT,
} from './actionTypes'

const setFeed = (feed) => ({
  type: SET_FEED,
  payload: { feed },
})

// const KlayDIDClient = require('klay-did-auth');
// const klayDID =  new KlayDIDClient({
//   network: 'https://api.baobab.klaytn.net:8651/',
//   regABI: '/home/young/BCON(copy)/did-registry.json',
//   regAddr: '0xbCd509F468Fbc017fE615dE0b9cEfAa1Fbf335A6'
// });

export const updateFeed = (cHash) => async (dispatch, getState) => {
  console.log("Upload hash:"+cHash)
  const address = klaytn.selectedAddress
  await StorageContract.methods.getDownloadCert(cHash).call({from:address})
    .then((newCert) => {
      console.log(newCert)
      const { contents: { feed } } = getState()
      const newFeed = [feedParser(newCert), ...feed]
      dispatch(setFeed(newFeed))
    })
}

export const getFeed = () => async (dispatch) => {
  const address = klaytn.selectedAddress
  console.log(address)
  await StorageContract.methods.previewContents(address).call()
    .then(async (fileMetas) => {
      console.log(fileMetas)
      const fileLen = fileMetas.length;
      if (fileLen == 1) return []
      const feed = []
        for (let i = fileLen; i > 1; i--) {
          const fHash = fileMetas[i-1].cHash;
          const downloadCert = await StorageContract.methods.getDownloadCert(fHash).call({from:address});
          console.log(downloadCert)
          const fState = fileMetas[i-1].state;
          if (fState == 2) //state ==2, cert saved 된것만 feed 가져오기
            feed.push(downloadCert)          
      }
      console.log("success GET FEED!!");
      console.log(feed)
      return Promise.all(feed)
    })
    .then((feed) => dispatch(setFeed(feedParser(feed))))
}

const setVC = (vc) => ({
  type: SET_VC,
  payload: { vc },
})

const setVP = (vp) => ({
  type: SET_VP,
  payload: { vp },
})

export const setEndPoint = (verifyEndPoint) => async (dispatch) => {
  console.log(verifyEndPoint)
  return dispatch({
    type: SET_EP,
    payload: {
      verifyEndPoint: verifyEndPoint,
    },
  })
}

export const getFiles = (type, addr) => async (dispatch) => {
  //type: VC or VP
  const path = `/home/young/klaytn-wallet/did-wallet/static/${type}/${addr}/`;
  const vcList = await fetch(`${MY_SERVER}/get-filelist?path=${path}`);
  const commits = await vcList.json();
  //console.log(commits.filelist); //array

  let vcs = [];
  let vps = [];
  for (let i = 0; commits.filelist.length > i; i++){
    const filePath = `${path}${commits.filelist[i]}`
    const res = await fetch(`${MY_SERVER}/get-file?path=${filePath}`);
    const file = await res.json();
    {type=="VC" ? vcs.push(file) : vps.push(file)}
  }

  if(type=="VC"){
    return dispatch(setVC(vcs));
  } else {
    return dispatch(setVP(vps));
  }
}


export const requestCredential = (
  signature, 
  cName,
  cType,
  cSize,
  cHash,
  fType,
  cDesc,
  ) => async (dispatch) => {
    const verifierEndPoint = "http://203.250.77.152:3000";
    const api = "/user/storage/credential";
    const DID = 'did:kt:'+klaytn.selectedAddress.toLowerCase().substring(2);
    console.log("request__credential")
    const res = await axios.get(verifierEndPoint+api, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },    
      params: {
        did: DID,
        keyid: 'key-1',
        signature: signature,
        contentName: cName,
        contentType: cType,
        contentSize: cSize, 
        contentsMetaHash: cHash,
        contentDesc: cDesc,
        fileType: fType,
        storageDID: 'did:kt:2020ceb117cd12ee85dc22ac8259bd245d998c60',
      }
    })
    console.log(res)
    return dispatch({
      type: REQ_CREDENTIAL,
      payload: {
        credential: res.data,
      }
    })
}

export const requestAccessToken = (
  res,
) => async (dispatch) => {
  const credential = res.payload.credential
  const endpoint = credential.service.endPoint
  console.log("request__token")
  console.log(credential)
  //credential.signature = await klayDID.sign(JSON.stringify(credential), "EcdsaSecp256k1RecoveryMethod2020", klaytn.selectedAddress);
  //const signcredential = await caver.klay.sign(credential, klaytn.selectedAddress)
  //console.log(signcredential)
  const accessToken = await axios.post(endpoint, {
    credential: credential,
    signcredential: credential.signature
  })
  console.log(accessToken)
  return dispatch({
    type: REQ_ACCESSTOKEN,
    payload:{
      accessToken: accessToken,
    }
  })
}

export const requestDownload = (
  downloadCert,
  endpoint
) => async (dispatch) => {
  const res = await axios.post(endpoint, {
    downloadCert: downloadCert,
  })
  console.log(res)
  return dispatch({
    type: DOWNLOAD_CONTENT,
    payload:{
      downloadToken: res,
    }
  })
}