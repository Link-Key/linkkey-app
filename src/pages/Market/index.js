import {
  IconButton,
  InputBase,
  Paper,
  Stack,
  Box,
  styled,
  CircularProgress,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { memo, useCallback, useEffect, useState } from "react";
import CommonTabs from "../../components/CommonTabs";
import PageTitleWrapper from "../../components/PageTitleWrapper/PageTitleWrapper";
import MarketItem from "../../components/Market/MarketItem";
import { queryContractList } from "../../api/market";

const MarketWrapper = styled(Box)(() => ({
  width: "100%",
  display: "grid",
  justifyContent: "center",
  gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
  gridGap: "20px 20px",
  padding: "20px 0",
}));

const Market = () => {
  const [tabValue, setTabValue] = useState(0);
  const [marketList, setMarketList] = useState([]);
  const [pageState, setPageState] = useState(1);
  const [listLoading, setListLoading] = useState(false);
  const [pageTotal, setPageTotal] = useState(0);

  const tabList = ["Friend", <span key="group">Group</span>];

  const handleChangeTabs = useCallback((e, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setMarketList(list);
    } else {
      setMarketList([0, 1, 2, 3, 4, 5]);
    }
  }, []);

  const getMarketList = useCallback(async () => {
    setListLoading(true);
    if (tabValue === 0) {
      const resp = await queryContractList({
        type: "friends",
        pageNum: pageState,
        pageSize: 30,
      });
      console.log("marketList:", resp);
      if (resp && resp.code === 200 && resp.data && resp.data.list) {
        setPageTotal(resp.data.pages);
        setMarketList(resp.data.list);
      }
    }
    setListLoading(false);
  }, [pageState, tabValue]);

  useEffect(() => {
    getMarketList();
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
        {listLoading ? (
          <Stack height="30vh" justifyContent="center" alignItems="center">
            <CircularProgress sx={{ margin: "0 auto" }} />
          </Stack>
        ) : (
          <Stack p={0} justifyContent="center" alignItems="center">
            <MarketWrapper>
              {marketList.map((item) => (
                <MarketItem key={item} info={item} type={tabValue} />
              ))}
            </MarketWrapper>
            <Pagination
              count={pageTotal}
              defaultPage={1}
              page={pageState}
              color="primary"
              variant="outlined"
              shape="rounded"
              sx={{ margin: "20px auto 0" }}
              onChange={(e, page) => {
                setPageState(page);
                getMarketList();
              }}
            />
          </Stack>
        )}
      </Paper>
    </Stack>
  );
};

export default memo(Market);
