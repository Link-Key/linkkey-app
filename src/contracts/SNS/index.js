import { Contract, ethers } from "ethers";
import { chainsInfo, contractAddress } from "../../config/const";
import { getProvider, getSigner, getChainId } from "../../utils/web3";
import SNSContractABI from "./SNS.json";

export const SNSInstance = () => {
  const provider = getProvider();
  const chainId = getChainId();
  const snsAddress = contractAddress(chainId).snsAddress;
  const SNS = new Contract(snsAddress, SNSContractABI, provider);
  return SNS;
};

export const getInfo = async (addr_, name_, tokenId_) => {
  const info = await SNSInstance().getInfo(addr_, name_, tokenId_);
  return info;
};
