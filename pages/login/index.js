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
import Loading from "../../components/Loading";
import OryForm from "../../components/OryForm";
import PropTypes from "prop-types";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Logo from "../../components/layout/Logo";

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
    const onClick = useCallback(() => {
        router.push("/registration");
    });

    const [
        loading,
        setLoading
    ] = useState(true);
    const { errorTrigger } = useContext(ErrorContext);

    useEffect(() => {
        if (!flow || !isString(flow)) {
            window.location.replace(`${process.env.NEXT_PUBLIC_KRATOS_PUBLIC_API}self-service/login/browser`);
        } else {
            kratos.getSelfServiceLoginFlow(flow, undefined, { withCredentials: true })
                .then(({ status, data: flow }) => {
                    if (status !== 200) {
                        return Promise.reject(flow);
                    }

                    setFlowState(flow);

                    return status;
                })
                .catch((err) => {
                    errorTrigger("error", JSON.stringify(err.message));
                });
        }
    }, []);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        loading
            ? <Loading />
            :
            <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap",width:"100%",height:"100vh"}}>
                <div style={{backgroundColor:"antiquewhite",width:"30%",height:"100%",paddingTop:"10rem",alignItems:"center",display:"flex",flexDirection:"column"}}>
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",height:"100%"}}>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",height:"100%"}}>
                            <Typography variant={"h5"} style={{fontWeight:"bold",color:"black"}}>Login to</Typography>
                            <Logo sx={{height:"5rem"}}/>
                            <div>
                                <OryForm cookie={cookie} flow={flowState} />
                            </div>

                            {/*<div style={{paddingTop:"2rem"}}>*/}
                            {/*    <Typography variant={"h6"}>Don’t have an account?</Typography>*/}
                            {/*    <Link*/}
                            {/*        component="button"*/}
                            {/*        onClick={onClick}*/}
                            {/*        underline="none"*/}
                            {/*        variant="subtitle2"*/}
                            {/*    >*/}
                            {/*        Get started*/}
                            {/*    </Link>*/}
                            {/*</div>*/}
                            {
                                productname === "mpaas" &&
                                <div style={{color:"black",display:"flex",flexDirection:"column",alignItems:"center",marginTop:"3rem",gap:"1rem"}}>
                                    <Typography variant={"h5"} fontWeight={"bold"}>ONE STOP SOLUTION</Typography>
                                    <Typography variant={"h6"} fontWeight={"bold"}>FOR ALL YOUR</Typography>
                                    <Typography variant={"h7"} fontWeight={"bold"}>CLOUD NEEDS</Typography>
                                </div>
                            }
                        </div>
                        <div style={{paddingBottom:"2rem"}}>
                            <Copyright />
                        </div>
                    </div>
                </div>
                <div style={{width:"70%"}}>
                    {
                        productname === "mpaas" &&
                        <Box
                            component="img"
                            src= {"/mpaasHome.png"}
                            sx={{
                                height: "100%",
                                width: "100%",
                            }}
                        />
                    }
                </div>
            </div>
            // : <div>
            //     <Container component="main" maxWidth="xs">
            //         <CssBaseline />
            //         <Grid
            //             item
            //             md={12}
            //             sm={12}
            //             xs={12}
            //         >
            //             <br />
            //             <div
            //                 align="right"
            //             >
            //                 Don’t have an account? &nbsp;
            //                 <Link
            //                     component="button"
            //                     onClick={onClick}
            //                     underline="none"
            //                     variant="subtitle2"
            //                 >
            //                     Get started
            //                 </Link>
            //             </div>
            //             <br />
            //             <Grid>
            //                 <Typography gutterBottom variant="h4">
            //                     Sign in to {productname}
            //                 </Typography>
            //                 Enter your details below.
            //             </Grid>
            //             <OryForm cookie={cookie} flow={flowState} />
            //         </Grid>
            //         <Box mt={8}>
            //             <Copyright />
            //         </Box>
            //     </Container>
            // </div>
    );
}

SignIn.propTypes = {
    cookie: PropTypes.any.isRequired
};

export async function getServerSideProps(context) {
    return {
        props: { cookie: typeof context.req.headers.cookie === "undefined"
            ? null
            : context.req.headers.cookie }
        //  Will be passed to the page component as props
    };
}
