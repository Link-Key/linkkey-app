import { memo, useCallback, useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  LinearProgress,
  Pagination,
  Paper,
  Stack,
} from "@mui/material";
import PageTitleWrapper from "../../../components/PageTitleWrapper/PageTitleWrapper";
import BuyDialog from "../../../components/Market/BuyDialog";
import { queryOrderList } from "../../../api/market";
import TableNoRow from "../../../components/TableNoRow";
import TableNoData from "../../../assets/icons/common/tableNoRows.svg";

const PurchaseList = () => {
  const [buyOpen, setBuyOpen] = useState(false);
  const [pageState, setPageState] = useState(1);
  const [pageTotal, setPageTotal] = useState(1);
  const [buyList, setBuyList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const pageSize = 30;

  const commonColumnsProps = {
    sortable: false,
    filterable: false,
    hideable: false,
    disableColumnMenu: true,
    headerAlign: "center",
    flex: 1,
    align: "center",
  };

  const TableNoRowComp = () => {
    return (
      <Stack
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <TableNoData />
      </Stack>
    );
  };

  const columns = [
    {
      field: "name",
      headerName: "Domain name",
      width: 90,
      ...commonColumnsProps,
    },
    {
      field: "tokenId",
      headerName: "TokenID",
      width: 150,
      ...commonColumnsProps,
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      ...commonColumnsProps,
    },
    {
      field: "action",
      headerName: "Action",
      type: "number",
      width: 110,
      ...commonColumnsProps,
      renderCell: () => {
        return (
          <Button
            variant="outlined"
            onClick={() => {
              setBuyOpen(true);
            }}
          >
            Buy
          </Button>
        );
      },
    },
  ];

  const rows = [
    { id: 1, name: "Snow", action: "Jon", price: 35 },
    { id: 2, name: "Lannister", action: "Cersei", price: 42 },
    { id: 3, name: "Lannister", action: "Jaime", price: 45 },
    { id: 4, name: "Stark", action: "Arya", price: 16 },
    { id: 5, name: "Targaryen", action: "Daenerys", price: null },
    { id: 6, name: "Melisandre", action: null, price: 150 },
    { id: 7, name: "Clifford", action: "Ferrara", price: 44 },
    { id: 8, name: "Frances", action: "Rossini", price: 36 },
    { id: 9, name: "Roxie", action: "Harvey", price: 65 },
  ];

  const queryOrderListFn = useCallback(
    async ({ page }) => {
      setListLoading(true);
      const reqParams = {
        contractAddress: "111",
        pageNum: page,
        pageSize: pageSize,
      };
      const resp = await queryOrderList(reqParams);
      if (resp && resp.code === 200 && resp.data && resp.data.list) {
        setPageTotal(resp.data.pages);
        setBuyList(resp.data.list);
      }
      setListLoading(false);
    },
    [pageSize]
  );

  console.log("buyList:", buyList);

  useEffect(() => {
    setListLoading(true);
    queryOrderListFn({ page: 1 });
    setListLoading(false);
  }, []);

  return (
    <Stack spacing={3}>
      <PageTitleWrapper title="Buy Follow-NFT" />

      <Paper sx={{ width: "100%" }}>
        <Box sx={{ height: "72vh", width: "100%" }}>
          <DataGrid
            rows={buyList}
            columns={columns}
            pageSize={20}
            loading={listLoading}
            components={{
              LoadingOverlay: LinearProgress,
              NoRowsOverlay: TableNoRowComp,
            }}
            hideFooter={true}
            disableSelectionOnClick={true}
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
        <Pagination
          count={pageTotal}
          defaultPage={1}
          page={pageState}
          color="primary"
          variant="outlined"
          shape="rounded"
          sx={{
            margin: "20px auto 0",
            ".MuiPagination-ul": {
              justifyContent: "center",
            },
          }}
          onChange={(e, page) => {
            setPageState(page);
            queryOrderListFn({ page });
          }}
        />
      </Paper>

      <BuyDialog
        open={buyOpen}
        title="Buy Info"
        contractAdd="0x5435e8bb74d7ba8f4a76287dc0e75e203d87647e"
        onClose={() => {
          setBuyOpen(false);
        }}
      />
    </Stack>
  );
};

export default memo(PurchaseList);
