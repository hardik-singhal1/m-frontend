import { Box } from "@material-ui/system";
import { Container } from "@material-ui/core";
import { ErrorContext } from "../../lib/errorContext";
import { isString } from "lodash";
import { kratos } from "../../lib/kratos";
import { productname } from "../../next.config";
import { useRouter } from "next/router";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import OryForm from "../../components/OryForm";
import PropTypes from "prop-types";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";

function Copyright() {
    return (
        <Typography
            align="center"
            color="textSecondary"
            variant="body2"
        >
            {"Copyright © "}
            <Link color="inherit" href="https://bootlabs.in/">
                BootLabs
            </Link>{" "}
            {new Date().getFullYear()}
            .
        </Typography>
    );
}

export default function SignIn({ cookie }) {
    const [
        flowState,
        setFlowState
    ] = useState();
    const router = useRouter();
    const { flow } = router.query;
    const { errorTrigger } = useContext(ErrorContext);

    const onClick = useCallback(() => router.push("/login"), [router]);

    useEffect(() => {
        if (!flow || !isString(flow)) {
            window.location = `${process.env.NEXT_PUBLIC_KRATOS_PUBLIC_API}self-service/registration/browser`;
        } else {
            kratos.getSelfServiceRegistrationFlow(flow, null, { withCredentials: true })
                .then(({ status, data }) => {
                    if (status !== 200) {
                        throw new Error(data);
                    }

                    setFlowState(data);
                })
                .catch((err) => {
                    errorTrigger("error", JSON.stringify(err.message));
                });
        }
    },[flowState]);

    return (
        <div>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Grid>
                    <br />
                    <div
                        align="right"
                    >
                        Already have an account? &nbsp;
                        <Link
                            component="button"
                            onClick={onClick}
                            underline="none"
                            variant="subtitle2"
                        >
                            Get started
                        </Link>
                    </div>
                    <br />
                    <Grid>
                        <Typography gutterBottom variant="h4">
                            Get started with {productname}
                        </Typography>
                    </Grid>
                    <OryForm cookie={cookie} flow={flowState} />
                </Grid>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        </div>
    );
}

SignIn.propTypes = {
    cookie: PropTypes.string.isRequired
};

export async function getServerSideProps(context) {
    // Context.req.headers.cookie will be passed to the page component as props
    return {
        props: { cookie: typeof context.req.headers.cookie === "undefined"
            ? null
            : context.req.headers.cookie }
    };
}
