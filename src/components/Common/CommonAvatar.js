import Blockies from "react-blockies";
import { Avatar, styled, Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fromAddressGetName, fromNameGetInfo } from "../../utils/web3";

const BlockiesWrapper = styled(Blockies)(({ sx }) => ({
  width: "40px !important",
  height: "40px !important",
  ...sx,
}));

const CommonAvatar = ({ name, account, avatarUrl, sx }) => {
  const [avatarState, setAvatarState] = useState(avatarUrl);

  const getAvatar = useCallback(async (name) => {
    const resp = await fromNameGetInfo(name);

    if (resp && resp.avatar) {
      setAvatarState(resp.avatar);
    }
  }, []);

  const getAccountAvatar = useCallback(
    async (account) => {
      const resp = await fromAddressGetName(account);
      if (resp) {
        getAvatar(resp);
      }
    },
    [getAvatar]
  );

  useEffect(() => {
    setAvatarState("");
    if (!avatarUrl && name) {
      getAvatar(name);
    }
    if (!avatarUrl && account) {
      getAccountAvatar(account);
    }
  }, [avatarUrl, getAvatar, name, account, getAccountAvatar]);

  return (
    <Box>
      {avatarState ? (
        <Avatar src={avatarState} alt={avatarState} sx={{ ...sx }} />
      ) : (
        <BlockiesWrapper seed={account} sx={sx} />
      )}
    </Box>
  );
};

export default CommonAvatar;
