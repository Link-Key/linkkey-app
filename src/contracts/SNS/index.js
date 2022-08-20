import { Contract, ethers } from "ethers";
import { chainsInfo, contractAddress } from "../../config/const";
import { getProvider, getSigner } from "../../utils/web3";
import SNSContract from "./ABI.json";

export const SNSInstance = () => {
  const provider = getProvider();
  getSigner().then((signer) => {
    console.log("signer:", signer);
  });
  console.log("provider:", provider);
  const SNS = new Contract(contractAddress.snsAdd, SNSContract, provider);
  console.log("sns:", SNS);
  return SNS;
};

export const getInfo = async (addr_, name_, tokenId_) => {
  const info = await SNSInstance().getInfo(addr_, name_, tokenId_);
  return info;
};
