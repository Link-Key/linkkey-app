import { memo, useCallback } from "react";
import { hexToNumber } from "../utils";

const useTransaction = ({ contractAdd, from, to, feeState }) => {
  const queryAllowance = useCallback(async () => {
    try {
      const value = await allowance(contractAdd, from, to);
      return hexToNumber(value);
    } catch (error) {
      console.log("allowanceError:", error);
      return 0;
    }
  }, [contractAdd, from, to]);

  const callApprove = useCallback(async () => {
    const value = await queryAllowance();
    console.log("approveFee:", handleWeiValue(feeState).toFixed(0));
    try {
      if (value >= feeState) {
        return "approve";
      } else {
        const resp = await approve(
          contractAdd,
          to,
          handleWeiValue(feeState).toFixed(0)
        );
        console.log("approveResp:", resp);
        return "unApprove";
      }
    } catch (error) {
      console.log("callApproveErr:", error);
      return false;
    }
  }, [contractAdd, feeState, queryAllowance, to]);

  return { queryAllowance };
};

export default memo(useTransaction);
