import React, { useState } from 'react'
import ui from 'utils/ui'
import Button from 'components/Button'
import Input from 'components/Input'
import Checkbox from 'components/Checkbox'
import axios from 'axios'
const keccak256 = require('keccak256')
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const MY_SERVER = "http://203.250.77.156:9000"

import './DownloadContent.scss'

const CreatePresentation = ({
    cid,
    claims
}) => {
    const [checkedIDs, setCheckedIDs] = useState([]); //check된 클레임 id

    let datas = Object.entries(claims).map(([key, value]) => ({ [key]: value}));

    const checkedIDHandler = (code, isChecked) => {
        if(isChecked) { //check : true
            setCheckedIDs([...checkedIDs, code])
        } else if (!isChecked && checkedIDs.find(one => one === code)) { //check: false, 클릭 두번 시
            const filter = checkedIDs.filter(one => one !== code) //code와 다른것들 모아 새로운 배열로 반환
            setCheckedIDs([...filter])
        }
    }

    const createVP = async () => {
        let checkedClaims = {}
        const idList = checkedIDs.map(Number);

        //checked claims 가져오기
        for(let i = 0; i<idList.length ; i++){
            Object.assign(checkedClaims, datas[idList[i]]);
        }
        
        //vc read
        const vcPath = `/home/young/klaytn-wallet/did-wallet/static/VC/${klaytn.selectedAddress}/${cid}.json`;
        let res = await fetch(`${MY_SERVER}/get-file?path=${vcPath}`);
        const file = await res.json();

        //checked claim 부가정보만 가져오기
        let temp = {}; 
        const checkedKeys = Object.keys(checkedClaims);
        for(let i = 0; i<checkedKeys.length; i++){
            let keys = checkedKeys[i];
            let infos = file.infos[keys];
            temp[keys] = infos;
        }

        let presentation = {
            "pid": '',
            "cid": cid,
            "issuerdid": file.issuerdid,
            "issuerpkid": file.issuerpkid,
            "ownerdid": file.ownerdid,
            "ownerpkid": file.ownerpkid,
            "claims":checkedClaims,
            "infos":temp,
            "valid": new Date()
        }

        //user sign 하기
        const resSign = await axios({
            url: MY_SERVER+'/get-didSign',
            method: 'post',
            data: {
                data: presentation,
            },
            json: true
        })
        console.log(resSign);
        //presentation signature
        const vpSignature = resSign.data;
        //presentation hashing
        presentation["signature"] = vpSignature;
        console.log('###### stringify presentation ####');
        console.log(JSON.stringify(presentation));
        const vpID = keccak256(Buffer.from(JSON.stringify(presentation))).toString('hex');
        presentation["pid"] = vpID;
        


        const resVP = await axios({
            url: MY_SERVER+'/issue-presentation',
            method: 'post',
            data: {
                pid: vpID,
                presentation: presentation,
                address: klaytn.selectedAddress,
            },
            json: true
        })
        // .then(() => {
        //     ui.showToast({
        //         status: true ? 'success' : 'fail',
        //         message: `Saving VP(Verifiable Presentation) successful ! VP name is ####.json`,
        //     })

        // }).then('error', (error) => {
        //     ui.showToast({
        //         status: 'error',
        //         message: error.toString(),
        //     })
        // })
        await ui.hideModal()
    }

    return (
        <div className="DownloadContent">
            <Input
                className="DownloadContent__infoName"
                name="VCName"
                label="Credential Name"
                value={cid}
                readOnly
            />
            <label className="Checkbox__label">
                Credential Claims
            </label>

            {datas.map((claim, idx) => 
                <Checkbox 
                    key={idx}
                    attr={Object.keys(claim).toString()}
                    data={Object.values(claim).toString()}
                    id={idx.toString()}
                    checkedIDs={checkedIDs}
                    checkedIDHandler={checkedIDHandler}
                />
            )}
            <Button
                className="DownloadContent__auction"
                onClick={createVP}
                title="Create Presentation"
            />
            <Button
                className="DownloadContent__delete"
                //onClick={onClick}
                title="Delete"
            />
        </div>
    )

}

export default CreatePresentation;

