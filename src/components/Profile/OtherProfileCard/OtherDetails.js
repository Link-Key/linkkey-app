import {
  Box,
  Button,
  Paper,
  Typography,
  styled,
  Stack,
  Skeleton,
} from "@mui/material";
import { useEffect } from "react";
import { memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { emptyAddress } from "../../../config/const";
import { getFloorPrices, getTotal } from "../../../contracts/NFT";
import { getKeyAddress, weiFormatToEth, hexToNumber } from "../../../utils";
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

const OtherDetails = ({ type, contractAdd, isMinted }) => {
  const { account } = useSelector((state) => ({
    account: state.walletInfo.account,
  }));

  const isFriend = type === "friend" ? true : false;

  const [mintOpen, setMintOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [floorPrice, setFloorPrice] = useState(0);
  const [totalNFT, setTotalNFT] = useState(0);
  const keyAddress = getKeyAddress();

  const handleOpenMintNFTDialog = useCallback(async () => {
    setMintOpen(true);
  }, []);

  const getBasicInfo = useCallback(async () => {
    setLoading(true);
    await getFloorPrice();
    await getTotalNFT();

    setLoading(false);
  }, [getFloorPrice, getTotalNFT]);

  const getFloorPrice = useCallback(async () => {
    try {
      const priceHex = await getFloorPrices(contractAdd);
      setFloorPrice(weiFormatToEth(priceHex));
    } catch (error) {
      console.log("getFloorPriceErr:", error);
    }
  }, [contractAdd]);

  const getTotalNFT = useCallback(async () => {
    try {
      const totalHex = await getTotal(contractAdd);
      console.log("totalHex:", hexToNumber(totalHex));
      setTotalNFT(hexToNumber(totalHex));
    } catch (error) {
      console.log("getTotalNFTErr:", error);
    }
  }, [contractAdd]);

  useEffect(() => {
    // if (contractAdd !== emptyAddress) {
    // }
    console.log("contractAdd:", contractAdd);
    if (contractAdd) {
      getBasicInfo();
    }
  }, [getBasicInfo, contractAdd]);

  return (
    <Paper>
      <TitleWrapper>
        <Typography variant="subtitle1">
          {isFriend ? "Friend-NFT details" : "Group-NFT details"}
        </Typography>
        {!isFriend ? (
          <CommonLoadingBtn disabled={true} variant="outlined">
            Info
          </CommonLoadingBtn>
        ) : (
          <></>
        )}
      </TitleWrapper>

      <Wrapper>
        <Typography>{`Minted/All: ${totalNFT} / ${
          isFriend ? "150" : "1500"
        }`}</Typography>
        <Typography>{`Floor Price: ${floorPrice} KEY`}</Typography>

        <Stack direction="row" justifyContent="center" spacing={2}>
          <CommonLoadingBtn
            // loading={loading}
            disabled={!isMinted}
            variant="outlined"
            onClick={handleOpenMintNFTDialog}
          >
            {isFriend ? "Mint His Friend-NFT" : "Mint His Group-NFT"}
          </CommonLoadingBtn>
          <CommonLoadingBtn variant="outlined" disabled={!isMinted}>
            {isFriend ? "Buy His Friend-NFT" : "Buy His Group-NFT"}
          </CommonLoadingBtn>
        </Stack>
      </Wrapper>

      <MintOtherDialog
        open={mintOpen}
        title={isFriend ? "Release Friend-NFT" : "Release Group-NFT"}
        isFriend={isFriend}
        coinAddress={keyAddress}
        from={account}
        to={contractAdd}
        price={floorPrice}
        onClose={() => {
          setMintOpen(false);
        }}
      />
    </Paper>
  );
};

export default memo(OtherDetails);
