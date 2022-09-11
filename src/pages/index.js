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
import { useState } from "react";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonLoadingBtn from "../components/Button/LoadingButton";
import { chainsInfo, linkList } from "../config/const";
import { useWalletInfo } from "../providers/wallet";
import store from "../store";
import { compareAddress, splitAddress } from "../utils";

import Check from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import http from "../utils/https";
import { login, queryAccountInfo } from "../api";
import { getSigner } from "../utils/web3";
import { useRouter } from "next/router";

const Wrapper = styled(Paper)(() => ({
  display: "flex",
  flexDirection: "column",
  maxWidth: "400px",

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

const LoadingBtn = styled(CommonLoadingBtn)(() => ({
  minWidth: "100px",
}));

const StepIconWrapper = styled(Box)(() => ({
  marginLeft: "2px",
  svg: {
    color: "#ea6060",
  },
}));

const StepIconFn = (props) => {
  const { active, completed } = props;

  return (
    <StepIconWrapper ownerState={{ active }}>
      {active ? (
        <CircularProgress size={18} />
      ) : completed ? (
        <Check />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            marginLeft: "7px",
            background: "#ea6060",
            borderRadius: "50px",
          }}
        />
      )}
    </StepIconWrapper>
  );
};

export default function Home() {
  const { connectWallet, disconnectWallet, initialClient, client } =
    useWalletInfo();

  const dispatch = useDispatch();
  const { account, snsName, connecting, clientAddress, token } = useSelector(
    (state) => {
      return {
        account: state.walletInfo.account,
        snsName: state.walletInfo.snsName,
        connecting: state.walletInfo.connecting,
        clientAddress: state.userInfo.clientAddress,
        token: state.userInfo.token,
      };
    }
  );

  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);

  const handleLoginToken = useCallback(async () => {
    const singer = await getSigner();
    console.log("singer:", singer);
    try {
      const signInfo = await singer.signMessage(snsName);
      console.log("signInfo:", signInfo);
      const reqParams = {
        address: account,
        message: snsName,
        signature: signInfo,
      };
      const resp = await login(reqParams);
      console.log(resp, "resp");
      if (resp && resp.code === 200 && resp.data.token) {
        dispatch({ type: "USER_INFO", value: resp.data });
      }
    } catch (error) {
      console.log("signInfoErr:", error);
    }
  }, [account, snsName, dispatch]);

  const handleStep = useCallback(() => {
    if (account) {
      setActiveStep(1);
    } else {
      setActiveStep(0);
    }
    if (snsName) {
      setActiveStep(2);
    }
    if (clientAddress && account && compareAddress(clientAddress, account)) {
      setActiveStep(3);
    }
    if (token) {
      setActiveStep(4);
    }
  }, [account, snsName, clientAddress, token]);

  useEffect(() => {
    handleStep();
  }, [handleStep]);

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
          activeStep={activeStep}
          orientation="vertical"
          sx={{ padding: "20px 10px" }}
        >
          <Step>
            <StepLabelWrapper>
              <Typography>
                {account
                  ? `Connected ${splitAddress(account)}`
                  : "Connect Metamask"}
              </Typography>

              <LoadingBtn
                variant="contained"
                hidden={account}
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
              </LoadingBtn>
            </StepLabelWrapper>
          </Step>

          <Step>
            <StepLabelWrapper>
              <Typography>
                {snsName ? `Hi, ${snsName} ~` : "Get your sns domain name"}
              </Typography>
              {snsName ? (
                <></>
              ) : (
                <LoadingBtn
                  variant="contained"
                  hidden={activeStep < 1}
                  loading={connecting}
                  onClick={() => {
                    window.open(`${linkList.sns}`, "__blank");
                  }}
                >
                  Register
                </LoadingBtn>
              )}
            </StepLabelWrapper>
          </Step>

          <Step>
            <StepLabelWrapper>
              <Typography>Initialize XMTP Client</Typography>
              <LoadingBtn
                variant="contained"
                hidden={
                  compareAddress(clientAddress, account) || activeStep < 2
                }
                onClick={async () => {
                  await initialClient();
                }}
              >
                Initial
              </LoadingBtn>
            </StepLabelWrapper>
          </Step>

          <Step>
            <StepLabelWrapper>
              <Typography>{token ? "Logged in" : "Login"}</Typography>
              <LoadingBtn
                variant="contained"
                hidden={activeStep < 3 || token}
                onClick={handleLoginToken}
              >
                Login
              </LoadingBtn>
            </StepLabelWrapper>
          </Step>
        </Stepper>
        <LoadingBtn
          hidden={!token}
          variant="contained"
          onClick={() => {
            router.push(`Profile/${snsName}`);
          }}
        >
          Get started
        </LoadingBtn>
      </Wrapper>
    </Box>
  );
}
