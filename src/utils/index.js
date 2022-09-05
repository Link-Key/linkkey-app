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
  let number = value;
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

export const getKeyBalance = async (owner) => {
  const keyAddress = contractAddress(chainId.toString()).keyAddress;
  try {
    const balance = await getBalance(keyAddress, owner);
    return handleHexEthValue(balance);
  } catch (error) {
    console.log("getKeyBalanceErr:", error);
  }
};
