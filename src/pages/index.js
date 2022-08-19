import { Button, Paper } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../store";
import { splitAddress } from "../utils";

export default function Home() {
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
        params: [{ chainId: "0x13881" }],
      });
      console.log("switch");
    } catch (switchError) {
      console.log("switchError:", switchError);
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x13881",
                chainName: "Polygon Mumbai",
                rpcUrls: ["https://mumbai.polygonscan.com"],
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
  }, [switchChainToPolygon]);

  const disconnectWallet = useCallback(() => {
    dispatch({
      type: "SET_ACCOUNTS",
      value: null,
    });
  }, [dispatch]);

  useEffect(() => {
    // connectWallet();
  }, []);

  return (
    <div>
      <Paper
        sx={{
          width: "200px",
          height: "200px",
          borderRadius: "12px",
          boxShadow: "none",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            console.log("account111:", account);
            if (account) {
              disconnectWallet();
            } else {
              connectWallet();
            }
          }}
        >
          {account ? splitAddress(account) : "Connect Wallet"}
        </Button>
      </Paper>
    </div>
  );
}
