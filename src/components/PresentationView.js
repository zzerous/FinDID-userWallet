import React, { useState } from 'react'
import ui from 'utils/ui'
import Button from 'components/Button'
import Input from 'components/Input'
import Checkbox from 'components/Checkbox'
import axios from 'axios'

const MY_SERVER = "http://203.250.77.156:9000"
const DID_SERVER = "http://203.250.77.154:8000"

import './DownloadContent.scss'

const PresentationView = ({
    pid,
    claims,
    endPoint,
}) => {

    let datas = Object.entries(claims).map(([key, value]) => ({ [key]: value}));

    const verifyingVP = async () => {
        
        //vp read
        const vpPath = `/home/young/klaytn-wallet/did-wallet/static/VP/${klaytn.selectedAddress}/${pid}.json`;
        let res = await fetch(`${MY_SERVER}/get-file?path=${vpPath}`);
        const vp = await res.json();
        console.log(vp);

        //vp verifying
        const resVerifying = await axios({
            url: endPoint,
            method: "post",
            data: {
                vp: vp
            },
            json: true
        })
        console.log(resVerifying)

        await ui.hideModal()
    }

    return (
        <div className="DownloadContent">
            <Input
                className="DownloadContent__infoName"
                name="VPName"
                label="Presentation Name"
                value={pid}
                readOnly
            />
            <label className="Checkbox__label">
                Presentation Claims
            </label>

            {datas.map((claim, idx) => 
                <Input 
                    key={idx}
                    className="DownloadContent__infoName"
                    name={idx}
                    value={Object.values(claim)}
                    readOnly
                />
            )}
            <Button
                className="DownloadContent__auction"
                onClick={verifyingVP}
                title="Presentation Verifying"
            />
            <Button
                className="DownloadContent__delete"
                //onClick={onClick}
                title="Delete"
            />
        </div>
    )

}

export default PresentationView;

