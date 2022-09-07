import { Contract, ethers } from "ethers";
import { chainsInfo, contractAddress, emptyAddress } from "../../config/const";
import { getProvider, getSigner, getChainId } from "../../utils/web3";
import ResolverContractABI from "./Resolver.json";

export const ResolverInstance = () => {
    const provider = getProvider();
    const chainId = getChainId();
    const resolverAddress = contractAddress(chainId).resolverAddress;
    const resolver = new Contract(resolverAddress, ResolverContractABI, provider);
    return resolver;
};

const getAllProperties = async (name_) => {
    const allProperties = await ResolverInstance().getAllProperties(name_);
    return allProperties;
};

const getIpfsUrl = async (name_) => {
    const allProperties = await ResolverInstance().getIpfsUrl(name_);
    return allProperties;
};

const getDescription = async (name_) => {
    const allProperties = await ResolverInstance().getDescription(name_);
    return allProperties;
};


const setIpfsUrl = async (name_, ipfsUrl_) => {
    const oldStr = getAllProperties(name_);
    let arr = oldStr.split('+');
    arr[4] = ipfsUrl_;
    const newStr = arr.join("+")
    await setAllProperties(name_, newStr)
};

const setDescription = async (name_, description_) => {
    const oldStr = getAllProperties(name_);
    let arr = oldStr.split('+');
    arr[8] = description_;
    const newStr = arr.join("+")
    await setAllProperties(name_, newStr)
};



const setAllProperties = async (name_, recordsStr_) => {
    const signer = await getSigner();
    const resolver = await ResolverInstance().connect(signer);
    return resolver.setAllProperties(name_, recordsStr_);
};



export {
    getAllProperties,
    getIpfsUrl,
    getDescription,
    setIpfsUrl,  //设置头像IPFS
    setDescription //设置简述
};
