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
} from "@mui/material";
import { useCallback } from "react";
import { memo, useState } from "react";
import CommonTabs from "../../components/CommonTabs";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddChatDialog from "../../components/Chat/AddChatDialog";

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

const AccordionWrapper = styled(Accordion)(() => ({
  padding: "0",

  ":before": {
    height: 0,
  },

  "& .MuiAccordionSummary-root": {
    padding: "0 12px",
    minHeight: "unset",

    borderBottom: "1px solid #ddd",
  },

  "& .MuiAccordionSummary-root .Mui-expanded": {
    margin: "12px 0px",
  },

  "& .MuiAccordionDetails-root": {
    padding: "0",
  },

  "& .MuiListItemButton-root": {
    gap: "10px",
  },
}));

const RelationListWrapper = styled(Box)(() => ({
  marginTop: "20px",

  ".MuiTypography-subtitle1": {
    fontSize: "14px",
    padding: "0 12px",
  },
}));

const RelationList = styled(List)(() => ({
  height: "40vh",
  overflowY: "auto",
  padding: "0",
  ".MuiListItemButton-root": {
    padding: "8px 16px",
    gap: "10px",
  },
}));

export async function getStaticPaths() {
  return {
    fallback: "blocking",
    paths: [
      {
        params: {
          name: ["Friend", "Group"],
        },
      },
    ],
  };
}

export async function getStaticProps({ params }) {
  const { name } = params;
  console.log("params:", params);
  return {
    props: {
      type: name === "friend" ? 0 : 1,
    },
  };
}

const Chat = ({ type }) => {
  const [tabValue, setTabValue] = useState(type);
  const [addOpen, setAddOpen] = useState(false);

  console.log("ty0pe:", type);

  const handleChangeTabs = useCallback((e, newValue) => {
    setTabValue(newValue);
  }, []);

  const tabList = ["Friend", "Group"];

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
            <AccordionWrapper defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Message</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ height: "30vh", overflowY: "auto" }}>
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
            </AccordionWrapper>

            <RelationListWrapper>
              <Stack p={0}>
                <Typography variant="subtitle1">Friend</Typography>
              </Stack>
              <RelationList component="nav">
                {[0, 1, 2, 3, , 4, 5, 6].map((item) => (
                  <ListItemButton key={item}>
                    <Avatar />
                    <ListItemText
                      primary="liujuncheng.key"
                      secondary="Jan 9, 2014"
                    />
                  </ListItemButton>
                ))}
              </RelationList>
            </RelationListWrapper>
          </LeftBox>
        </GridWrapper>
        <GridWrapper item xs="auto">
          <RightBox>xs=8</RightBox>
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
