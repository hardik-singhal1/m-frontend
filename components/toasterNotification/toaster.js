import "react-toastify/dist/ReactToastify.css";
import { SnackbarContext } from "../../lib/toaster/SnackbarContext";
import { ToastContainer, toast } from "react-toastify";
import React, {useCallback, useContext, useMemo, useState} from "react";

export default function SimpleSnackbar() {
    const { snackbar, setSnackbar } = useContext(SnackbarContext);

    const { message, type, id } = snackbar;

    function toastCall() {
        if(id){
            switch (type){
                case "loading" :
                    toast.loading(message, {
                        onOpen: () => {
                            setSnackbar("", "");
                        },
                        toastId: id,
                        // autoClose:1000,
                        position: toast.POSITION.BOTTOM_LEFT });
                    break
                default :
                    toast.update(id, { onOpen: () => {
                            setSnackbar("", "");
                        },
                        render: message, type: type, isLoading: false, autoClose:3000  });
                    break
            }
        }else{
            switch (type){
                case "success" :
                    toast.success(message, { onOpen: () => {
                            setSnackbar("", "");
                        },
                        position: toast.POSITION.BOTTOM_LEFT });
                    break
                case "warning" :
                    toast.warning(message, { onOpen: () => {
                            setSnackbar("", "");
                        },
                        position: toast.POSITION.BOTTOM_LEFT });
                    break
                case "info" :
                    toast.info(message, { onOpen: () => {
                            setSnackbar("", "");
                        },
                        position: toast.POSITION.BOTTOM_LEFT });
                    break
                default :
                    toast.error(message, { onOpen: () => {
                            setSnackbar("", "");
                        },
                        position: toast.POSITION.BOTTOM_LEFT });
                    break
            }
        }
    }


    return (
        <div>
            {
                Boolean(message) && toastCall()
            }
            <ToastContainer autoClose={3000} theme={"light"} />
        </div>
    );
}
