import { Box } from "@mui/material";
import { memo } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import CopySvg from "../../assets/icons/common/copy.svg";

const CopyText = ({ text, children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {children}
      <CopyToClipboard text={text}>
        <CopySvg
          style={{
            marginLeft: "5px",
            color: "#ea6060",
            cursor: "pointer",
            ":hover": {
              color: "#FB6D05",
            },
          }}
        />
      </CopyToClipboard>
    </Box>
  );
};

export default memo(CopyText);
