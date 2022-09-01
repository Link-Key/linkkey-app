import { formatFixed } from "@ethersproject/bignumber";
import { formatEther } from "ethers/lib/utils";

export function splitAddress(address, start = 11, end = -4) {
  return (
    (address && address.slice(0, start) + "..." + address.slice(end)) || ""
  );
}

export const hexToNumber = (value) => {
  return parseInt(value._hex, 16);
};

export const handleHexEthValue = (value) => {
  const number = hexToNumber(value).toString();
  return Number(formatEther(number)).toFixed(0);
};
