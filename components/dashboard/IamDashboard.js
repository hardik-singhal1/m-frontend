import * as React from "react";
import {Bar,Pie,PolarArea} from "react-chartjs-2";
import Chart from "chart.js/auto";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useTheme, styled} from "@mui/material/styles";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import {autocompleteClasses} from "@mui/material/Autocomplete";
import ButtonBase from "@mui/material/ButtonBase";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import FilterListIcon from '@mui/icons-material/FilterList';
import {hostport} from "../../next.config";
import {getDetails} from "../../utils/fetch-util";
import {useRouter} from "next/router";

const StyledAutocompletePopper = styled("div")(({theme}) => ({
    [`& .${autocompleteClasses.paper}`]: {
        boxShadow: "none",
        margin: 0,
        color: "inherit",
        fontSize: 13
    },
    [`& .${autocompleteClasses.listbox}`]: {
        backgroundColor: theme.palette.mode === "light" ? "#fff" : "#1c2128",
        padding: 0,
        [`& .${autocompleteClasses.option}`]: {
            minHeight: "auto",
            alignItems: "flex-start",
            padding: 8,
            borderBottom: `1px solid  ${
                theme.palette.mode === "light" ? " #eaecef" : "#30363d"
            }`,
            '&[aria-selected="true"]': {
                backgroundColor: "transparent"
            },
            '&[data-focus="true"], &[data-focus="true"][aria-selected="true"]': {
                backgroundColor: theme.palette.action.hover
            }
        }
    },
    [`&.${autocompleteClasses.popperDisablePortal}`]: {
        position: "relative"
    }
}));

function PopperComponent(props) {
    const {disablePortal, anchorEl, open, ...other} = props;
    return <StyledAutocompletePopper {...other} />;
}

PopperComponent.propTypes = {
    anchorEl: PropTypes.any,
    disablePortal: PropTypes.bool,
    open: PropTypes.bool.isRequired
};

const StyledPopper = styled(Popper)(({theme}) => ({
    border: `1px solid ${theme.palette.mode === "light" ? "#e1e4e8" : "#30363d"}`,
    boxShadow: `0 8px 24px ${
        theme.palette.mode === "light" ? "rgba(149, 157, 165, 0.2)" : "rgb(1, 4, 9)"
    }`,
    borderRadius: 6,
    width: 300,
    zIndex: theme.zIndex.modal,
    fontSize: 13,
    color: theme.palette.mode === "light" ? "#24292e" : "#c9d1d9",
    backgroundColor: theme.palette.mode === "light" ? "#fff" : "#1c2128"
}));

const StyledInput = styled(InputBase)(({theme}) => ({
    padding: 10,
    width: "100%",
    borderBottom: `1px solid ${
        theme.palette.mode === "light" ? "#eaecef" : "#30363d"
    }`,
    "& input": {
        borderRadius: 4,
        backgroundColor: theme.palette.mode === "light" ? "#fff" : "#0d1117",
        padding: 8,
        transition: theme.transitions.create(["border-color", "box-shadow"]),
        border: `1px solid ${
            theme.palette.mode === "light" ? "#eaecef" : "#30363d"
        }`,
        fontSize: 14,
        "&:focus": {
            boxShadow: `0px 0px 0px 3px ${
                theme.palette.mode === "light"
                    ? "rgba(3, 102, 214, 0.3)"
                    : "rgb(12, 45, 107)"
            }`,
            borderColor: theme.palette.mode === "light" ? "#0366d6" : "#388bfd"
        }
    }
}));

