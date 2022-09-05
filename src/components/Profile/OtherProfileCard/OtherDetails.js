import { Box, Button, Paper, Typography, styled, Stack } from "@mui/material";
import { memo, useState } from "react";
import CommonLoadingBtn from "../../Button/LoadingButton";
import MintOtherDialog from "./MintOtherDialog";

const TitleWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #ddd",
}));

const Wrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginTop: "10px",

  ".MuiTypography-root": {
    fontSize: "15px",
    fontWeight: 500,
  },
  ".MuiTypography-subtitle1": {
    color: "#777",
  },
}));

const OtherDetails = ({ type }) => {
  const isFriend = type === "friend" ? true : false;

  const [mintOpen, setMintOpen] = useState(false);

  return (
    <Paper>
      <TitleWrapper>
        <Typography variant="subtitle1">
          {isFriend ? "Friend-NFT details" : "Group-NFT details"}
        </Typography>
        {!isFriend ? <Button variant="outlined">Info</Button> : <></>}
      </TitleWrapper>

      <Wrapper>
        <Typography>Minted/All: 78 / 150</Typography>
        <Typography>Floor Price: 10 KEY</Typography>

        <Stack direction="row" justifyContent="center" spacing={2}>
          <CommonLoadingBtn
            variant="outlined"
            onClick={() => {
              setMintOpen(true);
            }}
          >
            {isFriend ? "Mint His Friend-NFT" : "Mint His Group-NFT"}
          </CommonLoadingBtn>
          <CommonLoadingBtn variant="outlined">
            {isFriend ? "Buy His Friend-NFT" : "Buy His Group-NFT"}
          </CommonLoadingBtn>
        </Stack>
      </Wrapper>
      <MintOtherDialog
        open={mintOpen}
        title={isFriend ? "Release Friend-NFT" : "Release Group-NFT"}
        isFriend={isFriend}
        onClose={() => {
          setMintOpen(false);
        }}
      />
    </Paper>
  );
};

export default memo(OtherDetails);
