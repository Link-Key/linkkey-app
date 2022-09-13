import { Link } from "@mui/material";
import { createContext, useCallback, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ToastMention from "../components/ToastMessage";
import { chainsInfo } from "../config/const";
import { SNSInstance, getInfo } from "../contracts/SNS";
import store from "../store";
import { Client } from "@xmtp/xmtp-js";
import { getAccount, getSigner } from "../utils/web3";
import { useState } from "react";
import { getResolverInfo } from "../contracts/Resolver";

const WalletInfoContent = createContext();

const WalletProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [client, setClient] = useState();

  console.log("env:", process.env.NEXT_PUBLIC_XMTP_URL);

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
    dispatch({ type: "LOGOUT" });
    dispatch({ type: "CLEAR_USER_INFO" });
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
          return info[2];
        }
        dispatch({
          type: "SET_SNS_NAME",
          value: null,
        });
        return "";
      } catch (error) {
        dispatch({
          type: "SET_SNS_NAME",
          value: null,
        });
      }
    },
    [dispatch]
  );

  const getUserBasicInfo = useCallback(
    async (name) => {
      try {
        const userInfo = await getResolverInfo(name);
        if (userInfo && userInfo.ipfsUrl && userInfo.description) {
          dispatch({ type: "SET_DES", value: userInfo.description });
          dispatch({ type: "SET_AVATAR", value: userInfo.ipfsUrl });
        }
      } catch (error) {
        console.log("userInfo:", error);
      }
    },
    [dispatch]
  );

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

  // Listening to wallet chain and account changes
  const subscribeFn = useCallback(() => {
    const eth = window.ethereum;
    // Subscribe to accounts change
    eth.on("accountsChanged", async (accounts) => {
      console.log("accountsChanged:", accounts);
      startLoading();
      disconnectWallet();
      await getSNSName(accounts[0]);

      dispatch({
        type: "SET_ACCOUNTS",
        value: accounts[0],
      });
      closeLoading();
    });

    // Subscribe to chainId change
    eth.on("chainChanged", (chainId) => {
      console.log("chianId:", chainId);
      if (chainId !== chainsInfo.chainIdHex) {
        dispatch({
          type: "SET_ACCOUNTS",
          value: null,
        });
      }
    });

    eth.on("disconnect", (error) => {
      console.log("disconnect:", error);
    });
  }, [dispatch, getSNSName, startLoading, closeLoading, disconnectWallet]);

  const connectWallet = useCallback(async () => {
    const eth = window.ethereum;
    //judge wallet installed
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

    // connect wallet
    let accounts = [];
    try {
      accounts = await eth.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log("connectWalletErr:", error);
    }
    if (accounts && accounts[0]) {
      // subscribe wallet change status
      subscribeFn();

      // set account to store
      store.dispatch({
        type: "SET_ACCOUNTS",
        value: accounts[0],
      });

      // get sns domain name
      const name = await getSNSName(accounts[0]);

      if (name) {
        console.log("name:", name);
        await getUserBasicInfo(name);
      }

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
    startLoading,
    closeLoading,
    getSNSName,
    getUserBasicInfo,
  ]);

  const initialClient = useCallback(async () => {
    try {
      const client = await Client.create(
        await getSigner(),
        process.env.NEXT_PUBLIC_XMTP_URL
      );
      console.log("client:".client);
      if (client && client.address) {
        dispatch({ type: "SET_CLIENT_ADD", value: client.address });
        setClient(client);
      }
      return client;
    } catch (error) {
      console.log("initialClientErr:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    subscribeFn();
  }, [subscribeFn]);

  return (
    <WalletInfoContent.Provider
      value={{
        connectWallet,
        disconnectWallet,
        initialClient,
        client,
      }}
    >
      {children}
    </WalletInfoContent.Provider>
  );
};

const useWalletInfo = () => ({ ...useContext(WalletInfoContent) });

export { WalletProvider, useWalletInfo };
