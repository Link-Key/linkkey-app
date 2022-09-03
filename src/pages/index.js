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
import { splitAddress } from "../utils";

import Check from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import http from "../utils/https";

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
  const { account, snsName, connecting } = useSelector((state) => {
    return {
      account: state.walletInfo.account,
      snsName: state.walletInfo.snsName,
      connecting: state.walletInfo.connecting,
    };
  });

  const [activeStep, setActiveStep] = useState(0);

  const handleStep = useCallback(() => {
    if (account) {
      setActiveStep(1);
    } else {
      setActiveStep(0);
    }
    if (snsName) {
      setActiveStep(2);
    }
    if (client && client.address === account) {
      setActiveStep(3);
    }
  }, [account, snsName, client]);

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
              <Typography>Connect your Metamask</Typography>

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
              <Typography>Get your sns domain name</Typography>
              {snsName ? (
                <></>
              ) : (
                <LoadingBtn
                  variant="contained"
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
                hidden={client && client.address === account}
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
              <Typography>Login</Typography>
              <LoadingBtn
                variant="contained"
                onClick={() => {
                  http({
                    url: "/api/content_api/v1/column/detail?aid=2608&uuid=7123600233015117352&spider=0&column_id=0",
                    method: "get",
                  });
                }}
              >
                Login
              </LoadingBtn>
            </StepLabelWrapper>
          </Step>
        </Stepper>
      </Wrapper>
    </Box>
  );
}
