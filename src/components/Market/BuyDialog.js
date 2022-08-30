import { Typography, Box, styled, Button } from "@mui/material";
import { memo, useCallback, useState } from "react";
import CommonDialog from "../CommonDialog";
import EllipsisAddress from "../EllipsisAddress";

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

const BuyDialog = ({ open, title, contractAdd, onClose }) => {
  return (
    <CommonDialog open={open} title={title} onClose={onClose}>
      <Wrapper>
        <Items>
          <Typography>Contract Address: </Typography>
          <EllipsisAddress account={contractAdd} />
        </Items>
        <TypographyBox aria-label="Transfer" sx={{ gap: "5px" }}>
          <Typography>Price: 10KEY</Typography>
        </TypographyBox>

        <Typography variant="subtitle1">You will pay: 10KEY </Typography>
        <Typography variant="subtitle1">- Service fee: 2.5%</Typography>
        <Typography variant="subtitle1">- Royalties: 10%</Typography>
        <Typography variant="subtitle1">- Owner: 10%</Typography>
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

export default memo(BuyDialog);
