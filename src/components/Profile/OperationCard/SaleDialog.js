import {
  Typography,
  InputBase,
  Box,
  styled,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import CommonDialog from "../../CommonDialog";
import EllipsisAddress from "../../EllipsisAddress";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

const Wrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "0 20px",
  ".MuiTypography-root": {
    fontSize: "15px",
    fontWeight: 500,
  },
  ".MuiTypography-subtitle1": {
    color: "#777",
  },
}));

const Items = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "5px",
}));

const TypographyBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  ".MuiButton-root": {
    height: "35px",
    fontSize: "14px",
    svg: {
      marginRight: "5px",
    },
  },
  ".MuiInputBase-root": {
    fontSize: "15px",
    fontWeight: 500,
  },
}));

const SelectWrapper = styled(Select)(() => ({
  border: "1px solid #ddd",
  borderRadius: "12px",
  ".MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  ".MuiSelect-select": {
    padding: "0px",
    borderRadius: "12px",
    color: "#9a9a9a",
    padding: "4px 10px",
  },
}));

const SaleDialog = ({ open, title, contractAdd, onClose, onSuccess }) => {
  const [saleInp, setSaleInp] = useState("");
  const [selectItem, setSelectItem] = useState("key");

  const handleChangeSaleInp = useCallback((e) => {
    const value = e.target.value;
    console.log("value:", typeof value);
    if (/^[0-9]*$/.test(value) && !value.startsWith("0")) {
      setSaleInp(value);
    }
  }, []);

  const handleSelectChange = useCallback((e) => {
    setSelectItem(e.target.value);
  }, []);

  return (
    <CommonDialog open={open} title={title} onClose={onClose}>
      <Wrapper>
        <Items>
          <Typography>Contract Address: </Typography>
          <EllipsisAddress account={contractAdd} />
        </Items>
        <TypographyBox aria-label="Transfer" sx={{ gap: "5px" }}>
          <Typography>Sale price: </Typography>
          <InputBase
            value={saleInp || ""}
            placeholder="Min 1"
            onChange={handleChangeSaleInp}
          />
          <SelectWrapper value={selectItem} onChange={handleSelectChange}>
            <MenuItem value="key">KEY</MenuItem>
          </SelectWrapper>
        </TypographyBox>

        <Typography variant="subtitle1">- Service fee: 2.5%</Typography>
        <Typography variant="subtitle1">- Royalties: 10%</Typography>
        <Typography variant="subtitle1">You will receive: - </Typography>
        <Button
          variant="contained"
          sx={{
            margin: "5px auto",
          }}
        >
          Submit
        </Button>
      </Wrapper>
    </CommonDialog>
  );
};

export default memo(SaleDialog);
