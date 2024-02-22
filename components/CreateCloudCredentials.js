import React, {useEffect, useState, useContext} from "react";
import {
    Autocomplete,
    Button,
    Divider,
    FormControl,
    Grid,
    Switch,
    Typography,
} from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { useCallback } from "react";
import {hostport} from "../next.config";
import {createDetails, updateDetails} from "../utils/fetch-util";
import router from "next/router";
import {ErrorContext} from "../lib/errorContext";


export default function CreateCloudCredentials({ value, close }) {
    const [values, setValues] = React.useState({
        title: "google",
    });
    const {errorTrigger} = useContext(ErrorContext)
    const [googlecred,setGooglecred] = useState("")
    const [projectid,setProjectid] = useState("")
    const [accessid,setAccessid] = useState("")
    const [accesskey,setAccesskey] = useState("")
    const [region,setRegion] = useState("")
    const [subscriptionid,setSubscriptionid] = useState("")
    const [clientid,setClientid] = useState("")
    const [secretid,setSecretid] =useState("")
    const [tenant,setTenant] =useState("")
    const [theme,setTheme] = useState("white")
    const time =new Date().toLocaleString()
    const [credName,setCredName] =useState("")
    const defaultProps = {
        options: value,
        getOptionLabel: (option) =>
            option.title !== undefined ? option.title : "",
    };

    const organizationName = router.query.organization_name;

    const [credentials,setCredentials] = useState({
        id : '',
        name:credName,
        time:time,
        project_id :projectid,
        credential_file : googlecred,
        aws_access_key_id : accessid,
        aws_secret_access_key : accesskey,
        region : region,
        cloud:values === null? "" : values.title,
        subscription_id:subscriptionid,
        client_id:clientid,
        secret_id:secretid,
        tenant_id:tenant
    })



    useEffect(() => {
        if(values) {
            if(values.title === 'google') {
                const newValue = {
                    ...credentials,
                    id: `organizations/${organizationName}/credential/${values.title}/${credName}`,
                    name:credName,
                    time:time,
                    project_id: projectid,
                    credential_file: googlecred,
                    cloud: values.title,
                }
                setCredentials(newValue)
            }
            else if(values.title === 'aws'){
                const newValue = {
                    ...credentials,
                    id : `organizations/${organizationName}/credential/${values.title}/${credName}`,
                    name:credName,
                    time:time,
                    aws_access_key_id : accessid,
                    aws_secret_access_key : accesskey,
                    region : region,
                    cloud : values.title
                }
                setCredentials(newValue)
            }
            else if(values.title === 'azurerm'){
                const newValues = {
                    ...credentials,
                    id: `organizations/${organizationName}/credential/${values.title}/${credName}`,
                    name:credName,
                    time:time,
                    subscription_id: subscriptionid,
                    client_id: clientid,
                    secret_id: secretid,
                    tenant_id: tenant,
                    cloud : values.title
                }
                setCredentials(newValues);
            }
        }
    },[projectid,googlecred,accesskey,accessid,region,clientid,tenant,secretid,subscriptionid,credName])

    const handleClose = useCallback(() => {
        close();
    }, []);



    const handleChangeGooglecred = useCallback((event) => {
        setGooglecred(event.target.value)
    })

    const onChangeProjectid = useCallback(
        (event) => {
            setProjectid(event.target.value)
        },
    )

    const onChangeAccessid = useCallback(
        (event) => {
            setAccessid(event.target.value)
        },
    )

    const onChangeAccessKey = useCallback(
        (event) => {
            setAccesskey(event.target.value)
        },
    )

    const onChangeRegion = useCallback(
        (event) => {
            setRegion(event.target.value)
        },
    )

    const onChangeSubscription = useCallback(
        (event) => {
            setSubscriptionid(event.target.value)
        },
    )

    const onChangeClient = useCallback(
        (event) => {
            setClientid(event.target.value)
        },
    )

    const onChangeSecret =useCallback(
        (event) => {
            setSecretid(event.target.value)
        }
    )

    const onChangeCredName =useCallback(
        (event) => {
            setCredName(event.target.value)
        }
    )

    const onChangeTenent = useCallback(
        (event) => {
            setTenant(event.target.value)
        }
    )


    const handleCreate = useCallback(() => {
        let postCredRequest = hostport + `/api/v1/organizations/${organizationName}/credentials/`;

        createDetails(postCredRequest, "","","", credentials)
            .then(() => {
                handleClose()
            })
            .catch((err) => {
                console.log("Error", err.message)
                handleClose()
            });

        // handleClose()

    })


    const onClickSubmit = useCallback(() => {
        if(values){
            if(values.title === 'aws' && accesskey!="" && accessid!="" && region!="" && credName!=""){
                return (
                    <Button onClick={handleCreate} variant={"contained"}>Submit</Button>
                );
            }
            else if(values.title=== 'google' && googlecred !="" && projectid!="" && credName!=""){
                return (
                    <Button  onClick={handleCreate} variant={"contained"}>Submit</Button>
                );
            }
            else if (values.title === 'azurerm' && subscriptionid!="" && clientid != "" && secretid!="" && tenant!="" && credName!=""){
                return (
                    <Button onClick={handleCreate} variant={"contained"}>Submit</Button>
                );
            }
            else{
                return (
                    <Button disabled variant={"contained"}>Submit</Button>
                );
            }
        }
    })

    return (
        <Grid sx ={{backgroundColor:theme}}>
            <form onSubmit={handleCreate}>
                <Typography variant="h4">Add Credentials</Typography>
                <Divider />
                <br />
                <Typography variant="caption">Choose cloud provider:</Typography>

                <Autocomplete
                    style={{ width: 300 }}
                    options={["google","azurerm"]}
                    id="controlled-demo"
                    loading ='lazy'
                    defaultValue={values.title}
                    value={values.title}
                    onChange={(e, newValue) => {
                        setValues({
                            "title":newValue
                        });
                    }}
                    renderInput={(params) => <TextField {...params} size="small"  />}
                />
                <br />
                <Divider />
                <br />
                {values!==null&&(
                    values.title!==""&&
                    <Typography variant='caption' fontStyle={"initial"}>
                        Enter a unique name for this credentials.
                        <br/>
                        <TextField sx={{width: 300}} size='small' onChange={onChangeCredName} type={"text"}
                        />
                        <br/>
                    </Typography>
                )
                }
                <br/>
                {values !== null ? (
                    values.title === "aws" && (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <Typography variant="caption">
                                Aws Access Key id:
                                <br/>
                                <TextField
                                    sx={{ width: 300 }}
                                    onChange = {onChangeAccessid}
                                    size="small"
                                    inputProps={{
                                        pattern: '(?<![A-Z0-9])[A-Z0-9]{20}(?![A-Z0-9])'
                                    }}
                                />
                            </Typography>
                            <br />
                            <Typography variant="caption">
                                Aws Secret Access Key:
                                <br />
                                <TextField
                                    sx={{ width: 300 }}
                                    onChange = {onChangeAccessKey}
                                    size="small"
                                    inputProps={{
                                        pattern: '^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$'
                                    }}
                                />
                            </Typography>
                            <br />
                            <Typography variant="caption">
                                Region:
                                <br />
                                <TextField
                                    sx={{ width: 300 }}
                                    size="small"
                                    onChange = {onChangeRegion}
                                />
                            </Typography>
                        </div>
                    )
                ) : (
                    <></>
                )}
                {values !== null ? (
                    values.title === "azurerm" && (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <Typography variant="caption">
                                Subscription id:
                                <br />
                                <TextField
                                    sx={{ width: 300 }}
                                    onChange = {onChangeSubscription}
                                    size="small"
                                    inputProps={{
                                        pattern: '^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$'
                                    }}
                                />
                            </Typography>
                            <br />
                            <Typography variant="caption">
                                Client id:
                                <br />
                                <TextField
                                    sx={{ width: 300 }}
                                    onChange = {onChangeClient}
                                    size="small"
                                    inputProps={{
                                        pattern: '^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$'
                                    }}

                                />
                            </Typography>
                            <br />
                            <Typography variant="caption">
                                Secret id:
                                <br />
                                <TextField
                                    onChange = {onChangeSecret}
                                    sx={{ width: 300 }}
                                    size="small"
                                    inputProps={{
                                        pattern: '[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}'
                                    }}
                                />
                            </Typography>
                            <br />
                            <Typography variant="caption">
                                Tenant id:
                                <br />
                                <TextField
                                    onChange = {onChangeTenent}
                                    sx={{ width: 300 }}
                                    size="small"
                                    inputProps={{
                                        pattern: '^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$'
                                    }}
                                />
                            </Typography>
                        </div>
                    )
                ) : (
                    <></>
                )}
                {values !== null && values.title === "google" ? (
                    <div>
                        <Typography variant="caption">
                            Project id:
                            <br />
                            <TextField
                                sx={{ width: 300 }}
                                size="small"
                                onChange={onChangeProjectid}
                            />
                        </Typography>
                        <br />
                        <br />
                        <Typography variant="caption">
                            Credentials:
                            <br />
                            <TextField multiline rows={10} sx={{ width: 800 }} onChange={handleChangeGooglecred}/>
                        </Typography>
                    </div>
                ) : (
                    <div></div>
                )}
                <br />
                <br />
                <Divider />
                <br />
                <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                    <Button onClick={handleClose} color="error">
                        Close
                    </Button>&nbsp;&nbsp;
                    {onClickSubmit()}
                </div>
            </form>
        </Grid>
    );
}