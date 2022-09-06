import { Card, styled, Typography, Stack } from "@mui/material";
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
        <OtherDetails type="friend" />
        <OtherDetails type="group" />
      </Stack>
    </OperationCardWrapper>
  );
};

export default memo(OtherProfileCard);
