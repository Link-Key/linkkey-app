import BigNumber from "bignumber.js";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useSelector } from "react-redux";
import { contractAddress } from "../config/const";
import { getBalance } from "../contracts/ERC20";
import store from "../store/index";

const { chainId } = store.getState().walletInfo;

export function splitAddress(address, start = 11, end = -4) {
  return (
    (address && address.slice(0, start) + "..." + address.slice(end)) || ""
  );
}

export const hexToNumber = (value) => {
  return parseInt(value._hex, 16);
};

export const handleHexEthValue = (value) => {
  let number = value.toString();
  if (value && value._hex) {
    number = hexToNumber(value).toString();
  }
  return Number(formatEther(number));
};

export const handleWeiValue = (value) => {
  let number = value.toString();
  if (value && value._hex) {
    number = hexToNumber(value).toString();
  }
  return Number(parseEther(number).toString());
};

export const getKeyAddress = () => {
  return contractAddress(chainId.toString()).keyAddress;
};

export const getKeyBalance = async (owner) => {
  const keyAddress = getKeyAddress();
  try {
    console.log("keyAddress:", keyAddress);
    console.log("owner:", owner);
    const balance = await getBalance(keyAddress, owner);
    const weiBalance = handleWeiValue(balance);
    console.log("weiBalance:", weiBalance);
    console.log("balance:", handleHexEthValue(weiBalance));
    return handleHexEthValue(weiBalance);
  } catch (error) {
    console.log("getKeyBalanceErr:", error);
  }
};
