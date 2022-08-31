import {
  Paper,
  Typography,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  styled,
  Box,
  DialogContent,
  IconButton,
  InputBase,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState, useCallback, useEffect, memo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import TwitterIcon from "../../../assets/icons/common/twitterIcon.svg";
import ToastMention from "../../ToastMessage";
import EllipsisAddress from "../../EllipsisAddress";
import CommonDialog from "../../CommonDialog";
import TransferDialog from "./TransferDialog";
import SaleDialog from "./SaleDialog";
import { StakeInstance } from "../../../contracts/Stake";
import CommonLoadingBtn from "../../Button/LoadingButton";
import { handleHexEthValue, hexToNumber } from "../../../utils";

const TitleWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #ddd",
}));

const ReleaseData = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  "& .MuiTypography-root": {
    fontSize: "15px",
    padding: "10px",
    fontWeight: 500,
  },
}));

const ReleaseDetailsWrapper = styled(Box)(() => ({
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

const ReleaseDetailsItem = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "5px",
}));

const TypographyBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  ".MuiButton-root": {
    height: "35px",
    fontSize: "14px",
    svg: {
      marginRight: "5px",
    },
  },
  ".MuiInputBase-root": {
    fontSize: "15px",
    fontWeight: 500,
  },
}));

const ReleaseIntroduce = {
  friend: [
    "1. Twitter verification is required to release friend-NFT and only eligible Twitter accounts can be released",
    "2. friend-NFT can be released by paying the release service fee",
    "3. friend-NFT is fixed at 150 nft, all of which can be sold to the public",
    "4. When releasing friend-NFT, a flat floor price is currently set to avoid pricing reasonableness",
  ],
  group: [
    "1. Twitter verification is required to release group-NFT and only eligible Twitter accounts can be released",
    "2. group-NFT can be released by paying the release service fee",
    "3. group-NFT is fixed at 1500 nft, all of which can be sold to the public",
    "4. When releasing group-NFT, a flat floor price is currently set to avoid pricing reasonableness",
  ],
};

