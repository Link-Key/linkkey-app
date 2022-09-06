import {
  Stack,
  Paper,
  Button,
  Select,
  MenuItem,
  styled,
  Box,
} from "@mui/material";
import { memo, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TypographyWrapper } from "../../../components/Styled";

import SaleDialog from "../../../components/Profile/OperationCard/SaleDialog";

const TitleWrapper = styled(Paper)(() => ({
  // display: "flex",
  // justifyContent: "space-between",
  padding: "20px 0",
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
    fallback: "blocking",
    paths: [
      {
        params: {
          slug: ["0", "1"],
        },
      },
    ],
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  return {
    props: {
      type: slug[0] ?? 1,
      name: slug[1] ?? "",
    },
  };
}

const ProfileList = ({ type, name }) => {
  const [selectItem, setSelectItem] = useState("all");
  const [saleOpen, setSaleOpen] = useState(false);

  console.log("type:", type);
  console.log("name:", name);

  const handleSelectChange = useCallback((e) => {
    setSelectItem(e.target.value);
  }, []);

  const commonColumnsProps = {
    sortable: false,
    filterable: false,
    hideable: false,
    disableColumnMenu: true,
    headerAlign: "center",
    flex: 1,
    align: "center",
  };

  const friendColumns = [
    {
      field: "domain",
      headerName: "Domain",
      width: 90,
      ...commonColumnsProps,
    },
    {
      field: "relation",
      headerName: "Relation",
      width: 150,
      ...commonColumnsProps,
    },
    {
      field: "action",
      headerName: "Action",
      type: "number",
      width: 110,
      ...commonColumnsProps,
      renderCell: (params) => {
        const { row } = params;

        return (
          <>
            {row.relation === "owner" ? (
              <Button
                variant="outlined"
                onClick={() => {
                  setSaleOpen(true);
                }}
              >
                Sale
              </Button>
            ) : (
              "-"
            )}
          </>
        );
      },
    },
  ];

  const groupColumns = [
    {
      field: "id",
      headerName: "Group ID",
      width: 90,
      ...commonColumnsProps,
    },
    {
      field: "groupName",
      headerName: "Group Name",
      width: 150,
      ...commonColumnsProps,
    },
    {
      field: "relation",
      headerName: "Relation",
      width: 150,
      ...commonColumnsProps,
    },
    {
      field: "action",
      headerName: "Action",
      type: "number",
      width: 110,
      ...commonColumnsProps,
      renderCell: (params) => {
        const { row } = params;

        return (
          <>
            {row.relation === "owner" ? (
              <Button
                variant="outlined"
                onClick={() => {
                  setSaleOpen(true);
                }}
              >
                Sale
              </Button>
            ) : (
              "-"
            )}
          </>
        );
      },
    },
  ];

  const rows = [
    {
      id: 1,
      domain: "liujuncheng.key",
      groupName: "Snow",
      relation: "owner",
      price: 35,
    },
    {
      id: 2,
      domain: "dsdsds.key",
      groupName: "Lannister",
      relation: "member",
      price: 42,
    },
    {
      id: 3,
      domain: "liujuncheng.key",
      groupName: "Lannister",
      relation: "owner",
      price: 45,
    },
    {
      id: 4,
      domain: "dsdsds.key",
      groupName: "Stark",
      relation: "member",
      price: 16,
    },
    {
      id: 5,
      domain: "liujuncheng.key",
      groupName: "Targaryen",
      relation: "owner",
      price: null,
    },
    {
      id: 6,
      domain: "dsdsds.key",
      groupName: "Melisandre",
      relation: "member",
      price: 150,
    },
    {
      id: 7,
      domain: "liujuncheng.key",
      groupName: "Clifford",
      relation: "owner",
      price: 44,
    },
    {
      id: 8,
      domain: "dsdsds.key",
      groupName: "Frances",
      relation: "member",
      price: 36,
    },
    {
      id: 9,
      domain: "liujuncheng.key",
      groupName: "Roxie",
      relation: "owner",
      price: 65,
    },
  ];

  return (
    <Stack spacing={3}>
      <TitleWrapper>
        <TypographyWrapper>
          {type === "0" ? "Friends List" : "Groups List"}
        </TypographyWrapper>
      </TitleWrapper>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <SelectWrapper value={selectItem} onChange={handleSelectChange}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="followers">Followers</MenuItem>
          <MenuItem value="following">Following</MenuItem>
        </SelectWrapper>
        <Box sx={{ height: "72vh", width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={type === "0" ? friendColumns : groupColumns}
            pageSize={20}
            disableSelectionOnClick={true}
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      </Paper>

      <SaleDialog
        open={saleOpen}
        title="Sale"
        contractAdd="0x5435e8bb74d7ba8f4a76287dc0e75e203d87647e"
        onClose={() => {
          setSaleOpen(false);
        }}
      />
    </Stack>
  );
};

export default memo(ProfileList);
