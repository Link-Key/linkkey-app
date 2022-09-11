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
import { getResolverInfo, setResolverInfo } from "../../contracts/Resolver";
import { useEffect } from "react";
import CommonLoadingBtn from "../../components/Button/LoadingButton";

const Setting = () => {
  const { snsName } = useSelector((state) => ({
    snsName: state.walletInfo.snsName,
  }));

  const [btnLoading, setBtnLoading] = useState(false);

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
  const [preViewAvatar, setPreViewAvatar] = useState(
    "https://ik.imagekit.io/lensterimg/tr:n-avatar,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/QmRuat6TeJGaossgVKjGgCofhQVeGWg7DMDkj6Re3jCQbR"
  );
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

  const handleSetting = useCallback(async () => {
    setBtnLoading(true);
    console.log(snsName, preViewAvatar, bio);
    try {
      const resp = await setResolverInfo(snsName, preViewAvatar, bio);
      console.log("setResolverInfo:", resp);
    } catch (error) {
      console.log("handleSettingErr:", error);
    }
    setBtnLoading(false);
  }, [snsName, , preViewAvatar, bio]);

  const getSettingInfo = useCallback(async () => {
    try {
      const resp = await getResolverInfo(snsName);
      if (resp && resp.ipfsUrl && resp.description) {
        console.log("getResolverInfo:", resp);
        setPreViewAvatar(resp.description);
        setBio(resp.description);
      }
    } catch (error) {
      console.log("getSettingInfoErr:", error);
    }
  }, [snsName]);

  const initialSettingValue = useCallback(async () => {
    await getSettingInfo();
  }, [getSettingInfo]);

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

          <CommonLoadingBtn
            loading={btnLoading}
            variant="contained"
            sx={{ margin: "20px 0", maxWidth: "200px", alignSelf: "center" }}
            onClick={handleSetting}
          >
            Setting Profile
          </CommonLoadingBtn>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default memo(Setting);
