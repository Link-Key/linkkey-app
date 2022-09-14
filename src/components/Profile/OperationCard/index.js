import {
  Button,
  Paper,
  Stack,
  styled,
  Typography,
  Card,
  CircularProgress,
  Box,
} from "@mui/material";
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
      <Typography variant="title">NTFs</Typography>
      <OperationAlert>
        You are not currently release Friend-NFT or Group-NFT, click the button
        below to release your NFT!
      </OperationAlert>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          flexWrap: { xs: "wrap", md: "wrap", lg: "unset", xl: "unset" },
          "& .MuiPaper-root": {
            width: "100%",
            minWidth: "400px",
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
      </Box>
    </OperationCardWrapper>
  );
};

export default OperationCard;
