import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";

const CommonLoadingBtn = (props) => {
  const { children, loading } = props;
  return (
    <LoadingButton
      loadingPosition="start"
      startIcon={<Box sx={{ width: `${loading ? "20px" : "0px"}` }} />}
      {...props}
    >
      {children}
    </LoadingButton>
  );
};

export default CommonLoadingBtn;
