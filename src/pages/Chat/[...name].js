import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Stack,
  styled,
  List,
  ListItemButton,
  Avatar,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { useCallback, useEffect } from "react";
import { memo, useState } from "react";
import CommonTabs from "../../components/CommonTabs";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddChatDialog from "../../components/Chat/AddChatDialog";
import { CollectionsBookmarkOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useWalletInfo } from "../../providers/wallet";
import { splitAddress } from "../../utils";
import Conversation from "../../components/Conversation";
import { useSelector } from "react-redux";
import CommonAvatar from "../../components/Common/CommonAvatar";

const ChatHeader = styled(Paper)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

const GridWrapper = styled(Grid)(() => ({
  height: "81vh",
  borderRadius: "12px",
  boxShadow:
    "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
}));

const LeftBox = styled(Box)(() => ({
  height: "100%",
  width: "260px",
  background: "white",
  borderRadius: "12px 0 0 12px",
  // padding: "16px 20px",
  borderRight: "1px solid #ddd",
}));

const RightBox = styled(Box)(() => ({
  height: "100%",
  width: "calc(100vw - 623px)",
  background: "white",
  borderRadius: "0 12px 12px 0",
  padding: "16px 20px",
  borderLeft: "1px solid #ddd",
}));

// const AccordionWrapper = styled(Accordion)(() => ({
//   padding: "0",

//   ":before": {
//     height: 0,
//   },

//   "& .MuiAccordionSummary-root": {
//     padding: "0 12px",
//     minHeight: "unset",

//     borderBottom: "1px solid #ddd",
//   },

//   "& .MuiAccordionSummary-root .Mui-expanded": {
//     margin: "12px 0px",
//   },

//   "& .MuiAccordionDetails-root": {
//     padding: "0",
//   },

//   "& .MuiListItemButton-root": {
//     gap: "10px",
//   },
// }));

const RelationListWrapper = styled(Box)(() => ({
  height: "100%",
  overflowY: "auto",
  ".MuiTypography-subtitle1": {
    padding: "16px 20px",
    fontSize: "15px",
    fontWeight: 500,
  },
}));

const RelationList = styled(List)(() => ({
  padding: "0",
  ".MuiListItemButton-root": {
    padding: "8px 16px",
    gap: "10px",
  },
}));

const SelectWrapper = styled(Select)(() => ({
  border: "1px solid #9a9a9a",
  borderRadius: "12px",
  margin: "10px",
  textAlign: "right",
  ".MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  ".MuiSelect-select": {
    padding: "0px",
    borderRadius: "12px",
  },
}));

export async function getStaticPaths() {
  return {
    fallback: false,
    paths: [
      {
        params: {
          name: ["Friend"],
        },
      },
    ],
  };
}

export async function getStaticProps({ params }) {
  const { name } = params;
  return {
    props: {
      ...params,
      type: name[0] === "Friend" || "friend" ? 0 : 1,
    },
  };
}

const list = [
  {
    name: "liujuncheng.key",
    address: "0x5435e8Bb74D7Ba8F4a76287Dc0E75e203D87647e",
  },
  {
    name: "keibest.key",
    address: "0xB59E953EAc1f887dBc17ba0A97bc6aD8b2759c69",
  },
  {
    name: "dsdsds.key",
    address: "0xB3eF1C9718F3EAFaeb6fd7Ac63E8f43493101Ded",
  },
  {
    name: "bowen.key",
    address: "0xAf5d1fEA5Ae2656DDcd6CdB37471236B5C5Dcc17",
  },
];

const Chat = ({ type }) => {
  const [tabValue, setTabValue] = useState(type);
  const [selectItem, setSelectItem] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [conversation, setConversation] = useState({});

  const isFriend = tabValue === 0 ? true : false;

  const { client, initialClient } = useWalletInfo();

  const router = useRouter();

  const handleChangeTabs = useCallback(
    (e, newValue) => {
      setTabValue(newValue);
      if (newValue === 0) {
        console.log("newValue:", newValue);
        router.push(`/Chat/Friend`);
      }
      if (newValue === 1) {
        router.push(`/Chat/Group`);
      }
    },
    [router]
  );

  const handleSelectChange = useCallback((e) => {
    setSelectItem(e.target.value);
  }, []);

  const tabList = ["Friend", "Group"];

  useEffect(() => {
    if (!client) {
      initialClient();
    }
  }, [client, initialClient]);

  return (
    <Stack direction="column" spacing={2}>
      <ChatHeader>
        <CommonTabs
          tabValue={tabValue}
          tabList={tabList}
          handleChange={handleChangeTabs}
        />
        <Stack direction="row" spacing={1} p={0} alignItems="center">
          <InputBase
            placeholder={
              tabValue === 0 ? "Search friend Name" : "Search group name"
            }
            sx={{ height: "40px", paddingRight: "0px" }}
            endAdornment={
              <IconButton sx={{ borderRadius: "12px" }}>
                <SearchIcon />
              </IconButton>
            }
          />
          <IconButton
            onClick={() => {
              setAddOpen(true);
            }}
          >
            <GroupAddIcon />
          </IconButton>
        </Stack>
      </ChatHeader>

      <Grid container>
        <GridWrapper item>
          <LeftBox>
            {/* <AccordionWrapper defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Message</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ overflowY: "auto" }}>
                <List component="nav">
                  {[0, 1, 2, 3].map((item) => (
                    <ListItemButton key={item}>
                      <Avatar />
                      <ListItemText
                        primary="liujuncheng.key"
                        secondary="Jan 9, 2014"
                      />
                    </ListItemButton>
                  ))}
                </List>
              </AccordionDetails>
            </AccordionWrapper> */}

            <RelationListWrapper>
              <Stack direction="row" p={0} justifyContent="space-between">
                <Typography variant="subtitle1">
                  {isFriend ? "Friend" : "Group"}
                </Typography>

                <SelectWrapper value={selectItem} onChange={handleSelectChange}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="my">My</MenuItem>
                  <MenuItem value="his">His</MenuItem>
                </SelectWrapper>
              </Stack>
              <RelationList component="nav">
                {list.map((item, index) => (
                  <ListItemButton
                    key={index}
                    onClick={() => {
                      setConversation({ ...item });
                    }}
                  >
                    <CommonAvatar
                      account={item.address}
                      sx={{ borderRadius: "50%" }}
                    />
                    <ListItemText
                      primary={item.name}
                      secondary={splitAddress(item.address)}
                    />
                  </ListItemButton>
                ))}
              </RelationList>
            </RelationListWrapper>
          </LeftBox>
        </GridWrapper>
        <GridWrapper item xs="auto">
          <RightBox>
            <Conversation
              name={conversation.name}
              recipientAdd={conversation.address}
            />
            {/* <ul>
              {chatList.map((item) => (
                <li key={item.id}>{item.content}</li>
              ))}
            </ul>
            <div
              onClick={sendMessages.bind(this, "hello world")}
              style={{ cursor: "pointer" }}
            >
              send a message
            </div> */}
          </RightBox>
        </GridWrapper>
      </Grid>

      <AddChatDialog
        open={addOpen}
        type={tabValue}
        onClose={() => {
          setAddOpen(false);
        }}
      />
    </Stack>
  );
};

export default memo(Chat);
