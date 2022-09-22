import { IconButton, Stack, styled } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import TwitterImg from "../../../assets/images/profile/twitter.png";
import PolygonImg from "../../../assets/images/profile/polygon.png";
import OpenseaImg from "../../../assets/images/profile/opensea.png";
import MirrorImg from "../../../assets/images/profile/mirror.png";

const CustomImage = styled(Image)(() => ({
  cursor: "pointer",
}));

const ProfileLink = ({ address }) => {
  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      gap="10px"
      p={0}
      sx={{ img: { width: "25px !important" } }}
    >
      <a href={`https://www.twitter.com`} target="_blank" rel="noreferrer">
        <CustomImage src={TwitterImg} alt="twitter" />
      </a>

      <a
        href={`https://polygonscan.com/address/${address}`}
        target="_blank"
        rel="noreferrer"
      >
        <CustomImage src={PolygonImg} alt="polygon" />
      </a>

      <a
        href={`https://opensea.io/${address}`}
        target="_blank"
        rel="noreferrer"
      >
        <CustomImage src={OpenseaImg} alt="opensea" />
      </a>

      <a
        href={`https://mirror.xyz/${address}`}
        target="_blank"
        rel="noreferrer"
      >
        <CustomImage src={MirrorImg} alt="mirror" />
      </a>
    </Stack>
  );
};

export default memo(ProfileLink);
