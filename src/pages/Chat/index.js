import {
  Box,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Stack,
  styled,
} from "@mui/material";
import { useCallback } from "react";
import { memo, useState } from "react";
import CommonTabs from "../../components/CommonTabs";
import SearchIcon from "@mui/icons-material/Search";
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
  padding: "16px 20px",
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

const Chat = () => {
  const [tabValue, setTabValue] = useState(0);
  const [addOpen, setAddOpen] = useState(false);

  const handleChangeTabs = useCallback((e, newValue) => {
    setTabValue(newValue);
  }, []);

  const tabList = ["Friend", <div key="group">Group</div>];

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
          <LeftBox></LeftBox>
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
