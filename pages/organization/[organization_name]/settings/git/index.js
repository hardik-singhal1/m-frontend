import { Button, Divider, Grid, Typography } from "@material-ui/core";
import React, { lazy } from "react";
import { TextField } from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useContext } from "react";
import { ErrorContext } from "../../../../../lib/errorContext";
import { useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/system";
import router from "next/router";
import { encode as base64_encode, decode as base64_decode } from "base-64";
import { hostport } from "../../../../../next.config";
import {createDetails, deleteDetails, updateDetails} from "../../../../../utils/fetch-util";
import { getDetails } from "../../../../../utils/fetch-util";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Password, Pattern, RefreshRounded } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import DataGridComponent from "../../../../../components/DataGridComponent";

export default function Gitcredential() {
    const [array, setArray] = useState(["Bitbucket", "GitHub", "GitLab"]);
    const [value, setValue] = useState("");
    const { errorTrigger } = useContext(ErrorContext);
    const [create, setCreate] = useState(false);
    const [username, setUsername] = useState("");
    const [authToken, setAuthtoken] = useState({
        password: "",
        showPassword: false,
    });
    const { organization_name } = router.query;
    const [selected, setSelected] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [rows, setRows] = useState([]);

    let endata = username + ":" + authToken.password;

    let encoded = base64_encode(endata);

    const [response, setResponse] = useState({
        id: "",
        name : "",
        credentials: encoded,
        organization: organization_name,
        type: value,
    });

    const handleClose = () => {
        setCreate(false);
        setUsername("");
        setAuthtoken({
            password: "",
            showPassword: false,
        });
    };

    const handleClosecreate = () => {
        setCreate(true);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 600 },
        { field: "name", headerName: "User Name", width: 200 },
        { field: "type", headerName: "Type", width: 200 },
    ];

    function onSelectedListChange(newSelectedList) {
        setSelected(newSelectedList);
    }

    useEffect(() => {
        if (username !== "" && authToken.password !== "") {
            response.credentials = encoded;
            response.organization = organization_name;
            response.name =  String(value+ "/" +username);
            response.id = `/organizations/${organization_name}/bitbucket/${username}`;
            response.type = value;
        }
    }, [username, authToken.password]);

    function getRows() {
        try {
            var Getcredentials =
                hostport +
                `/api/v1/organizations/${organization_name}/settings/git/credentials`;

            getDetails(Getcredentials, "","","","")
                .then((res) => {
                    if (res.response_data === null) {
                        setRows([]);
                    } else {
                        setRows(res.response_data)
                    }
                })
                .catch((err) => {
                    console.log(err.message)
                });
        } catch (err) {
            errorTrigger("err", JSON.stringify(err.message));
        }
    }

    useEffect(() => {
        getRows();
        getRows();
    }, [create]);

    useEffect(() => {
        getRows();
    }, []);

    function handleCreate() {
        if (value === "Bitbucket".toLowerCase()) {
            let putCredRequest =
                hostport +
                `/api/v1/organizations/${organization_name}/settings/git/addCredential`;
            createDetails(putCredRequest, "","","", response)
                .then((res) => {
                    res;
                    getRows();
                })

                .catch((err) => {
                    console.log("Err",err.message)
                });
        } else {
            console.log("error");
        }
        handleClose();
    }

    function handleDelete() {
        for (var i = 0; i < selected.length; i++) {
            let req = {
                id: selected[i].id,
                name :selected[i].name,
                organization: organization_name,
                type: selected[i].type,
            }
            var deleteCredentials =
                hostport +
                `/api/v1/organizations/${organization_name}/settings/git/credentials`;
            deleteDetails(deleteCredentials, "","","",req)
                .then((res) => {
                    getRows();
                })
                .catch((err) => {
                    errorTrigger("error", JSON.stringify(err));
                });
        }
    }

    const handleClickShowPassword = () => {
        setAuthtoken({
            ...authToken,
            showPassword: !authToken.showPassword,
        });
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (prop) => (event) => {
        setAuthtoken({ ...authToken, [prop]: event.target.value });
    };

    function handleRefresh() {
        getRows();
    }



    return (
        <div>
            {!create ? (
                <Grid>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Typography variant={"h5"} style={{marginLeft:"0.5rem"}} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>Git</Typography>

                        <Box sx={{ flexGrow: 1 }} />
                        <Tooltip title="Refresh">
                            <Button onClick={handleRefresh} color="info" size={"small"}>
                                <RefreshRounded />
                            </Button>
                        </Tooltip>
                        &nbsp;
                        <Button onClick={handleClosecreate} variant={"contained"} size={"small"} sx={{mr:"0.5rem"}}>
                            <AddIcon />Add credentials
                        </Button>
                        {selected.length != 0 ? (
                            <Button color="error" onClick={handleDelete} size={"small"} variant={"contained"}>
                                <DeleteIcon />
                                Delete
                            </Button>
                        ) : (
                            <Button color="error" disabled onClick={handleDelete} variant={"contained"} size={"small"}>
                                <DeleteIcon />Delete
                            </Button>
                        )}
                    </div>
                    <br />
                    <div style={{ height: 500, width: "auto" }}>
                        <DataGridComponent
                            checkboxSelection
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            disableSelectionOnClick={true}
                            selectedValues={onSelectedListChange}
                        />
                    </div>
                </Grid>
            ) : (
                <Grid>

                    <div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <Typography variant="h4">Add Git Credentials</Typography>
                            <br />
                            <Divider />
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
                                        setValue(newValue.toLowerCase());
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
                            {value === "Bitbucket".toLowerCase() ? (
                                <Typography variant="caption">App Password*</Typography>
                            ) : value === "GitHub".toLowerCase() ? (
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
                        <br />
                        <br />
                        <Divider />
                        <br />
                        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                            <Button color="error" onClick={handleClose}>
                                close
                            </Button>
                            &nbsp;&nbsp;
                            {username !== "" && authToken.password !== "" && value != null ? (
                                <Button onClick={handleCreate} variant="contained">
                                    save
                                </Button>
                            ) : (
                                <Button disabled>save</Button>
                            )}
                        </div>
                    </div>

                </Grid>
            )}
        </div>
    );
}
