import { Box, CssBaseline, Grid, styled } from "@mui/material";
import CommonApproveDialog from "./CommonApproveDialog";
import SideBar from "./SideBar";

const Main = styled("main")`
  width: calc(100% - 280px);
  min-height: calc(100vh - 20px);
  padding: 20px;
  margin: 20px 0 0 260px;
  background: #ff928d;
  border-radius: 12px 12px 0 0;
`;

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
      }}
    >
      <CssBaseline />
      <Grid container>
        <Grid
          item
          sx={{
            position: "fixed",
          }}
        >
          <SideBar />
        </Grid>
        <Grid item xs>
          <Main>{children}</Main>
        </Grid>
      </Grid>

      <CommonApproveDialog />
    </Box>
  );
};

export default Layout;
