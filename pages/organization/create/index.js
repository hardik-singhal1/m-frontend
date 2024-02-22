import {Button, Divider, Grid, TextField, Typography} from "@material-ui/core";
import { ErrorContext } from "../../../lib/errorContext";
import { createDetails, updateDetails } from "../../../utils/fetch-util";
import { hostport } from "../../../next.config";
import router, { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {AuthContext} from "../../../lib/authContext";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {encode as base64_encode} from "base-64";

export default function Projects({ level }) {
    const router = useRouter();
    const { organization_name } = router.query;
    const [
        organizationName,
        setOrganizationName
    ] = React.useState("");
    const { errorTrigger } = useContext(ErrorContext);
    const { userData } = useContext(AuthContext);

    const [value] = useState({
        cloudaccounts: [],
        id: "",
        name: ""
    });
    const [array, setArray] = useState(["Bitbucket", "GitHub", "GitLab"]);
    const [values, setValues] = useState("");
    const [username, setUsername] = useState("");
    const [authToken, setAuthtoken] = useState({
        password: "",
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setAuthtoken({ ...authToken, [prop]: event.target.value });
    };
    const handleClickShowPassword = () => {
        setAuthtoken({
            ...authToken,
            showPassword: !authToken.showPassword,
        });
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleClose = useCallback(() => {
        router.push("/");
    }, [router]);

    const onChangeOrganizationName = useCallback((event) => setOrganizationName(event.target.value))

    const [assignRoleValue, setAssignRoleValue] = useState({
        level:"",
        object:"",
        role: "",
        subject:""
    });

    useEffect(() => {
        value.id = `organizations/${organizationName}`;
        value.name = organizationName;

        let userId = userData ? userData.identity.id : ""

        assignRoleValue.level = "organization";
        assignRoleValue.object = `organizations/${organizationName}`
        assignRoleValue.role = "role::organization_owner";
        assignRoleValue.subject = ["identity::"+userId];
    },[organizationName,userData])

    const [assignRole,setAssignRole] = useState(false);

    const assignOrgOwner = useCallback(() => {
        const assignRoleUrl = `${hostport}/api/v1/iam/roles/assign`
        createDetails(assignRoleUrl, "", "organization", assignRoleValue.object, assignRoleValue)
            .catch((err) => {
                console.log("error", JSON.stringify(err.message));
            });
    })

    let endata = username + ":" + authToken.password;

    let encoded = base64_encode(endata);

    let response = {
        "id": `organizations/${organizationName}`,
        "name": organizationName,
        "credential": encoded
    };


    const handleCloseCreate = useCallback(() => {

        try {
            if(values==="Bitbucket"){
                const createOrg = `${hostport}/api/v1/organizations/`;
                console.log("res",response,values)
                createDetails(createOrg, "", "", "", response)
                    .then(() => assignOrgOwner())
                    .catch((err) => {
                        errorTrigger("error", JSON.stringify(err.message));
                    });
            }}
        catch
            (err)
            {
                errorTrigger("error", JSON.stringify(err.message));
            }
            setAssignRole(true);
            router.push(`/organization/${response.name}`);
    }, [
        errorTrigger,
        response,
        level,
        router
    ]);


    useEffect(()=>{
        console.log(values)
    },[values])

    // useEffect(() => {
    //     if (assignRole === true) {
    //         assignOrgOwner()
    //     }
    // }, [assignRole, handleCloseCreate, handleClose])

    return (
        <div style={{ height: 400,
            width: "100%" }}
        >
            <div>
            <div>
                <Typography variant="h4">
                    Create Organization
                </Typography>
                <br />
                <Typography variant="h6">
                    Name the Organization
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography variant="inherit">
                    Organization Name
                </Typography>
                <br />
                <Typography variant="caption">
                    Enter a meaningful name to identify this Organization.
                </Typography>
                <br />
                <div>
                    <TextField
                        defaultValue={organizationName}
                        onChange={onChangeOrganizationName}
                        size="small"
                    />
                </div>
            </div>
            <div >
                <Grid>
                    <div>
                        <div style={{ display: "flex", flexDirection: "column"}}>
                            <br />
                            <Typography variant="caption" style={{ float: "left" }}>
                                Choose your Git tool
                                <br />
                                <Autocomplete
                                    sx={{ width: 300 }}
                                    options={array}
                                    defaultValue={array[1]}
                                    autoHighlight
                                    onChange={(e, newValue) => {
                                        setValues(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: "new-password",
                                            }}
                                            size="small"
                                        />
                                    )}
                                />
                            </Typography>
                            <br />
                            <Typography variant="caption">UserName*</Typography>
                            <TextField
                                sx={{width: 300}}
                                size="small"
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                }}
                                type="text"
                                required
                            />
                            <br />
                            {values === "Bitbucket" ? (
                                <Typography variant="caption">App Password*</Typography>
                            ) : values === "GitHub" ? (
                                <Typography variant="caption">Access Token*</Typography>
                            ) : (
                                <Typography variant="caption">Password*</Typography>
                            )}
                            <FormControl
                                sx={{ width: 300 }}
                                variant="outlined"
                                size="small"
                            >
                                <InputLabel htmlFor="outlined-adornment-password" />
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={authToken.showPassword ? "text" : "password"}
                                    value={authToken.password}
                                    required
                                    onChange={handleChange("password")}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {authToken.showPassword ? (
                                                    <Visibility />
                                                ) : (

                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </div>
                    </div>

                </Grid>
            </div>
            </div>
                <br />
                <Divider />
                <br />
                <div align="right">
                    <Button
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <span> </span>
                    {
                        organizationName === "" || username === "" || authToken.password === ""
                            ? <Button
                                    disabled
                                    variant="contained"
                              >
                                Create
                            </Button>
                            : <Button
                                onClick={handleCloseCreate}
                                variant="contained">
                                Create
                            </Button>
                    }
                </div>
            </div>
    );
}

Projects.propTypes = {
    level: PropTypes.string
};
