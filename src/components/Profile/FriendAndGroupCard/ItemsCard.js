import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { queryFriends } from "../../../api";
import { getResolverOwner } from "../../../contracts/SNS";
import TableNoData from "../../../assets/icons/common/tableNoRows.svg";
import CommonAvatar from "../../Common/CommonAvatar";

const TitleWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px",

  ".MuiTypography-title": {
    fontSize: "24px",
    fontWeight: 500,
    color: "#9a9a9a",
  },
}));

const SelectWrapper = styled(Select)(() => ({
  border: "1px solid #9a9a9a",
  borderRadius: "12px",
  ".MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  ".MuiSelect-select": {
    padding: "0px",
    borderRadius: "12px",
  },
}));

const CardContentWrapper = styled(CardContent)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "30px",
  pt: 0,
  button: {
    // width: "200px",
    // marginTop: "30px",
  },
}));

const ItemsCard = ({ type }) => {
  const isFriend = type === "friend" ? true : false;
  const [selectItem, setSelectItem] = useState("empty");
  const [profileAdd, setProfileAdd] = useState("");
  const [friendList, setFriendList] = useState([]);

  const { snsName } = useSelector((state) => ({
    snsName: state.walletInfo.snsName,
  }));

  const router = useRouter();

  const handleSelectChange = useCallback((e) => {
    setSelectItem(e.target.value);
  }, []);

  const queryFriendsFn = useCallback(async () => {
    const reqParams = {
      type: selectItem,
      address: profileAdd,
      pageNum: 1,
      pageSize: 6,
    };
    const resp = await queryFriends(reqParams);
    console.log("resp:", resp);
    if (resp && resp.code === 200 && resp.data && resp.data.list) {
      setFriendList(resp.data.list);
    }
  }, [selectItem, profileAdd]);

  useEffect(() => {
    if (profileAdd) {
      queryFriendsFn();
    }
  }, [profileAdd, queryFriendsFn]);

  useEffect(() => {
    const profileName = router && router.query && router.query.name[0];
    if (profileName) {
      getResolverOwner(profileName).then((address) => {
        setProfileAdd(address);
      });
    }
  }, [router]);

  return (
    <Card>
      <TitleWrapper>
        <Typography variant="title">
          {isFriend ? "Friends" : "Groups"}
        </Typography>
        <SelectWrapper value={selectItem} onChange={handleSelectChange}>
          <MenuItem value="empty">All</MenuItem>
          <MenuItem value="followers">Followers</MenuItem>
          <MenuItem value="following">Following</MenuItem>
        </SelectWrapper>
      </TitleWrapper>
      {friendList.length !== 0 ? (
        <CardContentWrapper>
          <Box
            sx={{
              display: "grid",
              justifyContent: "center",
              gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))",
              gridGap: "20px 20px",
              width: "100%",
            }}
          >
            {friendList.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "40%",
                }}
              >
                {item && item.ipfsUrl ? (
                  <CommonAvatar avatarUrl={item.ipfsUrl} />
                ) : (
                  <CommonAvatar account={item.address} />
                )}
                <Typography>{item && item.name ? item.name : "-"}</Typography>
              </Box>
            ))}
          </Box>
          <Button
            variant="outlined"
            onClick={() => {
              router.push(`/Profile/List/${isFriend ? 0 : 1}/${snsName}`);
            }}
          >
            Show more
          </Button>
        </CardContentWrapper>
      ) : (
        <Stack justifyContent="center" alignItems="center">
          <TableNoData />
          {/*<Typography variant="title" sx={{ fontWeight: 600 }}>*/}
          {/*  No Data*/}
          {/*</Typography>*/}
        </Stack>
      )}
    </Card>
  );
};

export default memo(ItemsCard);
