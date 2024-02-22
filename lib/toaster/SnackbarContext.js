import { createContext, useMemo, useState } from "react";

export const SnackbarContext = createContext();

export function SnackbarContainer({ children }) {
    const [
        snackbar,
        setSnackbar
    ] = useState({
        message: "",
        type: "success",
        id:""
    });

    const handleSnackbarSet = (message, type, id) => {
        setSnackbar({
            message,
            type,
            id
        });
    };

    const contextValue = useMemo(() => ({
        setSnackbar: handleSnackbarSet,
        snackbar
    }), [snackbar]);

    return (
        <SnackbarContext.Provider value={contextValue}>
            {children}
        </SnackbarContext.Provider>
    );
}
