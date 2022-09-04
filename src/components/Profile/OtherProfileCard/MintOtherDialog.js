import { Box, DialogContent, styled, Typography } from "@mui/material";
import { memo } from "react";
import CommonLoadingBtn from "../../Button/LoadingButton";
import CommonDialog from "../../CommonDialog";

const Wrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  "& .MuiTypography-root": {
    fontSize: "15px",
    padding: "10px",
    fontWeight: 500,
  },
}));

const MintOtherDialog = ({ open, title, onClose }) => {
  return (
    <CommonDialog open={open} title={title} onClose={onClose}>
      <DialogContent>
        <Wrapper>
          <Typography>Price: 50 KEY</Typography>
          <Typography>Mint quantity: 1</Typography>

          <Typography
            sx={{
              color: "#777",
            }}
          >
            NOTE: After minted his Friend-NFT, you will automatically become his
            friend
          </Typography>
        </Wrapper>
      </DialogContent>

      <CommonLoadingBtn
        variant="contained"
        sx={{
          margin: "0 auto",
        }}
      >
        Pay 50 Key
      </CommonLoadingBtn>
    </CommonDialog>
  );
};

export default memo(MintOtherDialog);
