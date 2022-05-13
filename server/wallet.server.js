const BAOBAB_RPC_URL = 'https://api.baobab.klaytn.net:8651/';
const DID_SERVER = "http://203.250.77.154:8000"

const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 9000;
const fs = require('fs');
const axios = require('axios');
const Caver = require('caver-js');
const caver = new Caver(BAOBAB_RPC_URL);
const finDID = require('../lib/fin-did-auth.js');

// const FinDIDClient = require("../../did-verifier/did-auth/didAuth");
// const ACCOUNT = require("../configs/account.config");
// const CONTRACT = require("../../did-verifier/config/contract");
// const finDID = new FinDIDClient({
//     network: BAOBAB_RPC_URL,
//     regABI: CONTRACT.DEPLOYED_JSON_DIDLedger,
//     regAddr: CONTRACT.DEPLOYED_ADDRESS_DIDLedger,
//   });
//
// const privateKey = ACCOUNT.PRIVATE_KEY;

const getFileList = require('./routes/getFileList');
const getFileview = require('./routes/getFileview');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(fileUpload());
app.use('/get-filelist', getFileList);
app.use('/get-file', getFileview);
app.listen(PORT, function() {
    console.log('server listening on port ', PORT);
})

const AUTH = require('../configs/account.config');
let counter = 0;

// app.post('/get-didSign', async (req, res) => {
//     const data = req.body.claims;
//     const JSONdata = JSON.stringify(data);
//     const keyType = 'EcdsaSecp256k1RecoveryMethod2020';
//     const signature = await finDID.sign(JSONdata, keyType, privateKey);

//     res.send(signature);
// })

app.post('/get-didSign', async(req, res) => {

    const data = req.body.data;
    const keyType = 'EcdsaSecp256k1RecoveryMethod2020';
    const sign = await finDID.sign(JSON.stringify(data), keyType, AUTH.PRIVATE_KEY);
    //const sign = await caver.klay.accounts.sign(JSON.stringify(data), AUTH.PRIVATE_KEY);
    
    if(sign.status == -1){
        res.send("failed: \n" + sign.err);
        return;
    }

    console.log("Signing successful");
    res.send(sign.signature);
})

// app.post('/', async(req, res) => {
//     const a = req.body;

//     const resRedirect = await axios({
//         url: "http://203.250.77.156:9000"+"/",
//         method: "post",
//         data: {

//         },
//         json: true
//     })
// })

// app.post('/', async(req, res) => {

//     const res = await axios({
//         url: DID_SERVER+"/",
//         method: "post",
//         data: {

//         },
//         json:true
//     })
// })

app.post('/issue-did', (req,res) => {
    //data : {
    //     "did":
    //     "publicKeyID":
    //     "publicKey":
    //     "keyType":
    // }
    let data = req.body;
    let meta = Object.assign(data, {"vcs":{},"vps":{}});
    const addr = data.publicKey;
    let metaJSON = `/home/young/klaytn-wallet/did-wallet/static/meta-${addr}.json`;
    
    fs.writeFile(metaJSON, JSON.stringify(meta), 'utf8', function(err, info) {
        if(err){
            console.log(err);
            return ;
        }
        else {
            console.log("Saving user info successful\n");
            res.send("ok")
        }
        
    })
})

app.post('/update-did', (req,res) => {
    let data = req.body;
    console.log(data);
    let metaJSON = `/home/young/klaytn-wallet/did-wallet/static/meta-${data.publicKey}.json`;
    fs.readFile(metaJSON, 'utf8', function(err, meta) {
        if(err) {
            console.log(err);
            return;
        }
        let info = Object.assign(JSON.parse(meta), data);
        console.log(info);
        fs.writeFile(metaJSON, JSON.stringify(info), 'utf8', function(err) {
            if(err) {
                console.log(err);
                return;
            } else {
            console.log("Update wallet meta successful\n");
            res.send("ok");
            }
        })
        
    })
})

app.post('/issue-presentation', (req, res) => {
    const data = req.body;
    const vp = data.presentation;
    let vpJSONpath = `/home/young/klaytn-wallet/did-wallet/static/VP/${data.address}/${data.pid}.json`;
    let metaJSONpath = `/home/young/klaytn-wallet/did-wallet/static/meta-${data.address}.json`;

    fs.writeFile(vpJSONpath, JSON.stringify(vp), 'utf8', function(err, fd) {
        if(err){
            console.log(err);
        }
        else {
            console.log("Saving presentation successful\n");
        }
    })

    fs.readFile(metaJSONpath, 'utf8', function(err, jsonfile){
        if (err){
            console.log(err);
            res.send(err);
        }
        else {
            let metaParsed = JSON.parse(jsonfile);
            //console.log(metaParsed);
            metaParsed.vps[`vps${++counter}`] = vp.cid;
            fs.writeFileSync(metaJSONpath, JSON.stringify(metaParsed), "utf8");
            console.log("Update meta UserInfo successful\n");
            res.send('ok');
        }
    })
    
})

app.post('/issue-credential', (req, res) => {
    const data = req.body;
    const vc = data.vc;
    console.log(data);
    let vcJSONpath = `/home/young/klaytn-wallet/did-wallet/static/VC/${data.address}/${vc.cid}.json`;
    let metaJSONpath = `/home/young/klaytn-wallet/did-wallet/static/meta-${data.address}.json`;

    fs.writeFile(vcJSONpath, JSON.stringify(vc), 'utf8', function(err, fd){
        if(err) 
            console.log(err);
        else {
            console.log("Saving credential successful\n");
        }
    })

    fs.readFile(metaJSONpath, 'utf8', function(err, jsonfile){
        if (err)
            console.log(err);
        else {
            let metaParsed = JSON.parse(jsonfile);
            //console.log(metaParsed);
            metaParsed.vcs[`vcs${++counter}`] = vc.cid;
            fs.writeFileSync(metaJSONpath, JSON.stringify(metaParsed), "utf8");
            console.log("Update meta UserInfo successful\n");
            res.send("ok");
        }
    })
    
})


