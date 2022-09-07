import { Box } from "@mui/material";
import { memo, useEffect } from "react";

const MessageList = ({ messages }) => {
  console.log("message:", messages);
  return (
    <Box>
      {messages.map((item, index) => (
        <span key={index}>{item.content}</span>
      ))}
    </Box>
  );
};

export default memo(MessageList);
