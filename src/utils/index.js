import BigNumber from "bignumber.js";
import { formatEther, parseEther, formatUnits } from "ethers/lib/utils";
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

export const weiFormatToEth = (value) => {
  let number = value.toString();
  if (value && value._hex) {
    number = hexToNumber(value).toString();
  }
  return Number(formatEther(number));
};

export const ethFormatToWei = (value) => {
  if (typeof value === "string") {
    return parseEther(value);
  }
  return parseEther(value.toString());
};

export const BNformatToWei = (value) => {
  return formatUnits(value, "wei");
};

export const getKeyAddress = () => {
  return contractAddress(chainId.toString()).keyAddress;
};

export const getKeyBalance = async (owner) => {
  const keyAddress = getKeyAddress();
  try {
    const balance = await getBalance(keyAddress, owner);
    const weiBalance = BNformatToWei(balance);
    return weiFormatToEth(weiBalance);
  } catch (error) {
    console.log("getKeyBalanceErr:", error);
  }
};
