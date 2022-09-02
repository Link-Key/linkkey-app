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
import { StakeInstance, stakeNFT } from "../../../contracts/Stake";
import CommonLoadingBtn from "../../Button/LoadingButton";
import { handleHexEthValue, handleWeiValue, hexToNumber } from "../../../utils";
import { getResolverOwner, getTokenIdOfName } from "../../../contracts/SNS";
import { useRouter } from "next/router";
import { useDialog } from "../../../providers/ApproveDialog";
import { allowance, approve } from "../../../contracts/ERC20";
import { contractAddress } from "../../../config/const";
import { getChainId } from "../../../utils/web3";
import { useSelector } from "react-redux";
import CreateGroupDialog from "./CreateGroupDialog";

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
  // dialog switch
  const [infoOpen, setInfoOpen] = useState(false);
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  // show nft details
  const [showDetails, setShowDetails] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [payBtnLoading, setPayBtnLoading] = useState(false);
  // min fee price
  const [feeState, setFeeState] = useState(0);
  // fee of erc20 address
  const [feeAddress, setFeeAddress] = useState("");
  // profile address
  const [profileAdd, setProfileAdd] = useState("");
  // is self profile
  const [isSelf, setIsSelf] = useState(false);
  const [twitterStatus, setTwitterStatus] = useState(false);
  const [mintInp, setMintInp] = useState("");
  const [royaltiesInp, setRoyaltiesInp] = useState("");

  const isFriend = type === "friend" ? true : false;
  const introduceList =
    type === "friend" ? ReleaseIntroduce.friend : ReleaseIntroduce.group;

  const { account } = useSelector((state) => ({
    account: state.walletInfo.account,
  }));
  const chainId = getChainId();
  // to address
  const stakeAdd = contractAddress(chainId).stakeAddress;

  const router = useRouter();
  const keyName = router.query.name[0];

  const { dialogDispatch } = useDialog();

  const queryAllowance = useCallback(async () => {
    try {
      const value = await allowance(feeAddress, profileAdd, stakeAdd);
      return hexToNumber(value);
    } catch (error) {
      console.log("allowanceError:", error);
      return 0;
    }
  }, [feeAddress, profileAdd, stakeAdd]);

  const callApprove = useCallback(async () => {
    const value = await queryAllowance();
    console.log("approveFee:", handleWeiValue(feeState));
    try {
      if (value >= feeState) {
        return "approve";
      } else {
        const resp = await approve(
          feeAddress,
          stakeAdd,
          handleWeiValue(feeState)
        );
        console.log("approveResp:", resp);
        return "unApprove";
      }
    } catch (error) {
      console.log("callApproveErr:", error);
      return false;
    }
  }, [feeAddress, feeState, queryAllowance, stakeAdd]);

  const mintNFT = useCallback(async () => {
    clearInterval(window.timer);
    dialogDispatch({ type: "ADD_STEP" });
    try {
      const tokenId = await getTokenIdOfName(keyName);
      console.log("tokenId:", tokenId);
      const mintType = isFriend ? 1 : 2;
      await stakeNFT(tokenId, mintType);
      setShowDetails(true);
      dialogDispatch({ type: "ADD_STEP" });
      dialogDispatch({ type: "CLOSE_DIALOG" });
    } catch (error) {
      console.log("mintNFTErr:", error);
    }
  }, [isFriend, dialogDispatch, keyName]);

  // pay mint NFT
  const handlePayMint = useCallback(async () => {
    setPayBtnLoading(true);
    const approveStatus = await callApprove();
    console.log("approveStatus:", approveStatus);
    if (approveStatus === "unApprove") {
      dialogDispatch({ type: "OPEN_DIALOG" });
      setTimeout(() => {
        window.timer = setInterval(async () => {
          const allowancePrice = await queryAllowance();
          console.log("allowancePrice:", allowancePrice);
          if (allowancePrice > 0) {
            await mintNFT();
          }
        }, 1000);
      }, 0);
    }

    if (approveStatus === "approve") {
      dialogDispatch({ type: "OPEN_DIALOG" });
      await mintNFT();
    }

    setReleaseOpen(false);
    setPayBtnLoading(false);
  }, [callApprove, queryAllowance, dialogDispatch, mintNFT]);

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
    try {
      const typeNumber = isFriend ? 1 : 2;
      const fee = await stakeInstance.getFee(typeNumber);
      if (fee && fee.feeAmount && fee.keyAddress) {
        setFeeState(handleHexEthValue(fee.feeAmount));
        setFeeAddress(fee.keyAddress);
      } else {
        setBtnLoading(false);
        return;
      }
      setBtnLoading(false);
      setReleaseOpen(true);
    } catch (error) {
      setBtnLoading(false);
      console.log("stakeGetFee:", error);
    }
  }, [isFriend]);

  useEffect(() => {
    if (keyName) {
      getResolverOwner(keyName).then((address) => {
        setProfileAdd(address);
        if (address === account) {
          setIsSelf(true);
        }
      });
    }
  }, [keyName, account]);

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
                sx={{
                  display: isFriend ? "none" : "block",
                }}
                variant="outlined"
                onClick={() => {
                  setCreateGroupOpen(true);
                }}
              >
                Create Group
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
        <CommonLoadingBtn
          loading={payBtnLoading}
          variant="contained"
          sx={{
            margin: "0 auto",
          }}
          onClick={() => {
            handlePayMint();
          }}
        >
          Pay {feeState} Key
        </CommonLoadingBtn>
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
      <CreateGroupDialog
        open={createGroupOpen}
        title="Create Group"
        contractAdd="0x5435e8bb74d7ba8f4a76287dc0e75e203d87647e"
        onClose={() => {
          setCreateGroupOpen(false);
        }}
      />
    </Paper>
  );
};

export default memo(Details);
