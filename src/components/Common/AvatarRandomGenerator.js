import { Box } from "@mui/material";
import { AvatarGenerator } from 'random-avatar-generator';



const AvatarRandomGenerator = () => {

  const generator = new AvatarGenerator();

  let randomAvatar = generator.generateRandomAvatar();

  return (
    <Box>
      <img src={randomAvatar} alt="" style={{width: "120px"}} />
    </Box>
  );
};

export default AvatarRandomGenerator;
