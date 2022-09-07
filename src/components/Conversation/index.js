import {
  Avatar,
  Box,
  IconButton,
  InputBase,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { memo, useState } from "react";
import EllipsisAddress from "../EllipsisAddress";
import SendIcon from "@mui/icons-material/Send";
import MessageList from "./MessageList";
import { useCallback } from "react";

const ConversationHeader = styled(Stack)(() => ({
  borderBottom: "1px solid #ddd",
  borderRadius: "0px",

  ".MuiTypography-title": {
    fontSize: "15px",
    fontWeight: 600,
  },
}));

const messages = [
  {
    content: "111",
    recipientAddress: "0xB3eF1C9718F3EAFaeb6fd7Ac63E8f43493101Ded",
    senderAddress: "0x5435e8Bb74D7Ba8F4a76287Dc0E75e203D87647e",
    sent: new Date(),
  },
];

const Conversation = ({ name, account }) => {
  const [sendInp, setSendInp] = useState("");

  const [messageList, setMessageList] = useState(messages);

  const handleChangeSendInp = useCallback((e) => {
    setSendInp(e.target.value);
  }, []);

  const handleSend = useCallback(() => {
    const list = messages.push({ content: sendInp });
  }, [sendInp]);

  return (
    <Stack
      direction="column"
      p={0}
      height="100%"
      justifyContent="space-between"
    >
      <ConversationHeader direction="row" spacing={2} pt={0} pl={0}>
        <Avatar />
        <Box>
          <Typography variant="title">{name}</Typography>
          <EllipsisAddress account={account} />
        </Box>
      </ConversationHeader>

      <MessageList messages={messageList} />

      <Box
        sx={{
          width: "100%",
        }}
      >
        <InputBase
          sx={{
            width: "100%",
            pr: 0,
          }}
          endAdornment={
            <IconButton
              sx={{ borderRadius: "12px" }}
              disabled={sendInp.length === 0}
              onClick={handleSend}
            >
              <SendIcon />
            </IconButton>
          }
          onChange={handleChangeSendInp}
        />
      </Box>
    </Stack>
  );
};

export default memo(Conversation);
