import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "next/link";
import React, { useCallback } from "react";
import Typography from "@mui/material/Typography";
import propTypes from "prop-types";
import router from "next/router";

export default function ErrorPage({ data }) {

    const onClickroutechange = useCallback(() => {
        router.push("/");
    });

    return (
        <Card
            sx={{
                backgroundColor: "black",
                float: "center"

            }}
        >
            <CardContent>
                <br />
                <br />
                <br />
                <Typography
                    align="center"
                    fontFamily="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
                    sx={{ color: "lightslategray" }}
                    variant="h5"
                >
                    Oops ! You entered in to the Black Hole
                    <br />
                    Watchout
                </Typography>
                <Typography
                    align="center"
                    fontFamily="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
                    sx={{ color: "red",
fontSize: "100px" }}
                >
                    <strong> {data}</strong>
                </Typography>
                <Typography
                    align="center"
                    fontFamily="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
                    sx={{ color: "slategray" }}
                    variant="h6"
                >
                    Page not found!
                    <br /><br /><br />
                    <Link href="/">
                        <Button onClick={onClickroutechange} variant="contained">
                            Go back to Home
                        </Button>
                    </Link>
                </Typography>
                <br />
            </CardContent>
            <br />
        </Card>
    );
}

ErrorPage.propTypes = {
    data: propTypes.string.isRequired
};
