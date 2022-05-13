const connection = require('../configs/cqlsh.config');

module.exports = {
    createPresentation,
    getPresentation,
    getDID,
}

async function createPresentation(Credential) {
    try {
        console.log('credentialID: ', Credential.cid)
        const [results] = await connection.execute(
            "INSERT INTO presentation_table (address, pid, cid, claims, infos, issuerdid, issuerpkid, ownerdid, ownerpkid, sign, validtime ) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
            [Credential.address, pid, Credential.cid, Credential.claims, Credential.infos, Credential.issuerdid, Credential.issuerpkid,
            Credential.ownerdid, Credential.ownerpkid, Credential.sign, Credential.validtime]
        );
        return {
            status: 1
        }
    } catch (e) {
        return {
            status: -1,
            err: e
        }
    }
}

async function getPresentation(address, pid) {
    try {
        console.log('presentationID: ', pid);
        const [results] = await connect.execute(
            "SELECT * FROM presentation_table WHERE address = ? AND pid = ?",
            [address, pid]
        );
        return {
            isExist: results.length > 0,
            presentation: results
        }

    } catch (e) {
        return {
            status: -1,
            err: e
        }
    }
}

async function getDID(address) {
    try {
        console.log('address: ', address);
        const [result] = await connect.execute(
            "SELECT did FROM did_table WHERE address = ?", [address]
        );
        if (result[0] == undefined) return -1
        else return result[0]
    } catch (error) {
        return {
            status: -1,
            err: e
        }
    }
}