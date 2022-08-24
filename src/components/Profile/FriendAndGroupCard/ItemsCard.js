import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  styled,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import { memo, useCallback, useState } from "react";

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
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "20%",
  rowGap: "20px",
  button: {
    marginTop: "10px",
  },
}));

const ItemsCard = ({ type }) => {
  const isFriend = type === "friend" ? true : false;
  const [selectItem, setSelectItem] = useState("all");

  const handleSelectChange = useCallback((e) => {
    setSelectItem(e.target.value);
  }, []);

  return (
    <Card>
      <TitleWrapper>
        <Typography variant="title">
          {isFriend ? "Friends" : "Groups"}
        </Typography>
        <SelectWrapper value={selectItem} onChange={handleSelectChange}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="followers">Followers</MenuItem>
          <MenuItem value="following">Following</MenuItem>
        </SelectWrapper>
      </TitleWrapper>
      <CardContentWrapper>
        {[0, 1, 2, 3, 4, 5].map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "40%",
            }}
          >
            <Avatar />
            <Typography>Vitalik.key</Typography>
          </Box>
        ))}
        <Button variant="outlined">Show more</Button>
      </CardContentWrapper>
    </Card>
  );
};

export default memo(ItemsCard);
