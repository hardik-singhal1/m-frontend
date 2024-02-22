import { Alert, Stack } from "@material-ui/core";
import { ErrorProvider } from "../lib/errorContext";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import React, { useCallback, useState } from "react";
import Snackbar from "@mui/material/Snackbar";

const ERROR_TYPES = {
    ERROR: "error"
};

export default function SnackbarComponent(props) {
    const [
        errorConfig,
        setErrorConfig
    ] = useState({
        errorMessage: "",
        errorTrigger: (severity, errorMessage) => {
            console.log("ere")
            let newErrorConfig = {...errorConfig};
            newErrorConfig.showError = true;
            newErrorConfig.severity = severity;
            newErrorConfig.errorMessage = errorMessage;

            setErrorConfig(newErrorConfig);
        },
        severity: ERROR_TYPES.ERROR,
        showError: false
    });

    const action = (
        <IconButton
            aria-label="close"
            color="error"
            size="small"
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    );

    return (
        <ErrorProvider value={errorConfig}>
            {props.children}
            <Stack>
                <Snackbar
                    style={{zIndex: 10000}}
                    action={action}
                    autoHideDuration={5000}
                    onClose={useCallback(() => {
                        const newErrorConfig = { ...errorConfig };

                        newErrorConfig.showError = false;
                        setErrorConfig(newErrorConfig);
                    }, [])}
                    open={errorConfig.showError}
                >
                    <Alert severity={errorConfig.severity} variant="filled">
                        {errorConfig.errorMessage}
                    </Alert>
                </Snackbar>
            </Stack>
        </ErrorProvider>
    );
}
