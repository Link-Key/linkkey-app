import { Avatar, Box, styled, Stack, Typography } from "@mui/material";
import { memo } from "react";

const Wrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "190px",
  padding: "10px 10px",
  border: "1px solid #ddd",
  borderRadius: "12px",
}));

const MarketItem = () => {
  return (
    <Wrapper>
      <Stack direction="row" p={0} spacing={1}>
        <Avatar sx={{ borderRadius: "12px" }} />
        <Stack direction="column" p={0}>
          <Typography
            variant="title"
            sx={{ fontWeight: 600, fontSize: "15px" }}
          >
            Linkkey.key
          </Typography>
          <Typography sx={{ color: "#7a7a7a" }}>130 owners</Typography>
        </Stack>
      </Stack>
      <Stack direction="row" justifyContent="space-between" p={0}>
        <Box>
          <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
            Minted/All
          </Typography>
          <Typography sx={{ fontWeight: 600 }}>30/100</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
            Floor price
          </Typography>
          <Typography sx={{ fontWeight: 600 }}>12 KEY</Typography>
        </Box>
      </Stack>
    </Wrapper>
  );
};

export default memo(MarketItem);
