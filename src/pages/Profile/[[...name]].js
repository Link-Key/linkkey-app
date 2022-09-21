import {
  Box,
  Button,
  Card,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EllipsisAddress from "../../components/EllipsisAddress";
import OuterLink from "../../components/SideBar/OuterLink";
import SettingIcon from "../../assets/icons/common/Setting.svg";

import OperationCard from "../../components/Profile/OperationCard";
import FriendAndGroupCard from "../../components/Profile/FriendAndGroupCard";
import DIDCardDialog from "../../components/DIDCardDialog";
import { useRouter } from "next/router";
import ToastMention from "../../components/ToastMessage";
import { getResolverOwner } from "../../contracts/SNS";
import OtherProfileCard from "../../components/Profile/OtherProfileCard";
import CommonAvatar from "../../components/Common/CommonAvatar";
import { fromNameGetInfo } from "../../utils/web3";
import ProfileLink from "../../components/Profile/ProfileLink";

const CardInfoWrapper = styled(Card)(() => ({
  display: "flex",
  justifyContent: "space-between",
  borderRadius: "12px",
}));

const IconButtonWrapper = styled(IconButton)(() => ({
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  borderRadius: "8px",
  padding: "6px",
  ":hover": {
    color: "#FB6D05",
  },
}));

const SkeletonCard = styled(Card)(() => ({
  display: "flex",
  gap: "20px",
  borderRadius: "12px",
  ".MuiSkeleton-root": {
    display: "block",
    width: "100%",
    minWidth: "400px",
  },
}));

export async function getStaticPaths() {
  return {
    fallback: "blocking",
    paths: [
      {
        params: {
          name: [""],
        },
      },
    ],
  };
}

export async function getStaticProps({ params }) {
  return {
    props: { ...params },
  };
}

const Profile = ({ name }) => {
  const { account } = useSelector((state) => {
    return {
      account: state.walletInfo.account,
    };
  });

  const [basicInfo, setBasicInfo] = useState({
    avatar: name,
    description: "-",
  });

  const router = useRouter();

  const [showDIDCard, setShowDIDCard] = useState(false);
  // profile address
  const [profileAdd, setProfileAdd] = useState("");

  // is self profile
  const [isSelf, setIsSelf] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  const profileName = name && name[0] ? name : "";

  const handleShowDIDCard = useCallback(() => {
    setShowDIDCard(true);
  }, []);

  const handleCloseDIDCard = useCallback(() => {
    setShowDIDCard(false);
  }, []);

  const hasPathParams = () => {
    if (!name) {
      router.push("/");
      ToastMention({ message: "Unregistered SNS domain name", type: "warn" });
    }
  };

  const getBasicUserInfo = useCallback(async () => {
    try {
      const userInfo = await fromNameGetInfo(name[0]);
      setSkeletonLoading(false);
      setBasicInfo(userInfo);
    } catch (error) {
      console.log("getBasicUserInfoErr:", getBasicUserInfo);
    }
  }, [name]);

  useEffect(() => {
    hasPathParams();
  }, []);

  useEffect(() => {
    if (name && name[0]) {
      getResolverOwner(name[0]).then((address) => {
        setProfileAdd(address.toLowerCase());
        if (address.toLowerCase() === account) {
          setIsSelf(true);
        }
      });

      getBasicUserInfo();
    }
  }, [name, account, getBasicUserInfo]);

  console.log("profileAdd:", profileAdd);

  return (
    <Stack spacing={3}>
      <CardInfoWrapper>
        <Stack direction="row" alignItems="flex-start" spacing={4}>
          <CommonAvatar
            account={profileAdd}
            sx={{
              width: "100px !important",
              height: "100px !important",
              borderRadius: "12px",
            }}
          />
          <Stack spacing={2} p={0}>
            {profileName ? (
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "28px",
                  lineHeight: "32px",
                  color: "#ea6060",
                }}
              >
                {profileName}
              </Typography>
            ) : (
              <Skeleton />
            )}
            {profileAdd ? (
              <Box
                justifyContent="center"
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "2px 0",
                }}
              >
                <EllipsisAddress account={profileAdd} />
              </Box>
            ) : (
              <Skeleton />
            )}
            {/* <OuterLink sx={{ justifyContent: "flex-start" }} /> */}
            {profileAdd ? <ProfileLink address={profileAdd} /> : <Skeleton />}
            <Typography>{basicInfo.description}</Typography>
          </Stack>
        </Stack>
        <Stack
          direction="column"
          alignItems="flex-end"
          justifyContent="space-between"
        >
          <Button variant="outlined" onClick={handleShowDIDCard}>
            DID Card
          </Button>
          {isSelf ? (
            <IconButtonWrapper
              onClick={() => {
                router.push("/Setting");
              }}
            >
              <SettingIcon />
            </IconButtonWrapper>
          ) : (
            <></>
          )}
        </Stack>
      </CardInfoWrapper>

      {skeletonLoading && !isSelf ? (
        <SkeletonCard
          sx={{
            flexWrap: { xs: "wrap", md: "wrap", lg: "unset", xl: "unset" },
          }}
        >
          <Skeleton height={300} />
          <Skeleton height={300} />
        </SkeletonCard>
      ) : isSelf ? (
        <OperationCard profileAdd={profileAdd} />
      ) : (
        <OtherProfileCard profileAdd={profileAdd} />
      )}

      <FriendAndGroupCard />

      <DIDCardDialog
        open={showDIDCard}
        name={profileName}
        onOpen={handleShowDIDCard}
        onClose={handleCloseDIDCard}
      />
    </Stack>
  );
};

export default memo(Profile);
