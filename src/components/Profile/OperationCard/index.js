import { Button, Paper, Stack, styled, Typography, Card } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Details from "./Detais";
import { useCallback, useState } from "react";

const OperationCardWrapper = styled(Card)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  borderRadius: "12px",
  // height: "500px",
  padding: "16px 20px",

  ".MuiTypography-title": {
    fontWeight: 500,
    fontSize: "25px",
    color: "#9a9a9a",
  },
}));

const OperationAlert = styled(Paper)(() => ({
  maxWidth: "500px",
  height: "70px",
  padding: "16px 20px",
  borderRadius: "12px",
  textAlign: "center",
  background: "#ea6060",
  color: "#fff",
  fontWeight: 500,
  margin: "0 auto",
}));

const ReleaseIntroduce = {
  friend: ["1.twitter verification", "2.friend-nft", "3.friend-nft", "4.when"],

  group: ["1.twitter verification", "2.group-nft", "3.group-nft", "4.when"],
};

const OperationCard = () => {
  const [infoVisible, setInfoVisible] = useState(false);

  const openInfoDialog = useCallback(() => {
    setInfoVisible(true);
  }, []);

  const closeInfoDialog = useCallback(() => {
    setInfoVisible(false);
  }, []);

  return (
    <OperationCardWrapper>
      <Typography variant="title">Operation</Typography>
      <OperationAlert>
        You are not currently release Friend-NFT or Group-NFT, click the button
        below to release your NFT!
      </OperationAlert>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          "& .MuiPaper-root": {
            width: "100%",
            minHeight: "300px",
            padding: "16px 20px",
            borderRadius: "12px",
          },
          ".MuiTypography-subtitle1": {
            fontSize: "20px",
            fontWeight: 500,
          },
          svg: {
            color: "#ea6060",
            cursor: "pointer",
          },
        }}
      >
        <Details
          title="Friend-NFT details"
          btnText="Release Friend-NFT"
          open={infoVisible}
          openFn={openInfoDialog}
          closeFn={closeInfoDialog}
          introduceList={ReleaseIntroduce.friend}
        />
        <Details
          title="Friend-NFT details"
          btnText="Release Friend-NFT"
          open={infoVisible}
          openFn={openInfoDialog}
          closeFn={closeInfoDialog}
          introduceList={ReleaseIntroduce.group}
        />
      </Stack>
    </OperationCardWrapper>
  );
};

export default OperationCard;
