const Caver = require("caver-js");
const secp256k1 = require('secp256k1');
this.caver = new Caver('https://api.baobab.klaytn.net:8651');

//FinanceDid

/**
* @dev 
* @param signature: 0x{hex string}
* @param data:  data contained in signature
* @param pubKey: A public key object{id, keyType, pubKeyData} in document public key list
* @returns Bool: **/
function isValidSign (signature, data, pubKey){
  if(pubKey.keyType == 'EcdsaSecp256k1RecoveryMethod2020')
      return this._isValid_Secpk1_Recovery2020(signature, data, pubKey.pubKeyData);
  else if(pubKey.keyType == 'EcdsaSecp256k1VerificationKey2019')
      return this._isValid_Secpk1_2019(signature, data, pubKey.pubKeyData);
  return false;
}

/**
* @dev 
* @param pubKey: publicKey(GET from did service)
* @param signature: 0x{hex string} 
* @param data:  data contained in signature 
* @returns [isValid, errMsg] **/
async function didAuth(pubKey, signature, data){

  if(pubKey == null){
    return [false, 'Public key does not exist in this did document'];
  }

  const isValid = this.isValidSign(signature, data, pubKey);
  if(!isValid){
    return [false, 'Did not valid'];
  }else{
    return [true, ''];
  }
}


/**
* @dev
* @param data: (string)
* @param type: 'EcdsaSecp256k1RecoveryMethod2020' or 'EcdsaSecp256k1VerificationKey2019'
* @param privateKey: hex string ex. 0x (string)
* @return signature: hex string ex. 0x (string) , VRS: {v:int, r:string, s:stirng}* */ 
async function sign(data, type, privateKey){
  if(type == 'EcdsaSecp256k1RecoveryMethod2020'){
    const signObj = this.caver.klay.accounts.sign(data,privateKey);
    const vrsObj = {
      v: parseInt(Number(signObj.v)),
      r: signObj.r,
      s: signObj.s
    }
    return {
      signature: signObj.signature,
      VRS: vrsObj
    };
  }else if(type == 'EcdsaSecp256k1VerificationKey2019'){
    const data32 = hash.update(Buffer.from(data)).digest();
    const pKey = Buffer.from(privateKey.replace("0x",""),'hex');
    const sigObj = secp256k1.ecdsaSign(data32, pKey);
    return {
      signature: '0x'+Buffer.from(sigObj.signature).toString('hex'),
      VRS: null,
    };
  }
  return {
      signature: '0x00',
      VRS: null,
  };
}



/**
* @dev internal function
* @param signature: value signed file metadata with private key (0x{hex}:65byte:module->caver.klay.accounts.sign)
* @param data: data contained in signature
* @param pubKey: public key(address) in document (0x{Hex.toLowCase})
*/
function _isValid_Secpk1_Recovery2020(signature, data, pubKeyAddr){
  const signerAddress = this.caver.klay.accounts.recover(data, signature);
  return (pubKeyAddr == signerAddress.toLowerCase());
}


/**
* @dev internal function 
* @param signature: value signed file metadata with private key (0x{hex}:64byte:module->secp256k1)
* @param data: data contained in signature
* @param pubKey: public key in document (0x{Hex})
*/
function _isValid_Secpk1_2019(signature, data, pubKey){
  const pureHexKey = pubKey.replace("0x", "");
  const uint8ArrPubKey = Uint8Array.from(Buffer.from(pureHexKey,'hex'));

  const msg32 = hash.update(Buffer.from(data)).digest();

  const pureHexSig = signature.replace("0x","");
  const bytesSig = Buffer.from(pureHexSig,'hex'); 

  return secp256k1.ecdsaVerify(bytesSig, msg32, uint8ArrPubKey);
}


/**
   * @param statusCode: -n: failed, 1: successful
   * @param msg: result msg 
   */
function _returnMsg(statusCode, msg){
  return {status: statusCode, msg: msg };
}

module.exports.sign = sign;
module.exports.didAuth = didAuth;
module.exports.isValidSign =isValidSign
module.exports._isValid_Secpk1_Recovery2020 = _isValid_Secpk1_Recovery2020;
module.exports._isValid_Secpk1_2019 = _isValid_Secpk1_2019
module.exports._returnMsg = _returnMsg
