import { Stack, Paper, Typography, styled, Box, Button } from "@mui/material";
import { memo, useCallback, useState } from "react";
import {
  AreaInput,
  AvatarInput,
  LinkInput,
} from "../../components/Input/StyledInput";
import TwitterIcon from "../../assets/icons/common/twitter.svg";
import { TypographyWrapper } from "../../components/Styled";
import PageTitleWrapper from "../../components/PageTitleWrapper/PageTitleWrapper";
import { useSelector } from "react-redux";
import { getDescription, getIpfsUrl } from "../../contracts/Resolver";
import { useEffect } from "react";

const Setting = () => {
  const { snsName } = useSelector((state) => ({
    snsName: state.walletInfo.snsName,
  }));

  // user bio
  const [bio, setBio] = useState("");
  // user twitter
  const [link, setLink] = useState("");

  const handleBioChange = useCallback((value) => {
    if (value) {
      setBio(value);
    }
  }, []);

  const handleLinkChange = useCallback((value) => {
    setLink(value);
  }, []);

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

  const handleSetting = useCallback(() => {
    const reqParmas = {};
  }, []);

  const getBio = useCallback(async () => {
    try {
      const resp = await getDescription(snsName);
      console.log("getDescription:", resp);
    } catch (error) {
      console.log("getDescriptionErr:", error);
    }
  }, [snsName]);

  const getAvatar = useCallback(async () => {
    try {
      const resp = await getIpfsUrl(snsName);
      console.log("getIpfsUrl:", resp);
    } catch (error) {
      console.log("getAvatarErr:", error);
    }
  }, [snsName]);

  const initialSettingValue = useCallback(async () => {
    await getBio();
    await getAvatar();
  }, [getBio, getAvatar]);

  useEffect(() => {
    initialSettingValue();
  }, [initialSettingValue]);

  return (
    <Stack spacing={3}>
      <PageTitleWrapper title="Setting" />
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // height: "95vh",
        }}
      >
        <Stack direction="column" justifyContent="center" spacing={4}>
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

          <Button
            variant="contained"
            sx={{ margin: "20px 0", maxWidth: "200px", alignSelf: "center" }}
          >
            Setting Profile
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default memo(Setting);
