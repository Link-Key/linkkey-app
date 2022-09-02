import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Paper,
  Stepper,
  StepLabel,
  Step,
  styled,
  Typography,
  Link,
} from "@mui/material";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonLoadingBtn from "../components/Button/LoadingButton";
import { chainsInfo, linkList } from "../config/const";
import { useWalletInfo } from "../providers/wallet";
import store from "../store";
import { splitAddress } from "../utils";

const Wrapper = styled(Paper)(() => ({
  display: "flex",
  flexDirection: "column",
  maxWidth: "400px",
  // alignItems: "flex-end",
  // minWidth: "500px",
  // position: "absolute",
  // top: "30vh",
  // right: "100px",

  // width: "400px",
  // height: "300px",
  // borderRadius: "12px",
  // boxShadow: "none",

  ".MuiTypography-title": {
    fontSize: "18px",
    fontWeight: 600,
  },
  ".MuiTypography-subtitle1": {
    fontSize: "14px",
    fontWeight: 500,
    color: "#9a9a9a",
  },
  a: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#9a9a9a",
    textDecorationColor: "#9a9a9a",
    "&:hover": {
      color: "#ea6060",
      fontWeight: 600,
      textDecorationColor: "#ea6060",
    },
  },
}));

const StepLabelWrapper = styled(StepLabel)(() => ({
  ".MuiStepLabel-label": {
    display: "flex",
    // gap: "10px",
    justifyContent: "space-between",
    alignItems: "center",
    ".MuiTypography-root": {
      fontSize: "15px",
      color: "black",
    },
  },
}));

const StepIconWrapper = styled(Box)(() => ({
  marginLeft: "2px",
  svg: {
    color: "#ea6060",
  },
}));

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
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "30vh",
        marginRight: "100px",
      }}
    >
      <Wrapper>
        <Typography variant="title">
          Welcome to LINNKEY, a Web3 Social Circle Protocol
        </Typography>

        <Typography variant="subtitle1">
          Get started by reading the <Link href={linkList.docs}>docs</Link> or
          joining the <Link href={linkList.telegram}>community</Link>
        </Typography>

        <Stepper
          activeStep={0}
          orientation="vertical"
          sx={{ padding: "20px 10px" }}
        >
          <Step>
            <StepLabelWrapper>
              <Typography>Connect your Metamask</Typography>

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
                Connect
              </CommonLoadingBtn>
            </StepLabelWrapper>
          </Step>

          <Step>
            <StepLabelWrapper>
              <Typography>Create chat,initial client</Typography>
              <CommonLoadingBtn variant="contained">Initial</CommonLoadingBtn>
            </StepLabelWrapper>
          </Step>

          <Step>
            <StepLabelWrapper>
              <Typography>Login</Typography>
              <CommonLoadingBtn variant="contained">Login</CommonLoadingBtn>
            </StepLabelWrapper>
          </Step>
        </Stepper>
      </Wrapper>
    </Box>
  );
}
