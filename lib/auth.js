import { AuthProvider } from "./authContext";
import { kratos } from "./kratos";
import { useEffect, useState } from "react";
import Router from "next/router";

export default function Auth(props) {
    const [
        session,
        setSession
    ] = useState({
        error: null,
        isLoggedIn: false,
        logoutUrl: null,
        userData: null
    });

    useEffect(() => {
        let newSession = {};

        kratos.toSession(undefined, undefined, { withCredentials: true })
            .then(({ status, data }) => {
                if (status !== 200) {
                    return Promise.reject(data);
                }

                newSession = {
                    error: null,
                    isLoggedIn: data.active && Boolean(data.id),
                    userData: data
                };
                setSession(newSession);
                kratos.createSelfServiceLogoutFlowUrlForBrowsers(undefined, { withCredentials: true })
                    .then(({ status, data }) => {
                        setSession((session) => ({ ...session,
                            logoutUrl: data.logout_url }));
                    });
            })
            .catch((err) => {
                newSession = {
                    error: err,
                    isLoggedIn: false,
                    userData: null
                };
                Router.push("/login");
                setSession(newSession);
            });

    }, []);

    const authProviderValue = {
        ...session
    };

    return (
        <AuthProvider value={authProviderValue}>
            {props.children}
        </AuthProvider>
    );
}
