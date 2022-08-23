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

const CardInfoWrapper = styled(Card)(() => ({
  display: "flex",
  justifyContent: "space-between",
  borderRadius: "12px",
}));

// const OperationCard = styled(Card)(() => ({
//   display: "flex",
//   flexDirection: "column",
//   gap: "20px",
//   borderRadius: "12px",
//   // height: "500px",
//   padding: "16px 20px",

//   ".MuiTypography-title": {
//     fontWeight: 500,
//     fontSize: "25px",
//     color: "#9a9a9a",
//   },
// }));

// const OperationAlert = styled(Paper)(() => ({
//   maxWidth: "500px",
//   height: "70px",
//   padding: "16px 20px",
//   borderRadius: "12px",
//   textAlign: "center",
//   background: "#ea6060",
//   color: "#fff",
//   fontWeight: 500,
//   margin: "0 auto",
// }));

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
        <Stack
          direction="row"
          alignItems="center"
          spacing={4}
          sx={{
            padding: "16px 20px",
          }}
        >
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
            <Stack
              justifyContent="center"
              sx={{
                border: "1px solid #ddd",
                borderRadius: "12px",
              }}
            >
              <EllipsisAddress account={account} />
            </Stack>
            <OuterLink />
          </Stack>
        </Stack>
        <Stack
          direction="column"
          alignItems="flex-end"
          justifyContent="space-between"
          sx={{
            padding: "16px 20px",
          }}
        >
          <Button variant="outlined">DID Card</Button>
          <IconButtonWrapper>
            <SettingIcon />
          </IconButtonWrapper>
        </Stack>
      </CardInfoWrapper>

      <OperationCard />

      {/* <OperationCard>
        <Typography variant="title">Operation</Typography>
        <OperationAlert>
          You are not currently release Friend-NFT or Group-NFT, click the
          button below to release your NFT!
        </OperationAlert>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            "& .MuiPaper-root": {
              width: "100%",
              minHeight: "300px",
              padding: "16px 20px",
              borderRadius: "12px",
            },
            ".MuiTypography-subtitle1": {
              fontSize: "20px",
              fontWeight: 500,
            },
            svg: {
              color: "#ea6060",
              cursor: "pointer",
            },
          }}
        >
          <Paper>
            <Typography variant="subtitle1">Friend-NFT details</Typography>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              height="100%"
              spacing={1}
            >
              <Button variant="outlined">Release Friend-NFT</Button>
              <InfoOutlinedIcon />
            </Stack>
          </Paper>

          <Paper>
            <Typography variant="subtitle1">Friend-NFT details</Typography>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              height="100%"
              spacing={1}
            >
              <Button variant="outlined">Release Friend-NFT</Button>
              <InfoOutlinedIcon />
            </Stack>
          </Paper>
        </Stack>
      </OperationCard> */}
    </Stack>
  );
};

export default memo(Profile);
