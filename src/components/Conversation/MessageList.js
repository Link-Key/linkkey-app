import { Box, Stack, styled, Typography } from "@mui/material";
import { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import CommonAvatar from "../Common/CommonAvatar";

const MessageListWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",

  height: "100%",
  overflow: "auto",
}));

const MessageItem = styled(Stack)(() => ({
  padding: "10px 0",
}));

const NameAndTime = styled(Stack)(() => ({
  ".MuiTypography-title": {
    fontSize: "15px",
    fontWeight: 600,
  },
}));

const MessageList = ({ messages, recipientName, recipientAdd }) => {
  const { account } = useSelector((state) => ({
    account: state.walletInfo.account,
  }));

  console.log("message:", messages);
  return (
    <MessageListWrapper>
      {messages.map((item, index) => (
        <MessageItem
          direction="row"
          alignItems="center"
          spacing={2}
          key={index}
        >
          <CommonAvatar account={recipientAdd} />
          <Stack p={0}>
            <NameAndTime p={0}>
              <Typography variant="title">{recipientName}</Typography>
            </NameAndTime>
            <Typography>{item.content}</Typography>
          </Stack>
        </MessageItem>
      ))}
    </MessageListWrapper>
  );
};

export default memo(MessageList);
