import { Contract, ethers } from "ethers";
import { chainsInfo, contractAddress } from "../../config/const";
import { getProvider, getSigner, getChainId } from "../../utils/web3";
import StakeContractABI from "./Stake.json";

export const StakeInstance = () => {
  const provider = getProvider();
  console.log("provider:", provider);
  const chainId = getChainId();
  const stakeAddress = contractAddress(chainId).stakeAddress;
  const Stake = new Contract(stakeAddress, StakeContractABI, provider);
  return Stake;
};

//createType：followNFT 1 groupNFT 2
const getFee = async (createType) => {
  const fee = await StakeInstance().getFee(createType);
  return fee;
};

const stakeNFT = async (tokenId, createType) => {
  const signer = await getSigner();
  console.log("signer", signer);
  const Stake = await StakeInstance().connect(signer);
  await Stake.stakeNFT(tokenId, createType);
};

const unstakeNFT = async (followNFT, groupNFT) => {
  const signer = await getSigner();
  const Stake = await StakeInstance().connect(signer);
  await Stake.unstakeNFT(followNFT, groupNFT);
};

export {
  getFee, //质押费用，
  stakeNFT, //质押 1.getFee 2.ERC20 allance => approve,3.this
  unstakeNFT, // 解质押 1.NFT balanceOf == 150｜｜1500
};
