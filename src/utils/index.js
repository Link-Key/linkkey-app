import BigNumber from "bignumber.js";
import { formatEther, parseEther } from "ethers/lib/utils";

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
  return Number(formatEther(number)).toFixed(0);
};

export const handleWeiValue = (value) => {
  let number = value;
  if (value && value._hex) {
    number = hexToNumber(value).toString();
  }
  return Number(parseEther(number)).toFixed(0);
};
