import { Button, Paper } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Image from "next/image";

import { InjectedConnector } from "@web3-react/injected-connector";
import { splitAddress } from "../utils";
export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

const Home = () => {
  const context = useWeb3React();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context;

  console.log("context:", { ...context });

  const connectWallet = async () => {
    try {
      const connecting = await activate(injected);
      console.log("connecting:", connecting);
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <div>
      <Paper
        sx={{
          width: "200px",
          height: "200px",
          borderRadius: "12px",
          boxShadow: "none",
        }}
      >
        <Button
          onClick={() => {
            !active ? activate(injected) : deactivate(injected);
          }}
        >
          {active ? splitAddress(account) : "Connect Wallet"}
        </Button>
      </Paper>
    </div>
  );
};

export default Home;
