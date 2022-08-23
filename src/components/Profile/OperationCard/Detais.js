import {
  Paper,
  Typography,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  styled,
  Box,
  DialogContent,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const BaseDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: 40,
    width: "560px",
    padding: "16px 20px",
    "& .MuiDialogTitle-root": {
      fontSize: "24px",
      fontWeight: 700,
      display: "flex",
      justifyContent: "center",
      paddingTop: "0",
    },
    "& .MuiButton-root": {
      textTransform: "none",
      fontWeight: 700,
      fontSize: 16,
    },
    ".MuiDialogContent-root": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      div: {
        ".MuiTypography-root": {
          fontWeight: 500,
          margin: "10px 0",
        },
      },
    },
  },
}));

const Details = ({ title, btnText, open, openFn, closeFn, introduceList }) => {
  console.log("introduceList:", introduceList);

  return (
    <Paper>
      <Typography variant="subtitle1">{title}</Typography>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        height="100%"
        spacing={1}
      >
        <Button variant="outlined">{btnText}</Button>
        <InfoOutlinedIcon
          onClick={() => {
            openFn();
          }}
        />
      </Stack>

      <BaseDialog open={open}>
        <DialogTitle>Release Introduce</DialogTitle>
        <DialogContent>
          <Box>
            {introduceList &&
              introduceList.map((item, index) => (
                <Typography key={index}>{item}</Typography>
              ))}
          </Box>
          <Button
            variant="contained"
            sx={{
              margin: "0 auto",
            }}
            onClick={() => {
              closeFn();
            }}
          >
            OK
          </Button>
        </DialogContent>
      </BaseDialog>
    </Paper>
  );
};

export default Details;
