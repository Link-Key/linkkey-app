import {
  Box,
  Typography,
  CardMedia,
  LinearProgress,
  Paper,
  InputBase,
  Button,
} from "@mui/material";
import { memo, useRef, useState, useCallback } from "react";
import PlusSvg from "../../assets/icons/common/plus.svg";

const AvatarInput = ({
  showRequired,
  label,
  description,
  onSuccess,
  onError,
  avatar,
}) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  console.log("avatar:", avatar);

  const onFileChange = useCallback(
    async (event) => {
      const file = event.target.files[0];

      if (file) {
        // upload file
        const size = file.size;
        if (size / (1024 * 1024) > 2) {
          ToastMention({
            message: t("setting.avatarSize"),
            type: "error",
          });
          return;
        }
        setUploading(true);
        const type = file.type;
        const URL = window.URL || window.webkitURL;
        const imgURL = URL.createObjectURL(file);

        console.log("imgURL:", imgURL);

        // const res = await uploadToIpfs(file, type, false);
        const res = "";

        onSuccess("", inputRef, imgURL);
        // if (res && res.Hash) {
        //   onSuccess(res.Hash, inputRef, imgURL);
        // } else {
        //   onError(inputRef);
        // }
        setUploading(false);
      }
      setUploading(false);
    },
    [onError, onSuccess]
  );

  return (
    <Box>
      {showRequired && (
        <Typography
          style={{
            color: "#FB6D05",
            fontWeight: 400,
            fontSize: "12px",
          }}
        >
          {t("setting.require")}
        </Typography>
      )}
      {
        <Typography
          style={{
            fontWeight: 600,
            fontSize: "16px",
            marginTop: "20px",
          }}
        >
          {label + (showRequired ? "*" : "")}{" "}
        </Typography>
      }
      {description && (
        <Typography
          style={{
            fontWeight: 600,
            fontSize: "16px",
            marginTop: "8px",
            opacity: 0.5,
          }}
        >
          {description}{" "}
        </Typography>
      )}
      <input
        accept="image/png, image/jpeg"
        name="avatar"
        id="icon-button-file"
        type="file"
        ref={inputRef}
        style={{ display: "none", width: "136px", height: "136px" }}
        onChange={onFileChange}
      />
      <label htmlFor="icon-button-file">
        {!avatar && !uploading ? (
          <Box
            sx={{
              p: "2px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 136,
              height: 136,
              borderRadius: 50,
              boxSizing: "border-box",
              marginTop: "20px",
              border: "1px solid #9a9a9a",
              cursor: "pointer",
              svg: {
                color: "#9a9a9a",
              },
            }}
          >
            <PlusSvg width={"20px"} color="#9a9a9a" />
          </Box>
        ) : (
          <></>
        )}
        {avatar && !uploading ? (
          <CardMedia
            component="img"
            alt="avatar"
            image={avatar}
            sx={{
              width: 136,
              height: 136,
              borderRadius: 50,
              boxSizing: "border-box",
              marginTop: "20px",
              cursor: "pointer",
            }}
          />
        ) : (
          <Box
            sx={{
              display: uploading ? "flex" : "none",
              alignItems: "center",
              width: 136,
              height: 136,
              borderRadius: 50,
              boxSizing: "border-box",
              marginTop: "20px",
              cursor: "pointer",
            }}
          >
            <LinearProgress sx={{ width: "100%", borderRadius: "10px" }} />
          </Box>
        )}
      </label>
    </Box>
  );
};

const AreaInput = ({
  showRequired,
  label,
  description,
  value = "",
  setValue,
  placeholder,
  maxWords,
  onChange,
}) => {
  const [maxReached, setMaxReached] = useState(false);
  const handleChange = (event) => {
    if (maxWords && event.target.value.length >= maxWords) {
      console.log("already exceed the max value");
      setMaxReached(true);
      setValue(event.target.value.slice(0, maxWords));
      return;
    }
    if (!event.target.value) {
      setValue("");
    }
    if (maxReached) {
      setMaxReached(false);
    }
    if (onChange) {
      onChange(event.target.value);
    }
  };
  return (
    <Box>
      {showRequired && (
        <Typography
          style={{
            color: "#FB6D05",
            fontWeight: 400,
            fontSize: "12px",
          }}
        >
          {t("setting.require")}
        </Typography>
      )}

      <Typography
        style={{
          fontWeight: 600,
          fontSize: "16px",
          marginTop: "20px",
        }}
      >
        {label + (showRequired ? "*" : "")}{" "}
      </Typography>

      {description && (
        <Typography
          style={{
            fontWeight: 600,
            fontSize: "16px",
            marginTop: "8px",
            opacity: 0.5,
          }}
        >
          {description}{" "}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: 800,
          height: 50,
          borderRadius: "12px",
          boxSizing: "border-box",
          marginTop: "20px",
          border: "1px solid #9a9a9a",
          padding: "3px 10px",
        }}
      >
        <InputBase
          sx={{
            // ml: 2,
            flex: 1,
            border: "none",
            fontWeight: 500,
            caretColor: "#ea6060",
          }}
          placeholder={placeholder}
          maxLength={300}
          value={value}
          multiline
          onChange={handleChange}
        />
        {maxWords && (
          <Typography
            style={{
              color: maxReached ? "#ea6060" : "#9a9a9a",
              opacity: maxReached ? 1 : 0.6,
              marginRight: "12px",
            }}
          >
            {value.length + "/" + maxWords}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const LinkInput = ({
  showRequired,
  label,
  description,
  value = "",
  iconUrl = "",
  disabled = false,
  setValue,
  placeholder,
  maxWords,
  onChange,
}) => {
  const [maxReached, setMaxReached] = useState(false);
  const handleChange = (event) => {
    if (maxWords && value.length >= maxWords) {
      console.log("already exceed the max value");
      setMaxReached(true);
      if (event.target.value.length < value.length) {
        setValue(event.target.value);
      }
      return;
    }
    if (maxReached) {
      setMaxReached(false);
    }
    setValue(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <Box>
      {
        <Typography
          style={{
            fontWeight: 600,
            fontSize: "16px",
            marginTop: "20px",
          }}
        >
          {label + (showRequired ? "*" : "")}{" "}
        </Typography>
      }

      {description && (
        <Typography
          style={{
            fontWeight: 600,
            fontSize: "16px",
            marginTop: "8px",
            opacity: 0.5,
          }}
        >
          {description}{" "}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: 800,
          height: 50,
          border: "1px solid #9a9a9a",
          borderRadius: "12px",
          boxSizing: "border-box",
          marginTop: "20px",
          padding: "3px 10px",
          svg: {
            marginRight: "5px",
          },
        }}
      >
        {iconUrl}
        <InputBase
          sx={{
            flex: 1,
            border: "none",
            caretColor: "#ea6060",
            fontWeight: 500,
          }}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={handleChange}
        />
        {maxWords && (
          <Typography
            style={{
              color: maxReached ? "#ea6060" : "#9a9a9a",
              opacity: maxReached ? 1 : 0.6,
            }}
          >
            {value.length + "/" + maxWords}
          </Typography>
        )}
        <Button>To verify</Button>
      </Box>
    </Box>
  );
};

export { AvatarInput, AreaInput, LinkInput };
