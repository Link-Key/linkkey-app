import { memo, useCallback } from "react";
import { allowance, approve } from "../contracts/ERC20";
import { useDialog } from "../providers/ApproveDialog";
import { BNformatToWei, ethFormatToWei, hexToNumber } from "../utils";

const useTransaction = ({ coinAddress, from, to, price, executeFn }) => {
  const { dialogDispatch } = useDialog();

  const queryAllowance = useCallback(async () => {
    try {
      const value = await allowance(coinAddress, from, to);
      return hexToNumber(value);
    } catch (error) {
      console.log("allowanceError:", error);
      return 0;
    }
  }, [coinAddress, from, to]);

  const callApprove = useCallback(async () => {
    const value = await queryAllowance();
    console.log("approveFee:", ethFormatToWei(price));
    try {
      if (value >= price) {
        return "approve";
      } else {
        const resp = await approve(coinAddress, to, ethFormatToWei(price));
        console.log("approveResp:", resp);
        return "unApprove";
      }
    } catch (error) {
      console.log("callApproveErr:", error);
      return false;
    }
  }, [coinAddress, price, queryAllowance, to]);

  const handleExecuteFn = useCallback(async () => {
    clearInterval(window.approveTimer);
    dialogDispatch({ type: "ADD_STEP" });
    await executeFn();
  }, [dialogDispatch, executeFn]);

  // pay mint NFT
  const handlePayMint = useCallback(async () => {
    dialogDispatch({ type: "SET_LOADING", payload: true });
    const approveStatus = await callApprove();
    console.log("approveStatus:", approveStatus);
    if (approveStatus === "unApprove") {
      dialogDispatch({ type: "OPEN_DIALOG" });
      setTimeout(() => {
        window.approveTimer = setInterval(async () => {
          const allowancePrice = await queryAllowance();
          console.log("allowancePrice:", allowancePrice);
          if (allowancePrice > 0) {
            await handleExecuteFn();
          }
        }, 1000);
      }, 0);
    }

    if (approveStatus === "approve") {
      dialogDispatch({ type: "OPEN_DIALOG" });
      await handleExecuteFn();
    }

    dialogDispatch({ type: "SET_LOADING", payload: false });
  }, [callApprove, queryAllowance, dialogDispatch, handleExecuteFn]);

  return { queryAllowance, callApprove, handlePayMint };
};

export default useTransaction;
