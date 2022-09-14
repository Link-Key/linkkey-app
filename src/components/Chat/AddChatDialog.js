import { InputBase, Stack, Button } from "@mui/material";
import { useCallback } from "react";
import { memo, useState } from "react";
import CommonDialog from "../CommonDialog";

const AddChatDialog = ({ open, type, onClose }) => {
  const [inputState, setInputState] = useState("");

  const isFriend = type === 0 ? true : false;

  const handleInpChange = useCallback((e) => {
    setInputState(e.target.value);
  }, []);

  return (
    <CommonDialog
      open={open}
      title={isFriend ? "Add Friend" : "Join Group"}
      onClose={onClose}
    >
      <Stack direction="column" spacing={2}>
        <InputBase
          value={inputState}
          placeholder={
            isFriend ? "Input xxx.key" : "Input groupID or groupName"
          }
          onChange={handleInpChange}
        />

        <Button variant="outlined">
          {isFriend ? "Mint Follow-NFT" : "Mint Group-NFT"}
        </Button>
        <Button variant="outlined">
          {isFriend ? "Buy Follow-NFT" : "Buy Group-NFT"}
        </Button>
      </Stack>
    </CommonDialog>
  );
};

export default memo(AddChatDialog);