const Details = ({ type }) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  const [twitterStatus, setTwitterStatus] = useState(false);
  const [mintInp, setMintInp] = useState("");
  const [royaltiesInp, setRoyaltiesInp] = useState("");

  const isFriend = type === "friend" ? true : false;
  const introduceList =
    type === "friend" ? ReleaseIntroduce.friend : ReleaseIntroduce.group;

  // pay mint NFT
  const handlePayMint = useCallback(() => {
    setShowDetails(true);
    setReleaseOpen(false);
  }, []);

  const changeMintInp = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setMintInp(value);
    }
  };

  const changeRoyaltiesInp = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setRoyaltiesInp(e.target.value);
    }
  };

  const handleReleaseDialogOpen = useCallback(async () => {
    setBtnLoading(true);

    const stakeInstance = StakeInstance();
    console.log("stakeInstance:", stakeInstance);
    try {
      const fee = await stakeInstance.getFee(1);
      console.log("fee:", handleHexEthValue(fee[1]));
    } catch (error) {
      console.log("stakeGetFee:", error);
    }

    setBtnLoading(false);
    // setReleaseOpen(true);
  }, []);

  return (
    <Paper>
      <TitleWrapper>
        <Typography variant="subtitle1" sx={{}}>
          {isFriend ? "Friend-NFT details" : "Group-NFT details"}
        </Typography>
        {!isFriend && showDetails ? (
          <Button variant="outlined">Info</Button>
        ) : (
          <></>
        )}
      </TitleWrapper>

      <Box>
        {showDetails ? (
          <ReleaseDetailsWrapper>
            <ReleaseDetailsItem>
              <Typography>Contract Address: </Typography>
              <EllipsisAddress account="0x5435e8bb74d7ba8f4a76287dc0e75e203d87647e" />
            </ReleaseDetailsItem>
            <Typography>Release Amount: 150</Typography>
            <Typography>Holding Amount: 50</Typography>
            <Typography>Total earnings: 16.6 KEY</Typography>
            <Typography>Royalties: 5%</Typography>

            <Typography variant="subtitle1">
              Note:Your Friend-NFT is still not listed,please click button below
              for listing operation
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  setTransferOpen(true);
                }}
              >
                Transfer
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setSaleOpen(true);
                }}
              >
                Sale
              </Button>
            </Stack>
          </ReleaseDetailsWrapper>
        ) : (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
            spacing={1}
          >
            <CommonLoadingBtn
              loading={btnLoading}
              variant="outlined"
              sx={{
                fontWeight: 500,
              }}
              onClick={() => {
                handleReleaseDialogOpen();
              }}
            >
              {isFriend ? "Release Friend-NFT" : "Release Group-NFT"}
            </CommonLoadingBtn>
            <InfoOutlinedIcon
              onClick={() => {
                setInfoOpen(true);
              }}
            />
          </Stack>
        )}
      </Box>

      {/* Release Modal */}
      <CommonDialog
        open={releaseOpen}
        title={isFriend ? "Release Friend-NFT" : "Release Group-NFT"}
        onClose={() => {
          setReleaseOpen(false);
        }}
      >
        <DialogContent aria-label="Release_NFT">
          <ReleaseData>
            <Typography>Release amount: {isFriend ? "150" : "1500"}</Typography>
            <Typography>Floor price: 0.88KEY</Typography>
            <TypographyBox aria-label="verify-twitter">
              <Typography>
                Twitter verify status: {twitterStatus.toString()}
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  display: twitterStatus ? "none" : "block",
                }}
              >
                <TwitterIcon />
                To Verify
              </Button>
            </TypographyBox>

            <TypographyBox aria-label="mint">
              <Typography>Mint your self:</Typography>
              <InputBase
                value={mintInp || ""}
                placeholder={isFriend ? "Min 0, Max 150" : "Min 0, Max 1500"}
                onChange={changeMintInp}
              />
            </TypographyBox>

            <TypographyBox>
              <Typography>Royalties:</Typography>
              <InputBase
                value={royaltiesInp || ""}
                placeholder="0~10"
                sx={{
                  width: "65px",
                }}
                onChange={(e) => {
                  changeRoyaltiesInp(e);
                }}
              />
              <Typography>%</Typography>
            </TypographyBox>

            <Typography
              sx={{
                color: "#777",
              }}
            >
              Note:Friend-NFT must be verified by twitter before it can be
              release,and your sns domain name will be locked into a pledge
              contract
            </Typography>
          </ReleaseData>
        </DialogContent>
        <Button
          variant="contained"
          sx={{
            margin: "0 auto",
          }}
          onClick={() => {
            handlePayMint();
          }}
        >
          Pay 100 Key
        </Button>
      </CommonDialog>

      {/* Info modal */}
      <CommonDialog
        open={infoOpen}
        title="Release Introduce"
        onClose={() => {
          setInfoOpen(false);
        }}
      >
        <DialogContent>
          <Stack direction="column" spacing={3}>
            {introduceList &&
              introduceList.map((item, index) => (
                <Typography key={index} sx={{ fontWeight: 500 }}>
                  {item}
                </Typography>
              ))}
          </Stack>
        </DialogContent>
        <Button
          variant="contained"
          sx={{
            margin: "0 auto",
          }}
          onClick={() => {
            setInfoOpen(false);
          }}
        >
          OK
        </Button>
      </CommonDialog>

      <TransferDialog
        open={transferOpen}
        title="Transfer"
        contractAdd="0x5435e8bb74d7ba8f4a76287dc0e75e203d87647e"
        onClose={() => {
          setTransferOpen(false);
        }}
      />
      <SaleDialog
        open={saleOpen}
        title="Sale"
        contractAdd="0x5435e8bb74d7ba8f4a76287dc0e75e203d87647e"
        onClose={() => {
          setSaleOpen(false);
        }}
      />
    </Paper>
  );
};

export default memo(Details);
