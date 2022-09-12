import { Card, styled, Typography, Stack, Box } from "@mui/material";
import { memo } from "react";
import OtherDetails from "./OtherDetails";

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

const OtherProfileCard = () => {
  return (
    <OperationCardWrapper>
      <Typography variant="title">Summary</Typography>

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
        <OtherDetails type="friend" />
        <OtherDetails type="group" />
      </Box>
    </OperationCardWrapper>
  );
};

export default memo(OtherProfileCard);
