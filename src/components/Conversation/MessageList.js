import { Box, Chip, Stack, styled, Typography } from "@mui/material";
import { useCallback } from "react";
import { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatTime } from "../../utils";
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

const ChipWrapper = styled(Chip)(() => ({
  padding: "0 2px",
  height: "20px",
}));

const MessageList = ({ messages, recipientName }) => {
  const { account, snsName } = useSelector((state) => ({
    account: state.walletInfo.account,
    snsName: state.walletInfo.snsName,
  }));

  const handleDisplayName = useCallback(
    (address) => {
      if (address.toLowerCase() === account.toLowerCase()) {
        return (
          <ChipWrapper
            label={snsName}
            sx={{ background: "#ea606033", color: "#ea6060" }}
            variant="primary"
          />
        );
      }
      return <ChipWrapper label={recipientName} variant="primary" />;
    },
    [account, snsName, recipientName]
  );

  return (
    <MessageListWrapper>
      {messages.map((item, index) => (
        <MessageItem
          direction="row"
          alignItems="center"
          spacing={1}
          key={index}
        >
          <CommonAvatar account={item.senderAddress} />
          <Stack p={0}>
            <NameAndTime direction="row" alignItems="center" spacing={1} p={0}>
              {item &&
                item.senderAddress &&
                handleDisplayName(item.senderAddress)}
              <Typography>{formatTime(item.sent)}</Typography>
            </NameAndTime>
            <Typography>{item.content}</Typography>
          </Stack>
        </MessageItem>
      ))}
    </MessageListWrapper>
  );
};

export default memo(MessageList);
