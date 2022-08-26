import { Typography, InputBase, Box, styled, Button } from "@mui/material";
import { memo, useCallback, useState } from "react";
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

const TransferDialog = ({ open, title, contractAdd, onClose, onSuccess }) => {
  const [tokenIdInp, setTokenIdInp] = useState("");
  const [receiverInp, setReceiverInp] = useState("");

  const handleChangeMintInp = useCallback((e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setTokenIdInp(value);
    }
  }, []);

  const handleChangeReceiverInp = useCallback((e) => {
    setReceiverInp(e.target.value);
  }, []);

  return (
    <CommonDialog open={open} title={title} onClose={onClose}>
      <Wrapper>
        <Items>
          <Typography>Contract Address: </Typography>
          <EllipsisAddress account={contractAdd} />
        </Items>
        <TypographyBox aria-label="Transfer" sx={{ gap: "5px" }}>
          <Typography>TokenID: </Typography>
          <InputBase
            value={tokenIdInp || ""}
            placeholder="Please input number"
            onChange={handleChangeMintInp}
          />
        </TypographyBox>

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
        >
          Submit
        </Button>
      </Wrapper>
    </CommonDialog>
  );
};

export default memo(TransferDialog);
