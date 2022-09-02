import { Contract, ethers } from "ethers";
import { getProvider, getSigner } from "../../utils/web3";
import NFTContractABI from "./NFT.json";

export const NFTInstance = (NFTAddress) => {
  const provider = getProvider();
  const NFT = new Contract(NFTAddress, NFTContractABI, provider);
  return NFT;
};

const safeMint = async (NFTAddress) => {
  const signer = await getSigner();
  const NFT = await NFTInstance(NFTAddress).connect(signer);
  await NFT.safeMint();
};

const transferFrom = async (NFTAddress, from, to, tokenId) => {
  const signer = await getSigner();
  const NFT = await NFTInstance(NFTAddress).connect(signer);
  await NFT.transferFrom(from, to, tokenId);
};

const setTaxPreparation = async (NFTAddress, taxPreparation) => {
  const signer = await getSigner();
  const NFT = await NFTInstance(NFTAddress).connect(signer);
  await NFT.setTaxPreparation(taxPreparation);
};

const setApprovalForAll = async (NFTAddress, operator, approved) => {
  const signer = await getSigner();
  const NFT = await NFTInstance(NFTAddress).connect(signer);
  await NFT.setApprovalForAll(operator, approved);
};

const isApprovedForAll = async (NFTAddress, owner, operator) => {
  const isApprovedForAll = await NFTInstance(NFTAddress).isApprovedForAll(
    owner,
    operator
  );
  return isApprovedForAll;
};

const getFloorPrices = async (NFTAddress) => {
  const floorPrices = await NFTInstance(NFTAddress).getFloorPrices();
  return floorPrices;
};

const balanceOf = async (NFTAddress, owner) => {
  const balance = await NFTInstance(NFTAddress).balanceOf(owner);
  return balance;
};

const getTotal = async (NFTAddress) => {
  const total = await NFTInstance(NFTAddress).totalSupply();
  return total;
};

export {
  safeMint, // 铸造 1.getFloorPrices 2.ERC20 allance => approve,3.this
  transferFrom, //转赠
  setTaxPreparation, //设置版税（修改的时候）
  setApprovalForAll, // 授权
  isApprovedForAll, //查看是否授权
  getFloorPrices, // 地板价
  balanceOf, // 拥有数量
  getTotal, // 总铸造数量
};
