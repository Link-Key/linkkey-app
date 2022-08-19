const initialWalletState = {
  chainId: null,
  account: null,
  snsName: null,
};

const WalletReducer = (state = initialWalletState, action) => {
  switch (action.type) {
    case "SET_ACCOUNTS":
      return { ...state, account: action.value };
    case "SET_ACCOUNT_INFO":
      return { ...state, accountInfo: action.value };
    default:
      return state;
  }
};

export default WalletReducer;
