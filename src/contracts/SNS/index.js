import { Contract, ethers } from "ethers";
import { chainsInfo, contractAddress, emptyAddress } from "../../config/const";
import { getProvider, getSigner, getChainId } from "../../utils/web3";
import SNSContractABI from "./SNS.json";

export const SNSInstance = () => {
  const provider = getProvider();
  const chainId = getChainId();
  console.log("chainId:", chainId);
  const snsAddress = contractAddress(chainId).snsAddress;
  console.log("snsAddress:", snsAddress);
  const SNS = new Contract(snsAddress, SNSContractABI, provider);
  return SNS;
};

const getInfo = async (addr_, name_, tokenId_) => {
  const info = await SNSInstance().getInfo(addr_, name_, tokenId_);
  return info;
};

const getTokenIdOfName = async (name) => {
  const info = await SNSInstance().getInfo(emptyAddress, name, 0);
  return info.tokenIdOfName;
};

const getResolverOwner = async (name) => {
  const info = await SNSInstance().getInfo(emptyAddress, name, 0);
  return info.resolverOwner;
};

const getStake = async (tokenId_) => {
  const isStake = await SNSInstance().getStake(tokenId_);
  return isStake;
};

export {
  getInfo,
  getTokenIdOfName,
  getResolverOwner,
  getStake, //是否质押
};
