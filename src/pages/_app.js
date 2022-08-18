import { ThemeProvider } from "@mui/material";
import "../../styles/globals.css";
import Layout from "../components/Layout";
import { lightTheme } from "../config/theme";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
