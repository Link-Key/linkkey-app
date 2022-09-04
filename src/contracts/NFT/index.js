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

const getLastTokenId = async (NFTAddress, owner) => {
  const total = await NFTInstance(NFTAddress).totalSupply();
  const stemp = 50;
  const times = total / stemp;
  let tokenId;
  for (let index = 0; index < times; index++) {
    const startIndex = index * stemp + 1;
    const endIndex = (index + 1) * stemp + 1;
    const tokenIds = await NFTInstance(NFTAddress).tokensOfOwnerIn(owner, startIndex, endIndex);
    console.log('tokenIds', tokenIds)
    if (tokenIds.length != 0) {
      tokenId = tokenIds[0];
      return tokenId;
    }
  }
  return 0;
};

const getOwner = async (NFTAddress) => {
  const owner = await NFTInstance(NFTAddress).owner();
  return owner;
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
  getLastTokenId, //获取地址拥有的一个tokenId
  getOwner//获取NFT的
};
