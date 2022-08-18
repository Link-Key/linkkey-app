import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const lightTheme = responsiveFontSizes(
  createTheme({
    typography: {
      allVariants: {
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: 400,
      },
    },
    palette: {
      mode: "light",
      primary: {
        main: "#ea6060",
        contrastText: "#fff",
      },
      secondary: {
        main: "#fff",
        contrastText: "#000",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
          },
          containedPrimary: {},
        },
      },
    },
  })
);

export { lightTheme };
