import { memo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Paper, Stack } from "@mui/material";
import PageTitleWrapper from "../../../components/PageTitleWrapper/PageTitleWrapper";
import BuyDialog from "../../../components/Market/BuyDialog";

const PurchaseList = () => {
  const [buyOpen, setBuyOpen] = useState(false);

  const commonColumnsProps = {
    sortable: false,
    filterable: false,
    hideable: false,
    disableColumnMenu: true,
    headerAlign: "center",
    flex: 1,
    align: "center",
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

  return (
    <Stack spacing={3}>
      <PageTitleWrapper title="Buy Follow-NFT" />

      <Paper sx={{ height: "85vh", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={20}
          disableSelectionOnClick={true}
          // rowsPerPageOptions={[5]}
          experimentalFeatures={{ newEditingApi: true }}
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
