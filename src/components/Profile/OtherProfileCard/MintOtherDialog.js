import { Box, DialogContent, styled, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import { safeMint } from "../../../contracts/NFT";
import useTransaction from "../../../hooks/useTransaction";
import { useDialog } from "../../../providers/ApproveDialog";
import { getKeyBalance } from "../../../utils";
import CommonLoadingBtn from "../../Button/LoadingButton";
import CommonDialog from "../../CommonDialog";
import ToastMention from "../../ToastMessage";

const Wrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  "& .MuiTypography-root": {
    fontSize: "15px",
    padding: "10px",
    fontWeight: 500,
  },
}));

const MintOtherDialog = ({
  open,
  title,
  onClose,
  isFriend,
  coinAddress,
  from,
  to,
  price,
}) => {
  const { state, dialogDispatch } = useDialog();

  const mintNFT = useCallback(async () => {
    console.log("from:", from);
    const keyBalance = await getKeyBalance(from);
    console.log("keyBalance:", keyBalance);
    console.log("price:", price);
    if (keyBalance > price) {
      try {
        await safeMint(to);
        dialogDispatch({ type: "ADD_STEP" });
        dialogDispatch({ type: "CLOSE_DIALOG" });
      } catch (error) {
        dialogDispatch({ type: "CLOSE_DIALOG" });
        console.log("safeMintErr:", error);
        ToastMention({ message: "contract error", type: "error" });
      }
    } else {
      dialogDispatch({ type: "CLOSE_DIALOG" });
      ToastMention({ message: "Key is not enough!", type: "warn" });
    }
  }, [to, from, price, dialogDispatch]);

  const { handlePayMint } = useTransaction({
    coinAddress,
    from,
    to,
    price,
    executeFn: mintNFT,
  });

  const handlePayMintFn = useCallback(async () => {
    await handlePayMint();
    onClose();
  }, [handlePayMint, onClose]);

  return (
    <CommonDialog open={open} title={title} onClose={onClose}>
      <DialogContent>
        <Wrapper>
          <Typography>{`Price: ${price} KEY`}</Typography>
          <Typography>Mint quantity: 1</Typography>

          <Typography
            sx={{
              color: "#777",
            }}
          >
            {isFriend
              ? `NOTE: After minted his Friend-NFT, you will automatically become his
            friend`
              : `Note: Group-NFT must be verified by twitter before it can be release, and your sns domain name will be locked into a pledge contract`}
          </Typography>
        </Wrapper>
      </DialogContent>

      <CommonLoadingBtn
        loading={state.loading}
        variant="contained"
        sx={{
          margin: "0 auto",
        }}
        onClick={handlePayMintFn}
      >
        {`Pay ${price} Key`}
      </CommonLoadingBtn>
    </CommonDialog>
  );
};

export default memo(MintOtherDialog);
