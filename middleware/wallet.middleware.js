import caver from '../src/klaytn/caver'

async function getSign(data) {
    try {
        const signature = await caver.klay.sign(JSON.stringify(data), klaytn.selectedAddress);
        console.log(signature);
        return {
            status: 1,
            result: signature
        };
        
    } catch (e) {
        return {
            status: -1,
            err: e
        }
    }
}

module.exports = {
    getSign,
}