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
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useWalletInfo } from "../../providers/wallet";

const ConversationHeader = styled(Stack)(() => ({
  borderBottom: "1px solid #ddd",
  borderRadius: "0px",

  ".MuiTypography-title": {
    fontSize: "15px",
    fontWeight: 600,
  },
}));

const Conversation = ({ name, recipientAdd }) => {
  const [sendInp, setSendInp] = useState("");
  const [chatList, setChatList] = useState([]);
  const [conversations, setConversations] = useState(null);

  // const { account } = useSelector((state) => ({
  //   account: state.walletInfo.account,
  // }));

  const handleChangeSendInp = useCallback((e) => {
    setSendInp(e.target.value);
  }, []);

  const { client } = useWalletInfo();

  const startClient = useCallback(async () => {
    if (client && recipientAdd) {
      const newConversation = await client.conversations.newConversation(
        recipientAdd
      );
      setConversations(newConversation);
      const m = await newConversation.messages();
      setChatList([...m]);
    }
  }, [client, recipientAdd]);

  const listenChatList = useCallback(async () => {
    console.log("here listen", conversations);
    if (!conversations) return;
    const stream = await conversations.streamMessages();
    for await (const message of stream) {
      console.log(message, "in the message");
      setChatList((v) => [...v, { ...message }]);
      continue;
      // }
    }
  }, [conversations]);

  const sendMessages = useCallback(
    (msg) => {
      console.log("msg:", msg);
      if (msg && conversations) {
        console.log(msg, "send msg", conversations, conversations.send);
        conversations.send(msg);
      }
    },
    [conversations]
  );

  useEffect(() => {
    if (conversations) {
      listenChatList();
    }
  }, [conversations, listenChatList]);

  useEffect(() => {
    startClient();
  }, [startClient]);

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
          <EllipsisAddress account={recipientAdd} />
        </Box>
      </ConversationHeader>

      <MessageList messages={chatList} />

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
              onClick={sendMessages.bind(this, sendInp)}
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
