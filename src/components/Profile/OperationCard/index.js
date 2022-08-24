import { Button, Paper, Stack, styled, Typography, Card } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Details from "./Detais";
import { useCallback, useState } from "react";

const OperationCardWrapper = styled(Card)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  borderRadius: "12px",

  ".MuiTypography-title": {
    fontWeight: 500,
    fontSize: "25px",
    color: "#9a9a9a",
  },
}));

const OperationAlert = styled(Paper)(() => ({
  width: "500px",
  height: "70px",
  borderRadius: "12px",
  textAlign: "center",
  background: "#ea6060",
  color: "#fff",
  fontWeight: 500,
  margin: "0 auto",
}));

const OperationCard = () => {
  return (
    <OperationCardWrapper>
      <Typography variant="title">Operation</Typography>
      <OperationAlert>
        You are not currently release Friend-NFT or Group-NFT, click the button
        below to release your NFT!
      </OperationAlert>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          "& .MuiPaper-root": {
            width: "100%",
            borderRadius: "12px",
          },
          ".MuiTypography-subtitle1": {
            fontSize: "20px",
            fontWeight: 500,
          },
          svg: {
            color: "#ea6060",
            cursor: "pointer",
          },
        }}
      >
        <Details type="friend" />
        <Details type="group" />
      </Stack>
    </OperationCardWrapper>
  );
};

export default OperationCard;
