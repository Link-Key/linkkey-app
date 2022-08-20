import { Link } from "@mui/material";
import { createContext, useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import ToastMention from "../components/ToastMessage";
import { chainsInfo } from "../config/const";
import store from "../store";

const WalletInfoContent = createContext();

const WalletProvider = ({ children }) => {
  const dispatch = useDispatch();

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
      ToastMention({
        message: (
          <span>
            Please install{" "}
            <Link href="https://metamask.io/" target="_blank">
              MetaMask
            </Link>
          </span>
        ),
      });
      return;
    }
    console.log("eth:", eth);

    const accounts = await eth.request({ method: "eth_requestAccounts" });
    if (accounts && accounts[0]) {
      subscribeFn();
      store.dispatch({
        type: "SET_ACCOUNTS",
        value: accounts[0],
      });
      ToastMention({
        message: "Connect wallet and sign in successfully.",
        type: "success",
      });
    }

    const chainId = eth.networkVersion;

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
