export const TRUNCATED_NAME_CHAR_LIMIT = 11;
export const TRUNCATED_ADDRESS_START_CHARS = 6;
export const TRUNCATED_ADDRESS_END_CHARS = 4;
export const KLAYTN_TOKEN_IMAGE_URL = '/images/klay_logo.svg';

import Caver from 'caver-js'
const caver = new Caver(window.klaytn);
const account = klaytn.selectedAddress;

export const shortenAddress = (address = '') => {
    if (address.length < TRUNCATED_NAME_CHAR_LIMIT) {
        return address;
    }

    return `${address.slice(0, TRUNCATED_ADDRESS_START_CHARS)}...${address.slice(-TRUNCATED_ADDRESS_END_CHARS,)}`;
}

export const getSelectedBalance = async () =>  {
    return await caver.klay.getBalance(account)
    .then(async (res) => {
        const balance = await caver.utils.fromPeb(res,"KLAY");
        return balance;
    })
}

export const getNativeCurrencyImage = () => {
    return KLAYTN_TOKEN_IMAGE_URL;
}