import {
  Avatar,
  Box,
  Button,
  Card,
  IconButton,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EllipsisAddress from "../../components/EllipsisAddress";
import OuterLink from "../../components/SideBar/OuterLink";
import SettingIcon from "../../assets/icons/common/Setting.svg";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OperationCard from "../../components/Profile/OperationCard";
import FriendAndGroupCard from "../../components/Profile/FriendAndGroupCard";
import DIDCardDialog from "../../components/DIDCardDialog";
import { useRouter } from "next/router";
import { getLastTokenId } from "../../contracts/NFT";
import ToastMention from "../../components/ToastMessage";
import { getResolverOwner } from "../../contracts/SNS";
import OtherProfileCard from "../../components/Profile/OtherProfileCard";

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

  const router = useRouter();

  console.log("name:", name);

  const [showDIDCard, setShowDIDCard] = useState(false);
  // profile address
  const [profileAdd, setProfileAdd] = useState("");
  // is self profile
  const [isSelf, setIsSelf] = useState(false);

  const profileName = name && name[0] ? name : profileAdd;

  const handleShowDIDCard = useCallback(() => {
    setShowDIDCard(true);
  }, []);

  const handleCloseDIDCard = useCallback(() => {
    setShowDIDCard(false);
  }, []);

  const hasPathParams = () => {
    if (!name) {
      router.push("/");
      ToastMention({ message: "未注册SNS域名", type: "warn" });
    }
  };

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
    }
  }, [name, account]);

  return (
    <Stack spacing={3}>
      <CardInfoWrapper>
        <Stack direction="row" alignItems="flex-start" spacing={4}>
          <Avatar
            sx={{
              width: "100px",
              height: "100px",
              borderRadius: "12px",
            }}
          />
          <Stack spacing={2} p={0}>
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
            <OuterLink sx={{ justifyContent: "flex-start" }} />
            <Typography>description</Typography>
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
          <IconButtonWrapper
            onClick={() => {
              router.push("/Setting");
            }}
          >
            <SettingIcon />
          </IconButtonWrapper>
        </Stack>
      </CardInfoWrapper>

      {isSelf ? <OperationCard /> : <OtherProfileCard />}

      <FriendAndGroupCard />

      <DIDCardDialog
        open={showDIDCard}
        onOpen={handleShowDIDCard}
        onClose={handleCloseDIDCard}
      />
    </Stack>
  );
};

export default memo(Profile);
