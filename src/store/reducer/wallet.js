import { chainsInfo } from "../../config/const";

const initialWalletState = {
  chainId: chainsInfo.chainId,
  account: null,
  snsName: null,
};

const WalletReducer = (state = initialWalletState, action) => {
  switch (action.type) {
    case "SET_ACCOUNTS":
      return { ...state, account: action.value };
    case "SET_CHAIN_ID":
      return { ...state, chainId: action.value };
    default:
      return state;
  }
};

export default WalletReducer;
