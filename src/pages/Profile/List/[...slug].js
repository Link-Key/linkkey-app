import {
  Stack,
  Paper,
  Button,
  Select,
  MenuItem,
  styled,
  Box,
  LinearProgress,
  Pagination,
} from "@mui/material";
import { memo, useState, useCallback, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TypographyWrapper } from "../../../components/Styled";
import SaleDialog from "../../../components/Profile/OperationCard/SaleDialog";
import { getResolverOwner } from "../../../contracts/SNS";
import { queryFriends } from "../../../api";
import TableNoData from "../../../assets/icons/common/tableNoRows.svg";

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
  const [saleOpen, setSaleOpen] = useState(false);
  const [listType, setListType] = useState("empty");
  const [profileAdd, setProfileAdd] = useState("");

  const [pageState, setPageState] = useState(1);
  const [pageTotal, setPageTotal] = useState(0);
  const [friendRows, setFriendRows] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const pageSize = 30;

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

  const handleChangeListType = useCallback(
    (e) => {
      if (listType !== e.target.value) {
        setPageState(1);
        setListType(e.target.value);
      }
    },
    [listType]
  );

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
      field: "address",
      headerName: "Account",
      ...commonColumnsProps,
    },
    {
      field: "name",
      headerName: "Domain",
      width: 90,
      ...commonColumnsProps,
    },
    {
      field: "type",
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
            {row.type === "following" ? (
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

  const queryFriendsFn = useCallback(
    async ({ page }) => {
      setListLoading(true);
      const reqParams = {
        type: listType,
        address: profileAdd,
        pageNum: page,
        pageSize,
      };
      const resp = await queryFriends(reqParams);
      console.log("resp:", resp);
      if (resp && resp.code === 200 && resp.data && resp.data.list) {
        setPageTotal(resp.data.pages);
        setFriendRows(resp.data.list);
      }

      setListLoading(false);
    },
    [listType, profileAdd]
  );

  useEffect(() => {
    getResolverOwner(name).then((address) => {
      setProfileAdd(address);
    });
  }, [name, listType]);

  useEffect(() => {
    setListLoading(true);
    if (profileAdd) {
      queryFriendsFn({ page: 1 });
    }
    setListLoading(false);
  }, [profileAdd, queryFriendsFn]);

  console.log("friendRows:", friendRows);
  console.log("listLoading:", listLoading);

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
        <SelectWrapper value={listType} onChange={handleChangeListType}>
          <MenuItem value="empty">All</MenuItem>
          <MenuItem value="follower">Followers</MenuItem>
          <MenuItem value="following">Following</MenuItem>
        </SelectWrapper>
        <Box sx={{ height: "72vh", width: "100%" }}>
          <DataGrid
            rows={friendRows}
            getRowId={(row) => row.address}
            columns={type === "0" ? friendColumns : groupColumns}
            loading={listLoading}
            components={{
              LoadingOverlay: LinearProgress,
              NoRowsOverlay: TableNoRowComp,
            }}
            pagination={false}
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
          sx={{ margin: "20px auto 0" }}
          onChange={(e, page) => {
            setPageState(page);
            queryFriendsFn({ page });
          }}
        />
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
