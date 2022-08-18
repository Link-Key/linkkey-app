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

const SideBar = () => {
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
            <ListItemButton
              key={index}
              sx={{
                display: "flex",
                width: "100%",
                borderRadius: "16px",
                span: {
                  fontSize: 16,
                  fontWeight: 500,
                },
                "&:hover": {
                  backgroundColor: "#ea606063",
                  color: "white",
                  svg: {
                    color: "white",
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
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
        <Button
          variant="outlined"
          sx={{
            textAlign: "center",
          }}
        >
          Connect Wallet
        </Button>
        <OuterLink />
        <Typography>© 2021-2022 by Linkkey DAO</Typography>
      </Box>
    </SideBarWrapper>
  );
};

export default SideBar;
