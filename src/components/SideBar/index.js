import {
  Box,
  Button,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import Image from "next/image";
// import { ReactComponent as Logo } from "../../assets/icons/logo.svg";
import LinkkeyLogo from "../../assets/images/LinkkeyLogo.png";
import OuterLink from "./OuterLink";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import { useWalletInfo } from "../../providers/wallet";
import { useSelector } from "react-redux";
import { splitAddress } from "../../utils";
import CommonLoadingBtn from "../Button/LoadingButton";
import { useRouter } from "next/router";
import { useCallback } from "react";

const SideBarWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  height: "100vh",
  color: "black",
  padding: "40px 20px",
  borderRadius: "0 12px 12px 0",
  boxShadow: "1px 0px 0px rgba(255, 255, 255, 0.1)",

  width: "260px",
}));

const SideListItem = styled(ListItemButton)((props) => ({
  display: "flex",
  width: "100%",
  background: props.active ? "#00000012" : "transparent",
  borderRadius: "16px",
  cursor: "pointer",
  span: {
    fontSize: 16,
    fontWeight: 500,
  },
  "& span,svg": {
    color: props.active ? "#ea6060" : "inherit",
  },
  "&:hover": {
    backgroundColor: "#00000012",
    color: "#ea6060",
    svg: {
      color: "#ea6060",
    },
  },
}));

const menuList = [
  {
    name: "Profile",
    icon: <InsertEmoticonIcon />,
  },
  {
    name: "Docs",
    icon: <DescriptionRoundedIcon />,
  },
  {
    name: "FAQ",
    icon: <HelpCenterIcon />,
  },
];

const SideBar = () => {
  const { connectWallet, disconnectWallet } = useWalletInfo();

  const router = useRouter();

  const { account, connecting } = useSelector((state) => {
    return {
      account: state.walletInfo.account,
      connecting: state.walletInfo.connecting,
    };
  });

  const handleHref = (name) => {
    if (name === "Profile") {
      if (account) {
        return router.push(`/${name}/${account}`);
      }
      ToastMention({ message: "未注册SNS域名", type: "warn" });
      return null;
    }
    return router.push(`/${name}`);
  };

  const handleListActive = useCallback(
    (item) => {
      if (item.name === "Profile") {
        const address =
          router.query && router.query.address ? router.query.address[0] : "";
        if (
          router.pathname.includes(item.name) &&
          address &&
          address === account
        ) {
          return 1;
        }
        return 0;
      }
      return router.pathname.includes(item.name) ? 1 : 0;
    },
    [router, account]
  );

  return (
    <SideBarWrapper>
      <Box>
        <Link
          sx={{
            display: "flex",
            alignItems: "center",
            height: "80px",
            img: {
              width: "100%",
            },
          }}
          onClick={() => {
            router.push("/");
          }}
        >
          <Image src={LinkkeyLogo} alt="logo" />
        </Link>

        <List
          component="nav"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "20px",
            marginTop: "50px",
          }}
        >
          {menuList.map((item, index) => (
            <SideListItem
              key={index}
              active={handleListActive(item)}
              onClick={() => {
                handleHref(item.name);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </SideListItem>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
        }}
      >
        <CommonLoadingBtn
          variant="outlined"
          loading={connecting}
          sx={{
            textAlign: "center",
          }}
          onClick={() => {
            if (account) {
              disconnectWallet();
            } else {
              connectWallet();
            }
          }}
        >
          {account ? "disconnect" : "Connect Wallet"}
        </CommonLoadingBtn>
        <OuterLink />
        <Typography>© 2021-2022 by Linkkey DAO</Typography>
      </Box>
    </SideBarWrapper>
  );
};

export default SideBar;
