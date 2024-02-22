import { Alert } from "@material-ui/lab";
import { Grid, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Loading from "./Loading";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {productname} from "../next.config";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor: theme.palette.secondary.main,
        margin: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(3, 0, 0)
    },
    buttonoidc: {
        display: "flex",
        justifyContent: "center",
        margin: theme.spacing(3, 0, 0),
        width: "30%"
    },
    form: {
        marginTop: theme.spacing(1),
        width: "100%"
    },
    paper: {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        marginTop: theme.spacing(8)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

export default function OryForm({ flow }) {
    const [
        flowState,
        setFlowState
    ] = useState(null);
    const classes = useStyles();
    const [
        inputs,
        setInputs
    ] = useState({});

    useEffect(() => {
        let currentInputs = { ...inputs };

        if (flow !== undefined) {
            flow.ui.nodes
                .filter((flowNode) => flowNode.attributes.type === "hidden" ||
                    flowNode.attributes.type === "text" ||
                    flowNode.attributes.type === "password")
                .forEach((flowNode) => {
                    const obj = {};

                    obj[flowNode.attributes.name] = flowNode.attributes.value;
                    currentInputs = { ...obj,
                        ...currentInputs };
                });
        }

        setInputs(currentInputs);
        setFlowState(flow);
    }, [
        flow
    ]);

    if (!flowState) {
        return <Loading />;
    }

    function attribute(attributes) {
        if (attributes.type !== "hidden") {

            const provider = attributes.value;
            let src = "";
            switch (provider) {
            case "google":
                src = "google.png";
                break;
            case "azuread":
                src = "microsoft.png"
                break;
            default:
                return <div />;
            }




            return (
                <img
                height="30"
                src={src}
                width="30"
                    />);
        }

    }

    return (
        <form
            action={flowState.ui.action}
            className={classes.form}
            method="POST"
            noValidate
        >
            {
                flowState.ui.messages?.map((message) => (
                    <Alert severity="error" variant="outlined">
                        {message.text}
                    </Alert>
                    ))
            }
            {
                flowState.ui.nodes
                    .filter((flowNode) => flowNode.type === "input")
                    .filter((flowNode) => flowNode.attributes.type === "hidden")
                    .map((flowNode) => (
                        <input
                            id={flowNode.attributes.name}
                            key="hidden"
                            {...flowNode.attributes}
                        />
                        ))
            }
            {
                flowState.ui.nodes
                    .filter((flowNode) => flowNode.group === "oidc")
                    .map((flowNode) => {
                        const { attributes } = flowNode;

                        if(productname==="mpaas") {
                            return (
                                <Button classes={classes.buttonoidc}
                                        key={flowNode.meta.label.id}
                                        variant="outlined"
                                        size={"large"}
                                        {...attributes} style={{backgroundColor:"navy"}}>
                                    <span style={{color:"white",fontWeight:"bold"}}>Mahindra SSO</span>
                                </Button>
                            )
                        }
                        else{
                            return (
                                <Button
                                    classes={classes.buttonoidc}
                                    key={flowNode.meta.label.id}
                                    variant="outlined"
                                    {...attributes}
                                    style={{width : 100, marginRight: 20}}
                                >
                                    {
                                        attribute(attributes)
                                    }
                                </Button>

                            );
                        }
                    })
            }
            {
                flowState.ui.nodes
                    .filter((flowNode) => flowNode.group === "oidc")
                    .filter((flowNode) => flowNode.attributes.type !== "hidden")
                    .length > 0
                    // ? <div>
                    //     <br />
                    //     <Grid>
                    //         <Divider>OR</Divider>
                    //     </Grid>
                    // </div>
                    // : <div />
            }
            {/*<div>*/}
            {/*    <br />*/}
            {/*    {*/}
            {/*            flowState.ui.nodes*/}
            {/*                .filter((flowNode) => flowNode.type === "input")*/}
            {/*                .filter((flowNode) => flowNode.attributes.type !== "hidden")*/}
            {/*                .filter((flowNode) => flowNode.attributes.type !== "submit")*/}
            {/*                .filter((flowNode) => flowNode.attributes.type !== "checkbox")*/}
            {/*                .map((flowNode) => {*/}
            {/*                    const { value, ...attributes } = flowNode.attributes;*/}

            {/*                    return (*/}
            {/*                        <TextField*/}
            {/*                            fullWidth*/}
            {/*                            key={flowNode.meta.label.id}*/}
            {/*                            label={attributes.type === "hidden"*/}
            {/*                                ? ""*/}
            {/*                                : flowNode.meta.label.text}*/}
            {/*                            margin="normal"*/}
            {/*                            variant="outlined"*/}
            {/*                            {...attributes}*/}
            {/*                            id={attributes.name}*/}
            {/*                        />*/}
            {/*                    );*/}
            {/*                })*/}
            {/*        }*/}
            {/*</div>*/}
{/*            {*/}
{/*                flowState.ui.nodes*/}
{/*                    .filter((flowNode) => flowNode.attributes.type === "submit")*/}
{/*                    .filter((flowNode) => flowNode.group !== "oidc")*/}
{/*                    .map((flowNode) => {*/}
{/*                        const { attributes } = flowNode;*/}

{/*                        return (*/}
{/*                            <Button*/}
{/*                                classes={classes.button}*/}
{/*                                fullWidth*/}
{/*                                key={flowNode.meta.label.id}*/}
{/*                                variant="contained"*/}
{/*                                {...attributes}*/}
{/*                            >*/}
{/*                                {attributes.type === "hidden"*/}
{/*? ""*/}
{/*: flowNode.meta.label.text }*/}
{/*                            </Button>*/}
{/*                        );*/}
{/*                    })*/}
{/*            }*/}
        </form>
    );
}

// Will be passed to the page component as props
export async function getServerSideProps(context) {
    return {
        props: { cookie: typeof context.req.headers.cookie === "undefined"
            ? null
            : context.req.headers.cookie }
    };
}

OryForm.propTypes = {
    flow: PropTypes.object
};
