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

const BaseDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: 40,
    width: "600px",
    "& .MuiDialogTitle-root": {
      display: "flex",
      justifyContent: "center",
      paddingTop: "20px",
      fontSize: "24px",
      fontWeight: 700,
      color: "#ea6060",
      ".MuiTypography-root": {
        fontSize: "24px",
        fontWeight: 700,
        color: "#ea6060",
      },
    },
    "& .MuiButton-root": {
      textTransform: "none",
      fontWeight: 700,
      fontSize: 16,
    },
    ".MuiDialogContent-root": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
  },
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
  gap: "20px",
  marginTop: "10px",
  padding: "10px 0",
  borderTop: "1px solid #ddd",

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
  friend: ["1.twitter verification", "2.friend-nft", "3.friend-nft", "4.when"],

  group: ["1.twitter verification", "2.group-nft", "3.group-nft", "4.when"],
};

const Details = ({ type }) => {
  const [infoOpen, setInfoOpen] = useState(false);
  const [releaseOpen, setReleaseOpen] = useState(false);
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

  // check is required
  const judgeMint = useCallback(() => {
    if (mintInp.length === 0) {
      ToastMention({ message: "mint value is required" });
    }
  }, [mintInp]);

  const changeMintInp = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setMintInp(e.target.value);
    }
  };

  const changeRoyaltiesInp = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setRoyaltiesInp(e.target.value);
    }
  };

  return (
    <Paper>
      <Typography variant="subtitle1">
        {isFriend ? "Friend-NFT details" : "Group-NFT details"}
      </Typography>

      <Box sx={{}}>
        {showDetails ? (
          <ReleaseDetailsWrapper>
            <ReleaseDetailsItem>
              <Typography>Contract Address: </Typography>
              <EllipsisAddress account="0x5435e8bb74d7ba8f4a76287dc0e75e203d87647e" />
            </ReleaseDetailsItem>
            <Typography>Release Amount: 150</Typography>
            <Typography>Mint to self: 50</Typography>

            <Typography variant="subtitle1">
              Note:Your Friend-NFT is still not listed,please click button below
              for listing operation
            </Typography>
          </ReleaseDetailsWrapper>
        ) : (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
            spacing={1}
          >
            <Button
              variant="outlined"
              sx={{
                fontWeight: 500,
              }}
              onClick={() => {
                setReleaseOpen(true);
              }}
            >
              {isFriend ? "Release Friend-NFT" : "Release Group-NFT"}
            </Button>
            <InfoOutlinedIcon
              onClick={() => {
                setInfoOpen(true);
              }}
            />
          </Stack>
        )}
      </Box>

      <BaseDialog aria-label="Release_NFT_Modal" open={releaseOpen}>
        <DialogTitle>
          <Typography>
            {isFriend ? "Release Friend-NFT" : "Release Group-NFT"}
          </Typography>

          <IconButton
            aria-label="close"
            onClick={() => {
              setReleaseOpen(false);
            }}
            sx={{
              position: "absolute",
              right: 18,
              top: 18,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

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
          <Button
            variant="contained"
            onClick={() => {
              handlePayMint();
            }}
          >
            Pay 100 Key
          </Button>
        </DialogContent>
      </BaseDialog>

      <BaseDialog open={infoOpen}>
        <DialogTitle>Release Introduce</DialogTitle>
        <DialogContent>
          <Box>
            {introduceList &&
              introduceList.map((item, index) => (
                <Typography key={index}>{item}</Typography>
              ))}
          </Box>
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
        </DialogContent>
      </BaseDialog>
    </Paper>
  );
};

export default memo(Details);
