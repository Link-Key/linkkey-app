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

const getIsIssueNFT = async (owner, createType) => {
  const isIssue = await StakeInstance().getIsIssueNFT(owner, createType);
  return isIssue;
};

export {
  getFee, //质押费用，
  stakeNFT, //质押 1.getFee 2.ERC20 allance => approve,3.this
  unstakeNFT, // 解质押 1.NFT balanceOf == 150｜｜1500
  getIsIssueNFT, //是否发行NFT 没有掉后端接口
};

/**
 * 1: 进入页面之前调取getIsIssueNFT，查询是否已发行
 * 2.1:已发行，调取已发行的数据进行展示
 * 2.2:未发行，调取getStake判断snsNFT是否已经质押
 * 2.3：已经质押，提示等待
 * 2.4：未质押，继续流程
 * 3.erc20 allowance
 * 4.approve
 * 5.stakeNFT
 * 6.轮询是否已经发行成功
 */
