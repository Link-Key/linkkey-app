import { LoadingButton } from "@mui/lab";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonLoadingBtn from "../components/Button/LoadingButton";
import { chainsInfo } from "../config/const";
import { useWalletInfo } from "../providers/wallet";
import store from "../store";
import { splitAddress } from "../utils";

export default function Home() {
  const { connectWallet, disconnectWallet } = useWalletInfo();
  const { account, snsName, connecting } = useSelector((state) => {
    return {
      account: state.walletInfo.account,
      snsName: state.walletInfo.snsName,
      connecting: state.walletInfo.connecting,
    };
  });

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Paper
        sx={{
          position: "absolute",
          top: "30vh",
          right: "100px",

          width: "400px",
          height: "300px",
          borderRadius: "12px",
          boxShadow: "none",
          padding: "20px",

          display: "flex",
          // flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
          }}
        >
          {account ? snsName : null}
        </Typography>

        <CommonLoadingBtn
          variant="contained"
          loading={connecting}
          onClick={() => {
            if (account) {
              disconnectWallet();
            } else {
              connectWallet();
            }
          }}
        >
          {account ? splitAddress(account) : "🦊Connect Wallet"}
        </CommonLoadingBtn>
      </Paper>
    </Box>
  );
}
