import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { memo } from "react";
import CommonDialog from "../CommonDialog";

const MarketDialog = ({ open, title, onClose }) => {
  const router = useRouter();

  return (
    <CommonDialog
      open={open}
      title={title}
      onClose={() => {
        console.log("close");
        onClose();
      }}
      sx={{ width: "400px" }}
    >
      <Stack direction="column" spacing={2}>
        <Button
          variant="outlined"
          onClick={() => {
            router.push("/Profile/dsdsds.key");
          }}
        >
          Mint at owner
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            router.push("/Market/PurchaseList");
          }}
        >
          Buy at market
        </Button>

        <Typography
          variant="subtitle1"
          sx={{
            color: "#777",
            fontWeight: 500,
          }}
        >
          Note:Your Friend-NFT is still not listed,please click button below for
          listing operation
        </Typography>
      </Stack>
    </CommonDialog>
  );
};

export default memo(MarketDialog);
