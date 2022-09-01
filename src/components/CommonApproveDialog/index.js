import {
  Button,
  Dialog,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
  Box,
} from "@mui/material";
import { memo, useCallback } from "react";
import { useDialog } from "../../providers/ApproveDialog";
import Check from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";

const BaseDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: 40,
    width: "300px",
    "& .MuiDialogTitle-root": {
      display: "flex",
      justifyContent: "center",
      paddingTop: "20px",
      fontSize: "24px",
      fontWeight: 700,
      color: "#ea6060",
      ".MuiTypography-root": {
        fontSize: "24px",
        fontWeight: 700,
        color: "#ea6060",
      },
    },
  },
}));

const StepLabelWrapper = styled(StepLabel)(() => ({
  display: "flex",
  alignItems: "center",

  ".MuiStepLabel-root": {
    fontSize: "20px",
  },
}));

const StepIconWrapper = styled(Box)(() => ({
  marginLeft: "2px",
  svg: {
    color: "#ea6060",
  },
}));

const StepIconFn = (props) => {
  const { active, completed } = props;

  return (
    <StepIconWrapper ownerState={{ active }}>
      {active ? (
        <CircularProgress size={18} />
      ) : completed ? (
        <Check />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            marginLeft: "7px",
            background: "#ea6060",
            borderRadius: "50px",
          }}
        />
      )}
    </StepIconWrapper>
  );
};

const CommonApproveDialog = () => {
  const { state, dialogDispatch } = useDialog();

  const handleCancelBtn = useCallback(() => {
    dialogDispatch({ type: "SET_VISIBLE", payload: false });
    dialogDispatch({ type: "SET_STEP", payload: 0 });
  }, [dialogDispatch]);

  return (
    <BaseDialog open={state.open}>
      <DialogTitle>
        <Typography>Transaction...</Typography>
      </DialogTitle>
      <Stepper
        activeStep={state.step}
        orientation="vertical"
        sx={{ padding: "20px" }}
      >
        <Step>
          <StepLabelWrapper StepIconComponent={StepIconFn}>
            Approve
          </StepLabelWrapper>
        </Step>

        <Step>
          <StepLabelWrapper StepIconComponent={StepIconFn}>
            Payment
          </StepLabelWrapper>
        </Step>
      </Stepper>
      <Button variant="contained" onClick={handleCancelBtn}>
        Cancel
      </Button>
    </BaseDialog>
  );
};

export default memo(CommonApproveDialog);