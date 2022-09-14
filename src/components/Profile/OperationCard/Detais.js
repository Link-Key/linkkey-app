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
import {
  getIsIssueNFT,
  getStakedInfo,
  StakeInstance,
  stakeNFT,
} from "../../../contracts/Stake";
import CommonLoadingBtn from "../../Button/LoadingButton";
import { getKeyBalance, weiFormatToEth, hexToNumber } from "../../../utils";
import { getResolverOwner, getTokenIdOfName } from "../../../contracts/SNS";
import { useRouter } from "next/router";
import { useDialog } from "../../../providers/ApproveDialog";

import { contractAddress, emptyAddress } from "../../../config/const";
import { getChainId } from "../../../utils/web3";
import { useSelector } from "react-redux";
import CreateGroupDialog from "./CreateGroupDialog";
import {
  balanceOf,
  getLastTokenId,
  getOwner,
  getTaxPreparation,
  getTotal,
  NFTInstance,
} from "../../../contracts/NFT";
import { issueNFT, myContracts, queryUserInfo } from "../../../api";
import useTransaction from "../../../hooks/useTransaction";
import InfoDialog from "./InfoDialog";

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

const Details = ({ type, contractAdd, profileAdd }) => {
  // dialog switch
  const [infoOpen, setInfoOpen] = useState(false);
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  // show nft details
  const [showDetails, setShowDetails] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // min fee price
  const [feeState, setFeeState] = useState(0);
  // fee of erc20 address
  const [feeAddress, setFeeAddress] = useState("");
  // details info
  const [detailsInfo, setDetailsInfo] = useState({ tax: "-", balance: "0" });

  const [twitterStatus, setTwitterStatus] = useState(false);
  const [mintInp, setMintInp] = useState("");
  const [royaltiesInp, setRoyaltiesInp] = useState("");
  const [transferTokenId, setTransferTokenId] = useState(0);

  const isFriend = type === "friend" ? true : false;
  // friend:1 , group:2
  const createType = isFriend ? 1 : 2;

  const { account } = useSelector((state) => ({
    account: state.walletInfo.account,
  }));
  const chainId = getChainId();
  // to address
  const stakeAdd = contractAddress(chainId).stakeAddress;

  const router = useRouter();
  const keyName =
    router && router.query && router.query.name && router.query.name[0]
      ? router.query.name[0]
      : "";

  const { dialogDispatch, state } = useDialog();

  // todo query balance
  const mintNFT = useCallback(async () => {
    clearInterval(window.timer);
    dialogDispatch({ type: "ADD_STEP" });

    const keyBalance = await getKeyBalance(account);
    if (keyBalance > feeState) {
      try {
        const tokenId = await getTokenIdOfName(keyName);

        await stakeNFT(tokenId, createType, mintInp, royaltiesInp);

        setShowDetails(true);
        dialogDispatch({ type: "ADD_STEP" });
        dialogDispatch({ type: "CLOSE_DIALOG" });
      } catch (error) {
        console.log("mintNFTErr:", error);
      }
    } else {
      dialogDispatch({ type: "CLOSE_DIALOG" });
    }
  }, [
    dialogDispatch,
    keyName,
    account,
    feeState,
    createType,
    mintInp,
    royaltiesInp,
  ]);

  const { handlePayMint } = useTransaction({
    coinAddress: feeAddress,
    from: profileAdd,
    to: stakeAdd,
    price: feeState,
    executeFn: mintNFT,
  });

  // pay mint NFT
  const handlePayMintFn = useCallback(async () => {
    await handlePayMint();
    setReleaseOpen(false);
    dialogDispatch({ type: "SET_LOADING", payload: false });
  }, [handlePayMint, dialogDispatch]);

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
        setFeeState(weiFormatToEth(fee.feeAmount));
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

  const handleOpenTransferDialog = useCallback(async () => {
    setBtnLoading(true);
    const tokenIdHex = await getLastTokenId(contractAdd, account);
    const tokenId = hexToNumber(tokenIdHex);
    console.log("tokenIdHex:", tokenIdHex);
    console.log("tokenId:", tokenId);

    if (tokenId) {
      setTransferTokenId(tokenId);
      setTransferOpen(true);
    }

    setBtnLoading(false);
  }, [contractAdd, account]);

  // const queryIssueStatus = useCallback(async () => {
  //   const resp = await queryUserInfo();
  //   console.log("queryIssueStatus:", resp);
  // }, []);

  // const issueNFTFn = useCallback(async () => {
  //   const reqParams = {
  //     address: profileAdd,
  //     mintAmount: mintInp === "" ? 0 : Number(mintInp),
  //     royalty: royaltiesInp === "" ? 0 : royaltiesInp,
  //     type: createType,
  //   };
  //   const resp = await issueNFT(reqParams);
  //   console.log("resp:", resp);
  // }, [createType, mintInp, royaltiesInp, profileAdd]);

  // const isStakeNFT = useCallback(async () => {
  //   try {
  //     const isStake = await getIsIssueNFT(profileAdd, createType);
  //     console.log("isStake:", isStake, "createType:", createType);
  //   } catch (error) {
  //     console.log("isStakeNFTErr:", error);
  //   }
  // }, [profileAdd, createType]);

  // const getMyContractFn = useCallback(async () => {
  //   const resp = await myContracts();
  //   if (
  //     resp &&
  //     resp.code === 200 &&
  //     resp.data &&
  //     (resp.data.friendsContract || resp.data.groupContract)
  //   ) {
  //     if (isFriend && resp.data && resp.data.friendsContract) {
  //       setDetailsInfo(resp.data.friendsContract);
  //     }
  //     if (!isFriend && resp.data.groupContract) {
  //       setDetailsInfo(resp.data.groupContract);
  //     }
  //   } else {
  //     isStakeNFT();
  //   }
  // }, [isFriend, isStakeNFT]);

  const getNFTInfoFn = useCallback(async () => {
    const tax = await getTaxPreparation(contractAdd);
    const balance = await balanceOf(contractAdd, profileAdd);
    if (tax) {
      setDetailsInfo((v) => ({ ...v, tax: hexToNumber(tax) }));
    }
    if (balance) {
      setDetailsInfo((v) => ({ ...v, balance: hexToNumber(balance) }));
    }
  }, [contractAdd, profileAdd]);

  useEffect(() => {
    if (contractAdd !== emptyAddress) {
      setShowDetails(true);
      getNFTInfoFn();
    }
  }, [contractAdd, getNFTInfoFn]);

  return (
    <Paper>
      <TitleWrapper>
        <Typography variant="subtitle1">
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
              <EllipsisAddress account={contractAdd} />
            </ReleaseDetailsItem>
            <Typography>Release Amount: 150</Typography>
            <Typography>Holding Amount: {detailsInfo.balance}</Typography>
            <Typography>Royalties: {detailsInfo.tax}%</Typography>

            <Typography variant="subtitle1">
              Note:Your Friend-NFT is still not listed,please click button below
              for listing operation
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={2}>
              <CommonLoadingBtn
                loading={btnLoading}
                variant="outlined"
                onClick={handleOpenTransferDialog}
              >
                Transfer
              </CommonLoadingBtn>
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
              {isFriend
                ? `
              Note:Friend-NFT must be verified by twitter before it can be
              release,and your sns domain name will be locked into a pledge
              contract`
                : "Note: Group-NFT must be verified by twitter before it can be release, and your sns domain name will be locked into a pledge contract"}
            </Typography>
          </ReleaseData>
        </DialogContent>
        <CommonLoadingBtn
          loading={state.loading}
          variant="contained"
          sx={{
            margin: "0 auto",
          }}
          onClick={() => {
            handlePayMintFn();
          }}
        >
          Pay {feeState} Key
        </CommonLoadingBtn>
      </CommonDialog>

      {/* Info modal */}
      <InfoDialog
        open={infoOpen}
        title="Release Introduce"
        type={isFriend}
        onClose={() => {
          setInfoOpen(false);
        }}
      />

      <TransferDialog
        open={transferOpen}
        title="Transfer"
        contractAdd={contractAdd}
        tokenId={transferTokenId}
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
