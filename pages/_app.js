import "../components/project/editor.css";
import "../styles/globals.css";
import { ThemeProvider } from "@material-ui/styles";
import Auth from "../lib/auth";
import CssBaseline from "@material-ui/core/CssBaseline";
import ErrorPage from "../components/ErrorPage";
import Head from "next/head";
import Layout from "../components/layout/Layout";
import Loading from "../components/Loading";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import SnackbarComponent from "../components/SnackbarComponent";
import theme from "../theme";
import {productname} from "../next.config";
import Snackbar from "../components/toasterNotification/toaster";
import { SnackbarContainer } from "../lib/toaster/SnackbarContext";

function MyApp({ Component, pageProps, router }) {
    React.useEffect(() => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    const [
        loading,
        setLoading
    ] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const [mainRef, setMainRef] = useState(null);

    return loading
        ? <Loading />
        : <SnackbarContainer>
            <Head>
                <title>{productname}</title>
                <link href="/titleIcon.png" rel="shortcut icon"/>
                <meta
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                    name="viewport"
                />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SnackbarComponent>
                    {
                        router.pathname === "/login" ||
                        router.pathname === "/registration" ||
                        router.pathname === "/error"
                            ? <Component {...pageProps} />
                            : <Auth>
                                <Layout
                                    mainRef={e => setMainRef(e)}
                                    data={
                                        router.route === "/"
                                            ? "default"
                                            : router.query.organization_name
                                    }
                                >
                                    {router.pathname === "/_error"
                                        ? <ErrorPage data={404} />
                                        : <Component {...pageProps} mainRef={mainRef} />}
                                </Layout>
                            </Auth>
                    }
                </SnackbarComponent>
            </ThemeProvider>
            <Snackbar />
        </SnackbarContainer>;
}

MyApp.propTypes = {
    Component: PropTypes.func.isRequired,
    pageProps: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
};

export default MyApp;
