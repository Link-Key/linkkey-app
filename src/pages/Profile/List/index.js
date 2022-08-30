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

const ProfileList = () => {
  const [selectItem, setSelectItem] = useState("all");

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

  const columns = [
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
        console.log("row:", row);

        return (
          <>
            {row.relation === "owner" ? (
              <Button
                variant="outlined"
                onClick={() => {
                  setBuyOpen(true);
                }}
              >
                Sale
              </Button>
            ) : (
              <Button variant="outlined" disabled>
                on offer
              </Button>
            )}
          </>
        );
      },
    },
  ];

  const rows = [
    { id: 1, groupName: "Snow", relation: "owner", price: 35 },
    { id: 2, groupName: "Lannister", relation: "member", price: 42 },
    { id: 3, groupName: "Lannister", relation: "owner", price: 45 },
    { id: 4, groupName: "Stark", relation: "member", price: 16 },
    { id: 5, groupName: "Targaryen", relation: "owner", price: null },
    { id: 6, groupName: "Melisandre", relation: "member", price: 150 },
    { id: 7, groupName: "Clifford", relation: "owner", price: 44 },
    { id: 8, groupName: "Frances", relation: "member", price: 36 },
    { id: 9, groupName: "Roxie", relation: "owner", price: 65 },
  ];

  return (
    <Stack spacing={3}>
      <TitleWrapper>
        <TypographyWrapper>List</TypographyWrapper>
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
            columns={columns}
            pageSize={20}
            disableSelectionOnClick={true}
            // rowsPerPageOptions={[5]}
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      </Paper>
    </Stack>
  );
};

export default memo(ProfileList);
