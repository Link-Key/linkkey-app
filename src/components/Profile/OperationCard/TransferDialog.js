import { Typography, InputBase, Box, styled, Button } from "@mui/material";
import { memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { balanceOf } from "../../../contracts/NFT";
import CommonDialog from "../../CommonDialog";
import EllipsisAddress from "../../EllipsisAddress";

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

const TransferDialog = ({
  open,
  title,
  contractAdd,
  tokenId,
  onClose,
  onSuccess,
}) => {
  const { account } = useSelector((state) => {
    return {
      account: state.walletInfo.account,
    };
  });
  const [receiverInp, setReceiverInp] = useState("");

  console.log("transferToken:", tokenId);

  const handleChangeReceiverInp = useCallback((e) => {
    setReceiverInp(e.target.value);
  }, []);

  const hasMintedNFT = useCallback(() => {}, []);

  const handleTransferSubmit = useCallback(async () => {
    const hasNFT = await balanceOf(contractAdd, receiverInp);
    console.log("hasNFT:", hasNFT);
  }, [contractAdd, receiverInp]);

  return (
    <CommonDialog open={open} title={title} onClose={onClose}>
      <Wrapper>
        <Items>
          <Typography>Contract Address: </Typography>
          <EllipsisAddress account={contractAdd} />
        </Items>

        <TypographyBox aria-label="Transfer" sx={{ gap: "5px" }}>
          <Typography>Receiver: </Typography>
          <InputBase
            value={receiverInp || ""}
            placeholder="Please input address"
            onChange={handleChangeReceiverInp}
          />
        </TypographyBox>
        <Button
          variant="contained"
          sx={{
            margin: "5px auto",
          }}
          onClick={handleTransferSubmit}
        >
          Submit
        </Button>
      </Wrapper>
    </CommonDialog>
  );
};

export default memo(TransferDialog);
