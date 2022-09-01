import { Contract, ethers } from "ethers";
import { chainsInfo, contractAddress, emptyAddress } from "../../config/const";
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

export const getTokenIdOfName = async (name) => {
  const info = await SNSInstance().getInfo(emptyAddress, name, 0);
  return info.tokenIdOfName;
};

export const getResolverOwner = async (name) => {
  const info = await SNSInstance().getInfo(emptyAddress, name, 0);
  return info.resolverOwner;
};
