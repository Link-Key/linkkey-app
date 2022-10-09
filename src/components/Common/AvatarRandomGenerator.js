import { Box } from "@mui/material";
import { AvatarGenerator } from 'random-avatar-generator';
import { useSelector } from "react-redux";

const AvatarRandomGenerator = () => {
  const { account } = useSelector(
    (state) => ({
      account: state.walletInfo.account,
    })
  );

  const generator = new AvatarGenerator();
  let avatar = generator.generateRandomAvatar(account);

  return (
    <Box>
      <img src={avatar} alt="" style={{width: "120px"}} />
    </Box>
  );
};

export default AvatarRandomGenerator;
