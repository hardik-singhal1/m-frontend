import { createTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createTheme({
    typography: {
        fontFamily:`"Public Sans",sans-serif`,
        //     [
        //     "Public Sans",
        //     "sans-serif"
        // ].join(",")
    },
    palette: {
        background: {
            default: "#fff",
            light: "#f2f2f2"
        },
        delete: {
            main: "#ff0000"
        },
        error: {
            main: "#b70f0a"
        },
        primary: {
            contrastText: "#fff",
            dark: "#0C53B7",
            darker: "#04297A",
            light: "#74CAFF",
            lighter: "#D0F2FF",
            main: "#1890FF"
        },
        secondary: {
            contrastText: "#fff",
            dark: "#007B55",
            darker: "#005249",
            light: "#5BE584",
            lighter: "#C8FACD",
            main: "#00AB55"
        }
    }
});

export default theme;
