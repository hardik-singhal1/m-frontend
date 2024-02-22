import { ErrorContext } from "../../lib/errorContext";
import { isString } from "lodash";
import { kratos } from "../../lib/kratos";
import { useRouter } from "next/router";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import React, { useContext, useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";

export default function Error() {
    const router = useRouter();
    const { id } = router.query;
    const [
        errorMessage,
        setErrorMessage
    ] = useState("");
    const { errorTrigger } = useContext(ErrorContext);

    useEffect(() => {
        if (!id || !isString(id)) {
            setErrorMessage("Unknown Error");
        } else {
            kratos.getSelfServiceError(id)
                .then(({ status, data }) => {
                    if (status !== 200) {
                        return Promise.reject(data);
                    }

                    setErrorMessage(data);

                    return data;
                })
                .catch((err) => {
                    errorTrigger("error", JSON.stringify(err.message));
                });
        }
    }, []);

    return (
        <div>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Typography>
                    {
                        JSON.stringify(errorMessage)
                    }
                </Typography>
            </Container>
        </div>
    );
}

export async function getServerSideProps(context) {
    return {
        props: { cookie: typeof context.req.headers.cookie === "undefined"
            ? null
            : context.req.headers.cookie }
        //  Will be passed to the page component as props
    };
}
