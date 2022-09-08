import Blockies from "react-blockies";
import { Avatar, styled } from "@mui/material";

const BlockiesWrapper = styled(Blockies)(() => ({
  borderRadius: "50px",
}));

const CommonAvatar = ({ account, avatarUrl }) => {
  if (avatarUrl) {
    return (
      <div>
        <div className="w-10 h-10 rounded-full border border-n-80" />
        <Avatar src={avatarUrl} alt={peerAddress} />
      </div>
    );
  }
  return <BlockiesWrapper seed={account} size={10} />;
};

export default CommonAvatar;
