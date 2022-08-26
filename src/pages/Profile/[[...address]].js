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
import { memo } from "react";
import { useSelector } from "react-redux";
import EllipsisAddress from "../../components/EllipsisAddress";
import OuterLink from "../../components/SideBar/OuterLink";
import SettingIcon from "../../assets/icons/common/Setting.svg";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OperationCard from "../../components/Profile/OperationCard";
import FriendAndGroupCard from "../../components/Profile/FriendAndGroupCard";

import { getFee, stakeNFT } from "../../contracts/Stake";

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
          address: [""],
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

const testfunction = async () => {
  // const fee = await getFee(1);
  // console.log('fee', fee)
  stakeNFT(1, 1)
}

const Profile = () => {
  const { account, snsName } = useSelector((state) => {
    return {
      account: state.walletInfo.account,
      snsName: state.walletInfo.snsName,
    };
  });

  return (
    <Stack spacing={3}>
      <CardInfoWrapper>
        <Stack direction="row" alignItems="center" spacing={4}>
          <Avatar
            sx={{
              width: "100px",
              height: "100px",
              borderRadius: "12px",
            }}
          />
          <Stack spacing={2}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "28px",
                lineHeight: "32px",
                color: "#ea6060",
              }}
            >
              {snsName}
            </Typography>
            <Box
              justifyContent="center"
              sx={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "2px 0",
              }}
            >
              <EllipsisAddress account={account} />
            </Box>
            <OuterLink />
          </Stack>
        </Stack>
        <Stack
          direction="column"
          alignItems="flex-end"
          justifyContent="space-between"
        >
          <Button variant="outlined" onClick={() => testfunction()}>DID Card</Button>
          <IconButtonWrapper>
            <SettingIcon />
          </IconButtonWrapper>
        </Stack>
      </CardInfoWrapper >

      <OperationCard />

      <FriendAndGroupCard />
    </Stack >
  );
};

export default memo(Profile);
