import { Typography, Box, styled, Button } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTaxPreparation } from "../../contracts/NFT";
import { buy, getOrder } from "../../contracts/Trading";
import useTransaction from "../../hooks/useTransaction";
import { useDialog } from "../../providers/ApproveDialog";
import {
  BNformatToWei,
  getKeyBalance,
  getTradingAddress,
  hexToNumber,
  weiFormatToEth,
} from "../../utils";
import CommonLoadingBtn from "../Button/LoadingButton";
import CommonDialog from "../CommonDialog";
import EllipsisAddress from "../EllipsisAddress";
import ToastMention from "../ToastMessage";

const Wrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "0 20px",
  ".MuiTypography-root": {
    fontSize: "15px",
    fontWeight: 500,
  },
  ".MuiTypography-subtitle1": {
    color: "#777",
  },
}));

const Items = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "5px",
}));

const TypographyBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  ".MuiButton-root": {
    height: "35px",
    fontSize: "14px",
    svg: {
      marginRight: "5px",
    },
  },
  ".MuiInputBase-root": {
    fontSize: "15px",
    fontWeight: 500,
  },
}));

const BuyDialog = ({ open, title, onClose, info }) => {
  console.log("buyInfo:", info);
  const [taxState, setTaxState] = useState("-");
  const [serviceRate, setServiceRate] = useState(2.5);
  const [orderInfoState, setOrderInfoState] = useState({});
  // const [ownerRate, setOwnerRate] = useState();
  const tradingAddress = getTradingAddress();

  const { account } = useSelector((state) => ({
    account: state.walletInfo.account,
  }));

  const { dialogDispatch, state } = useDialog();

  const handleCloseFn = useCallback(() => {
    onClose();
    setTaxState("-");
    dialogDispatch({ type: "SET_LOADING", payload: false });
  }, [onClose, dialogDispatch]);

  const getTaxFn = useCallback(async () => {
    try {
      const tax = await getTaxPreparation(info.contractAddress);
      setTaxState(hexToNumber(tax));
      return hexToNumber(tax);
    } catch (error) {
      console.log("getTaxFnErr:", error);
    }
  }, [info.contractAddress]);

  const buyFn = useCallback(async () => {
    const keyBalance = await getKeyBalance(account);
    console.log("keyBalance:", keyBalance);
    console.log("erc20Amount:", orderInfoState.erc20Amount);
    if (keyBalance > orderInfoState.erc20Amount) {
      try {
        await buy(info.tokenOwner, info.contractAddress, info.tokenId);
        dialogDispatch({ type: "ADD_STEP" });
        dialogDispatch({ type: "CLOSE_DIALOG" });
      } catch (error) {
        dialogDispatch({ type: "CLOSE_DIALOG" });
        ToastMention({ message: "contract error", type: "error" });
        console.log("buyFn:", error);
      }
    } else {
      dialogDispatch({ type: "CLOSE_DIALOG" });
      ToastMention({ message: "Balance is not enough!", type: "warn" });
    }
  }, [info, account, orderInfoState, dialogDispatch]);

  const getOrderFn = useCallback(async () => {
    try {
      console.log("info:", info);
      const orderInfo = await getOrder(info.tokenOwner, info.contractAddress);
      console.log("getOrderFn:", orderInfo);
      const weiAmount = BNformatToWei(orderInfo.erc20Amount);
      console.log("getOrderPrice:", weiFormatToEth(weiAmount).toFixed(18));
      setOrderInfoState({
        ...orderInfo,
        erc20Amount: weiFormatToEth(weiAmount).toFixed(18),
      });
    } catch (error) {
      console.log("getOrderFnErr:", error);
    }
  }, [info]);

  const { handlePayMint } = useTransaction({
    coinAddress: orderInfoState.erc20Address,
    from: account,
    to: tradingAddress,
    price: orderInfoState.erc20Amount,
    executeFn: buyFn,
  });

  const handlePayMintFn = useCallback(async () => {
    await handlePayMint();
    handleCloseFn();
    dialogDispatch({ type: "SET_LOADING", payload: false });
  }, [dialogDispatch, handlePayMint, handleCloseFn]);

  useEffect(() => {
    if (info && info.contractAddress && open) {
      getOrderFn();
      getTaxFn();
    }
  }, [getTaxFn, info, getOrderFn, open]);

  return (
    <CommonDialog open={open} title={title} onClose={handleCloseFn}>
      <Wrapper>
        <Items>
          <Typography>Contract Address: </Typography>
          <EllipsisAddress account={info.contractAddress} />
        </Items>
        <TypographyBox aria-label="Transfer" sx={{ gap: "5px" }}>
          <Typography>Price: {info.orderPrice}KEY</Typography>
        </TypographyBox>

        <Typography variant="subtitle1">You will pay: 10KEY </Typography>
        <Typography variant="subtitle1">
          - Service fee: {serviceRate}%
        </Typography>
        <Typography variant="subtitle1">- Royalties: {taxState}%</Typography>
        <Typography variant="subtitle1">
          - Owner: {100 - taxState - serviceRate}%
        </Typography>
        <CommonLoadingBtn
          loading={state.loading}
          variant="contained"
          sx={{
            margin: "5px auto",
          }}
          onClick={async () => {
            await handlePayMintFn();
          }}
        >
          Submit
        </CommonLoadingBtn>
      </Wrapper>
    </CommonDialog>
  );
};

export default memo(BuyDialog);
