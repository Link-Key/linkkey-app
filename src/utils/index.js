import EthVal from "ethval";

export function splitAddress(address, start = 11, end = -4) {
  return (
    (address && address.slice(0, start) + "..." + address.slice(end)) || ""
  );
}

export const hexToNumber = (value) => {
  return parseInt(value._hex, 16);
};

export const handleHexEthValue = (value) => {
  const number = hexToNumber(value);
  console.log("number:", number);
  console.log("value:", value._hex);
  return new EthVal(value).toEth();
};
