import { ethers } from "ethers";
import { chainsInfo } from "../config/const";

let requested = false;

export const getProvider = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const provider = new ethers.providers.JsonRpcProvider(chainsInfo.infuraUrl);
  return provider;
};

export const getSigner = async () => {
  const provider = getProvider();
  try {
    const signer = provider.getSigner();
    await signer.getAddress();
    return signer;
  } catch (e) {
    if (window.ethereum) {
      try {
        if (requested === true) return provider;
        await window.ethereum.enable();
        const signer = await provider.getSigner();
        await signer.getAddress();
        return signer;
      } catch (e) {
        requested = true;
        console.log("getSignerErr:", e);
        return provider;
      }
    } else {
      return provider;
    }
  }
};

export const getAccount = async () => {
  try {
    const signInfo = await getSigner();
    const account = await signInfo.getAddress();
    if (parseInt(account, 16) !== 0) {
      return account;
    } else {
      return [];
    }
  } catch (e) {
    console.log("getAccountErr:", e);
    return [];
  }
};

export const getChainId = () => {
  const eth = window.ethereum;
  const chainId = eth.networkVersion;
  return chainId;
};
