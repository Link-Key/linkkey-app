import { createContext, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chainsInfo } from "../config/const";
import store from "../store";

const WalletInfoContent = createContext();

const WalletProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { account, chainId } = useSelector((state) => {
    return {
      account: state.walletInfo.account,
      chainId: state.walletInfo.chainId,
    };
  });

  const switchChainToPolygon = useCallback(async () => {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainsInfo.chainIdHex }],
      });
    } catch (switchError) {
      console.log("switchError:", switchError);
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainsInfo.chainIdHex,
                chainName: chainsInfo.chainName,
                rpcUrls: [chainsInfo.rpcUrl],
              },
            ],
          });
        } catch (addError) {
          console.log("addError:", addError);
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }, []);

  const subscribeFn = useCallback(() => {
    const eth = window.ethereum;
    // Contract
    // Subscribe to accounts change
    eth.on("accountsChanged", (accounts) => {
      console.log("accounts22:", accounts);
      dispatch({
        type: "SET_ACCOUNTS",
        value: accounts[0],
      });
    });

    // Subscribe to chainId change
    eth.on("chainChanged", (chainId) => {
      console.log("chainId:", parseInt(chainId, 16));
      if (chainId !== chainsInfo.chainIdHex) {
        dispatch({
          type: "SET_ACCOUNTS",
          value: null,
        });
      }
    });
  }, [dispatch]);

  const connectWallet = useCallback(async () => {
    const eth = window.ethereum;
    if (typeof eth == "undefined") {
      console.log("MetaMask no install");
      return;
    }
    console.log("eth:", eth);

    const accounts = await eth.request({ method: "eth_requestAccounts" });
    console.log("accounts:", accounts);
    if (accounts && accounts[0]) {
      subscribeFn();
      store.dispatch({
        type: "SET_ACCOUNTS",
        value: accounts[0],
      });
    }

    const chainId = eth.networkVersion;
    console.log("chainId:", chainId);

    if (chainId && chainId !== 80001) {
      await switchChainToPolygon();
    }
  }, [subscribeFn, switchChainToPolygon]);

  const disconnectWallet = useCallback(() => {
    dispatch({
      type: "SET_ACCOUNTS",
      value: null,
    });
  }, [dispatch]);

  return (
    <WalletInfoContent.Provider
      value={{
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletInfoContent.Provider>
  );
};

const useWalletInfo = () => ({ ...useContext(WalletInfoContent) });

export { WalletProvider, useWalletInfo };
