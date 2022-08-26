import { Stack, Paper, Typography, styled, Box, Button } from "@mui/material";
import { memo, useCallback, useState } from "react";
import {
  AreaInput,
  AvatarInput,
  LinkInput,
} from "../../components/Input/StyledInput";
import TwitterIcon from "../../assets/icons/common/twitter.svg";

const TypographyWrapper = styled(Typography)(() => ({
  fontSize: "32px",
  fontFamily: "Inter-Medium",
  color: "#ea6060",
  textAlign: "center",
}));

const Setting = () => {
  // avatar image upload
  // const [avatar, setAvatar] = useState("");
  const [preViewAvatar, setPreViewAvatar] = useState("");
  const handleUploadAvatarSuccess = (cid, inputRef, img) => {
    setPreViewAvatar(img);
    if (cid) {
      // setAvatar(cid);
      setPreViewAvatar(img);
    }
    inputRef.current.value = "";
  };

  const handleUploadAvatarError = useCallback((inputRef) => {
    console.log("upload avatar failed");
    inputRef.current.value = "";
  }, []);

  // user bio
  const [bio, setBio] = useState("");

  const handleBioChange = useCallback((value) => {
    if (value) {
      setBio(value);
    }
  }, []);

  // user twitter
  const [link, setLink] = useState("");

  const handleLinkChange = useCallback((value) => {
    setLink(value);
  }, []);

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // justifyContent: "space-between",
        height: "95vh",
        // gap: "40px",
      }}
    >
      <TypographyWrapper variant="h1">Profile Setting</TypographyWrapper>

      <Stack
        direction="column"
        justifyContent="center"
        // alignItems="center"
        maxWidth="800px"
        spacing={4}
      >
        <AvatarInput
          showRequired={false}
          label="Profile image"
          description="Max size: 2MB"
          onError={handleUploadAvatarError}
          onSuccess={handleUploadAvatarSuccess}
          avatar={preViewAvatar}
        />

        <AreaInput
          showRequired={false}
          label="Bio"
          placeholder="Please input your bio"
          maxWords={300}
          value={bio}
          setValue={setBio}
          onChange={handleBioChange}
        />

        <LinkInput
          showRequired={false}
          label="Link"
          description="Your twitter"
          placeholder="Your twitter"
          iconUrl={<TwitterIcon width="20" height="20" color="#ea6060" />}
          value={link}
          setValue={setLink}
          onChange={handleLinkChange}
        />
      </Stack>
      <Button variant="contained" sx={{ margin: "20px 0" }}>
        Setting Profile
      </Button>
    </Paper>
  );
};

export default memo(Setting);
