import { AuthContext } from "../lib/authContext";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Loading from "../components/Loading";
import React, { useContext } from "react";

export default function Home() {
    const { isLoggedIn } = useContext(AuthContext);

    if (isLoggedIn) {
        return (
            <div>
                <Container component="main" maxWidth="xl">
                    <CssBaseline />
                </Container >
            </div>
        );
    }

    return <Loading />;
}
