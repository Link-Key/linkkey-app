import "../../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@mui/material";
import Layout from "../components/Layout";
import { lightTheme } from "../config/theme";
import { Provider } from "react-redux";
import store from "../store";
import { useEffect, useState } from "react";
import { WalletProvider } from "../providers/wallet";

import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    setIsWin(true);
  }, []);

  if (isWin) {
    return (
      <Provider store={store}>
        <WalletProvider>
          <ThemeProvider theme={lightTheme}>
            <ToastContainer />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </WalletProvider>
      </Provider>
    );
  } else {
    return <></>;
  }
}

export default MyApp;