export default function IamDashboard() {
    const [iamData, setIamData] = useState({})
    const [anchorEl, setAnchorEl] = useState(null);
    const [value, setValue] = useState([]);
    const [pendingValue, setPendingValue] = useState([]);
    const theme = useTheme();
    const router = useRouter();

    const {organization_name: organizationName} = router.query;
    const {project_name: projectName} = router.query;

    const handleClick = (event, value) => {
        setPendingValue(value);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setValue(pendingValue);
        if (anchorEl) {
            anchorEl.focus();
        }
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? "github-label" : undefined;

    const options = {
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                }
            }
        },
        interaction: {
            intersect: false,
            mode: "index"
        },
        plugins:{
            legend: {
                display: false
            },
        }
    };

    function getIamData() {
        const costUrl = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/cloud/gcp/iam/dashboard`
        getDetails(costUrl, "", "", "", "").then((res) => {
            console.log(res.response_data)
            setIamData(res.response_data)
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        (organizationName && projectName) &&
        getIamData()
    },[organizationName,projectName])


    const [data, setData] = useState({
        labels: ["Total", "Success", "Fail"],
        datasets: [
            {
                label: "All",
                data: [0,0,0],
                borderColor: "rgba(255,206,86,0.2)",
                backgroundColor:["#283350","#f93800","#ffb500"],
                borderWidth: 1
            }
        ]
    });

    const [filterOption, setFilterOption] = useState([]);
    const [filterValue, setFilterValue] = useState([]);



    const onChangeFilterValue = useCallback((event, value) => {
        value.label !== "All"
            ? iamData.roleBindingDashBoard.filter((s) => {
                if (value.label === s.roleName) {
                    console.log(s);
                    setData({
                        labels: ["Total", "Success", "Fail"],
                        datasets: [
                            {
                                label: "",
                                data: [s.total, s.success, s.failure],
                                borderColor: "rgba(255,206,86,0.2)",
                                backgroundColor:["#283350","#f93800","#ffb500"],
                                borderWidth: 1
                            }
                        ]
                    });
                }
            })
            : setData({
                labels: ["Total", "Success", "Fail"],
                datasets: [
                    {
                        label: "",
                        data: [iamData.total, iamData.numberOfSuccess, iamData.numberOfFailure],
                        borderColor: "rgba(255,206,86,0.2)",
                        backgroundColor:["#283350","#f93800","#ffb500"],
                        borderWidth: 1
                    }
                ]
            });
    });

    useEffect(()=>{
        if(Object.keys(iamData).length !== 0){
            pushData();
            setData({
                labels: ["Total", "Success", "Fail"],
                datasets: [
                    {
                        label: "",
                        data: [iamData.total, iamData.numberOfSuccess, iamData.numberOfFailure],
                        borderColor: "rgba(255,206,86,0.2)",
                        backgroundColor:["#283350","#f93800","#ffb500"],
                        borderWidth: 1
                    }
                ]
            })
        }

    },[iamData])


    function pushData() {
        const arr = [{label: "All"}];
        iamData?.roleBindingDashBoard?.map((i) => {
            if (!filterOption.includes( i.roleName)) {
                arr.push({label: i.roleName});
            }
        });
        setFilterOption(arr);
    }

    return (
        <div>
            <React.Fragment>
                <Box sx={{width: 221, fontSize: 13}}>
                    <Button endIcon={<FilterListIcon/>} disableRipple aria-describedby={id} onClick={handleClick}>
                        <span>Filter</span>

                    </Button>
                </Box>
                <StyledPopper
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    placement="bottom-start"
                >
                    <ClickAwayListener onClickAway={handleClose}>
                        <div>
                            <Autocomplete
                                open
                                disablePortal
                                onChange={onChangeFilterValue}
                                disableCloseOnSelect
                                PopperComponent={PopperComponent}
                                renderOption={(props, filterOption, {selected}) => (
                                    <li {...props}>
                                        <Box
                                            component={DoneIcon}
                                            sx={{width: 17, height: 17, mr: "5px", ml: "-2px"}}
                                            style={{
                                                visibility: selected ? "visible" : "hidden"
                                            }}
                                        />
                                        <Box
                                            component="span"
                                            sx={{
                                                width: 14,
                                                height: 14,
                                                flexShrink: 0,
                                                borderRadius: "3px",
                                                mr: 1,
                                                mt: "2px"
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                flexGrow: 1,
                                                "& span": {
                                                    color:
                                                        theme.palette.mode === "light"
                                                            ? "#586069"
                                                            : "#8b949e"
                                                }
                                            }}
                                        >
                                            {filterOption.label}
                                            <br/>
                                        </Box>
                                    </li>
                                )}
                                options={filterOption}
                                getOptionLabel={filterOption.label}
                                renderInput={(params) => (
                                    <StyledInput
                                        ref={params.InputProps.ref}
                                        inputProps={params.inputProps}
                                        autoFocus
                                        placeholder="Filter labels"
                                    />
                                )}
                            />
                        </div>
                    </ClickAwayListener>
                </StyledPopper>
            </React.Fragment>
            <div>
                <PolarArea data={data} options={options}/>
            </div>
        </div>
    );
}
