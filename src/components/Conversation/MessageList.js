import { Box, Stack, styled, Typography } from "@mui/material";
import { useCallback } from "react";
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

const MessageList = ({ messages, recipientName }) => {
  const { account, snsName } = useSelector((state) => ({
    account: state.walletInfo.account,
    snsName: state.walletInfo.snsName,
  }));

  console.log("recipientName:", recipientName);
  console.log("snsName:", snsName);

  const handleDisplayName = useCallback(
    (address) => {
      if (address.toLowerCase() === account.toLowerCase()) {
        return snsName;
      }
      return recipientName;
    },
    [account, snsName]
  );

  return (
    <MessageListWrapper>
      {messages.map((item, index) => (
        <MessageItem
          direction="row"
          alignItems="center"
          spacing={2}
          key={index}
        >
          <CommonAvatar account={item.senderAddress} />
          <Stack p={0}>
            <NameAndTime p={0}>
              {item.senderAddress === account}
              <Typography variant="title">
                {handleDisplayName(item.senderAddress)}
              </Typography>
            </NameAndTime>
            <Typography>{item.content}</Typography>
          </Stack>
        </MessageItem>
      ))}
    </MessageListWrapper>
  );
};

export default memo(MessageList);
