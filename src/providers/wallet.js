import { Link } from "@mui/material";
import { createContext, useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ToastMention from "../components/ToastMessage";
import { chainsInfo } from "../config/const";
import { SNSInstance, getInfo } from "../contracts/SNS";
import store from "../store";

const WalletInfoContent = createContext();

const WalletProvider = ({ children }) => {
  const dispatch = useDispatch();

  const { account } = useSelector((state) => {
    return {
      account: state.walletInfo.account,
    };
  });

  const startLoading = useCallback(() => {
    dispatch({
      type: "WALLET_LOADING",
      value: true,
    });
  }, [dispatch]);

  const closeLoading = useCallback(() => {
    dispatch({
      type: "WALLET_LOADING",
      value: false,
    });
  }, [dispatch]);

  const disconnectWallet = useCallback(() => {
    dispatch({
      type: "SET_ACCOUNTS",
      value: null,
    });
    dispatch({
      type: "SET_SNS_NAME",
      value: null,
    });
  }, [dispatch]);

  const getSNSName = useCallback(
    async (address) => {
      try {
        if (address) {
          const info = await getInfo(address, "", 0);
          dispatch({
            type: "SET_SNS_NAME",
            value: info[2],
          });
          return;
        }

        dispatch({
          type: "SET_SNS_NAME",
          value: null,
        });
        return;
      } catch (error) {
        console.log("getSNSNameError:", error);
        dispatch({
          type: "SET_SNS_NAME",
          value: null,
        });
      }
    },
    [dispatch]
  );

  // 切换至polygon链
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

  // 监听钱包的链及账户变化
  const subscribeFn = useCallback(() => {
    const eth = window.ethereum;
    // Contract
    // Subscribe to accounts change
    eth.on("accountsChanged", async (accounts) => {
      startLoading();
      // disconnectWallet();
      await getSNSName(accounts[0]);

      dispatch({
        type: "SET_ACCOUNTS",
        value: accounts[0],
      });
      closeLoading();
    });

    // Subscribe to chainId change
    eth.on("chainChanged", (chainId) => {
      if (chainId !== chainsInfo.chainIdHex) {
        dispatch({
          type: "SET_ACCOUNTS",
          value: null,
        });
      }
    });
  }, [dispatch, getSNSName, startLoading, closeLoading]);

  const connectWallet = useCallback(async () => {
    const eth = window.ethereum;
    if (typeof eth == "undefined") {
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

    startLoading();

    const accounts = await eth.request({ method: "eth_requestAccounts" });
    console.log("accounts:", accounts);
    if (accounts && accounts[0]) {
      // 监听账户与链的变化
      subscribeFn();

      store.dispatch({
        type: "SET_ACCOUNTS",
        value: accounts[0],
      });

      // 获取SNS名称
      await getSNSName(accounts[0]);

      ToastMention({
        message: "Connect wallet and sign in successfully.",
        type: "success",
      });
    }
    closeLoading();

    const chainId = eth.networkVersion;

    if (chainId && chainId !== 80001) {
      await switchChainToPolygon();
    }
  }, [
    subscribeFn,
    switchChainToPolygon,
    getSNSName,
    startLoading,
    closeLoading,
  ]);

  useEffect(() => {
    if (account) {
      getSNSName(account);
    }
  }, [getSNSName, account, startLoading, closeLoading]);

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
