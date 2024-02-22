import {createTheme} from '@material-ui/core/styles';
import {red} from '@material-ui/core/colors';

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: '#0663aa',
            inherit: "#f2f2f2"
        },
        secondary: {
            main: '#ecf6fe',
            dark: 'rgba(6, 99, 170, 0.17)'
        },
        error: {
            main: '#b70f0a',
        },
        background: {
            default: '#fff',
            light: "#f2f2f2"
        },
    },
});

export default theme;
