import {
  IconButton,
  InputBase,
  Paper,
  Stack,
  Box,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { memo, useCallback, useState } from "react";
import CommonTabs from "../../components/CommonTabs";
import PageTitleWrapper from "../../components/PageTitleWrapper/PageTitleWrapper";
import MarketItem from "../../components/Market/MarketItem";

const MarketWrapper = styled(Box)(() => ({
  display: "grid",
  justifyContent: "center",
  gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
  gridGap: "20px 20px",
  padding: "20px 0",
}));

const tabList = ["Friend", "Group"];

const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const Market = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTabs = useCallback((e, newValue) => {
    setTabValue(newValue);
  }, []);
  return (
    <Stack spacing={3}>
      <PageTitleWrapper title="Market" />

      <Paper>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          p={0}
        >
          <CommonTabs
            tabValue={tabValue}
            tabList={tabList}
            handleChange={handleChangeTabs}
          />

          <InputBase
            placeholder="Please input name"
            sx={{ height: "40px", paddingRight: "0px" }}
            endAdornment={
              <IconButton sx={{ borderRadius: "12px" }}>
                <SearchIcon />
              </IconButton>
            }
          />
        </Stack>
        <MarketWrapper>
          {list.map((item) => (
            <MarketItem key={item} />
          ))}
        </MarketWrapper>
      </Paper>
    </Stack>
  );
};

export default memo(Market);
