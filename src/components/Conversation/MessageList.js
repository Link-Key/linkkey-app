import { Box, styled } from "@mui/material";
import { memo, useEffect } from "react";

const MessageListWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const MessageList = ({ messages }) => {
  console.log("message:", messages);
  return (
    <MessageListWrapper>
      {messages.map((item, index) => (
        <span key={index}>{item.content}</span>
      ))}
    </MessageListWrapper>
  );
};

export default memo(MessageList);
