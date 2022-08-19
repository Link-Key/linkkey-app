import { ThemeProvider } from "@mui/material";
import { Web3ReactProvider } from "@web3-react/core";
import "../../styles/globals.css";
import {
  getLibrary,
  useActivatingConnector,
  useEagerConnect,
  useInactiveListener,
} from "../clients";
import Layout from "../components/Layout";
import { lightTheme } from "../config/theme";

function MyApp({ Component, pageProps }) {
  const activatingConnector = useActivatingConnector();
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || activatingConnector);
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={lightTheme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
