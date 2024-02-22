import {Line} from "react-chartjs-2";
import React, {useEffect, useMemo, useState} from "react"
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import {Checkbox, Menu} from "@mui/material";
import {makeStyles} from "@material-ui/styles"
import Chart from 'chart.js/auto'
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {getDetails} from "../../utils/fetch-util";
import {hostport} from "../../next.config";
import {throttle} from "lodash";
import {useRouter} from "next/router";

const useStyles = makeStyles((theme) => ({
    root: {
        background: 'linear-gradient(45deg, #1B98E033 50%, #1B98E033 50%)'
    },
}))

function CostDashboard() {

    const [graphData, setGraphData] = useState({});
    const classes = useStyles();
    const router = useRouter();
    const {organization_name:organizationName} = router.query;
    const {project_name:projectName} = router.query;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [applicationState, setApplicationState] = useState(false);
    const [miscState, setMiscState] = useState(false);
    const [highlightState, setHighlightState] = useState("Current month");
    const [chartJsData, setChartJsData] = useState(
        {
            labels: "1",
            datasets: [
                {
                    label: "Total Cost",
                    data: [1],
                    backgroundColor: ['rgb(75, 192, 192)'],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                },
            ],
        });
    const [miscData,setMiscData]=useState({
        Resources:[]
    });
    const [appData,setAppData] = useState({
        Resources:[]
    });

    const [total,setTotal] = useState({});

    function handleApplicationClick() {
        setApplicationState((applicationState) => !applicationState)
    }

    function handleMiscClick() {
        setMiscState((miscState) => !miscState)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    // Implemented Throttling to avoid multiple api calls on click button multiple times
    const throttleMonthClick = useMemo(() => throttle(handleMonthClick, 500), [router.isReady]);

    function handleMonthClick(event) {
        setHighlightState(event.target.textContent);

        if (event.target.textContent === "Current month") {
            getCostResponse("current_month")
        } else if (event.target.textContent === "1M") {
            getCostResponse("last_month")
        } else if (event.target.textContent === "3M") {
            getCostResponse("past_3_months")
        } else if (event.target.textContent === "6M") {
            getCostResponse("past_6_months")
        }
    }

    useEffect(() => {
        if (JSON.stringify(graphData) !== '{}') {
            let totalCostData = setTotalCost(graphData)
            setTotal(totalCostData)

            if (miscState && applicationState) {

                if (appData.Resources.length > 0 && miscData.Resources.length > 0) {

                    let mergeAppMiscData = {
                        Resources: [...appData.Resources, ...miscData.Resources]
                    }

                    let tempArr = datasetsObject(mergeAppMiscData, total)

                    setChartJsData(tempArr)
                } else if (appData.Resources.length > 0) {
                    setChartJsData({})
                    let tempArr = datasetsObject(appData, total)

                    setChartJsData(tempArr)
                } else if (miscData.Resources.length > 0) {
                    setChartJsData({})
                    let tempArr = datasetsObject(miscData, total)

                    setChartJsData(tempArr)
                } else if (appData.Resources.length === 0 && miscData.Resources.length === 0) {

                    setChartJsData(total)
                }
            } else if (miscState && miscData.Resources.length > 0) {
                const chartData = datasetsObject(miscData, total)

                setChartJsData(chartData)
            } else if (applicationState && appData.Resources.length > 0) {
                const chartData = datasetsObject(appData, total)

                setChartJsData(chartData)
            }
            setChartJsData(total)
        }
    }, [graphData, applicationState, miscState, miscData, appData])


    const options = {
        scales: {
            x: {
                grid: {
                    display: false,
                }
            },
            y: {
                grid: {
                    display: true,
                    borderDash: [
                        2,
                        2
                    ]
                }
            },
        },
        plugins:{
            legend: {
                display:false
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },

    };

    useEffect(() => {
        if(router.isReady){
            getCostResponse("current_month")
        }
    }, [router.isReady])


    function getCostResponse(month) {
        const costUrl = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/dashboard/${month}/`
        getDetails(costUrl, "", "", "", "").then((res) => {
            setGraphData(res.response_data)

            let tempMiscData = res.response_data.Resources.filter((elem) => elem.Filter_type === "mis")
            let tempAppData = res.response_data.Resources.filter((elem) => elem.Filter_type === "application")

            setAppData({
                Resources: tempAppData
            })
            setMiscData({
                Resources: tempMiscData
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    function datasetsObject(graphData, totalCostData) {

        if (graphData !== undefined) {
            graphData.Resources.map((i) => {
                let color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
                let dynamicData =
                    {
                        label: i.ResourceName,
                        data: i.CostDate.map((i) => i.TotalCost),
                        backgroundColor:["#241f1c","#937047","#e7dac7"],
                        fill: false,
                        borderColor: color,
                        tension: 0.1,
                        pointRadius: 0,
                        pointHoverRadius: 0,
                    }
                totalCostData.datasets.push(dynamicData)
            })
            return totalCostData
        }
        return {}
    }

    function setTotalCost(graphData) {
        if (graphData !== undefined) {
            const data = {
                labels: graphData.TotalResourceCost.map((i) => i.Date),
                datasets: [
                    {
                        label: "Total Cost",
                        data: graphData.TotalResourceCost.map((i) => i.TotalCost),
                        backgroundColor: ['rgb(75, 192, 192)'],
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                        pointRadius: 0,
                        pointHoverRadius: 0,
                    },
                ],
            }
            return data
        }
        return {}
    }

    return (
        <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>
                    <Stack direction="row" spacing={2}>
                        <Button
                            className={highlightState === "Current month" ? classes.root : ""}
                            variant="text"
                            size={'small'}
                            onClick={throttleMonthClick}
                            sx={{
                                borderRadius: "25px 25px",
                            }}
                        >Current month</Button>
                        <Button
                            className={highlightState === "1M" ? classes.root : ""}
                            onClick={throttleMonthClick}
                            variant="text"
                            size={'small'}
                            sx={{
                                borderRadius: "25px 25px",
                            }}
                        >1M</Button>
                        <Button
                            variant="text" size={'small'}
                            className={highlightState === "3M" ? classes.root : ""}
                            onClick={throttleMonthClick}
                            sx={{
                                borderRadius: "25px 25px",
                            }}
                        >
                            3M
                        </Button>
                        <Button
                            className={highlightState === "6M" ? classes.root : ""}
                            onClick={throttleMonthClick}
                            sx={{
                                borderRadius: "25px 25px",
                            }}
                            variant="text" size={'small'}>6M</Button>
                    </Stack>
                </div>

                <div align="end">
                    <IconButton
                        centerRipple={true}
                        color={"primary"}
                        onClick={handleClick}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                    >
                        <FilterAltOutlinedIcon/>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={() => setAnchorEl(null)}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                position: "fixed",
                                overflow: "visible",
                                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                mt: 19,
                                ml: -10.5,
                                "&:before": {
                                    content: '""',
                                    display: "block",
                                    position: "absolute",
                                    right: 14,
                                    top: 0,
                                    width: 10,
                                    height: 10,
                                    bgcolor: "background.paper",
                                    transform: "translateY(-50%) rotate(45deg)",
                                    zIndex: 0
                                }
                            }
                        }}
                        transformOrigin={{horizontal: 100, vertical: 400}}
                        anchorOrigin={{horizontal: 40, vertical: 300}}
                    >
                        <MenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size={"small"}
                                        onClick={handleApplicationClick}
                                        checked={applicationState}
                                    />
                                }
                                label="Application"
                            />
                        </MenuItem>
                        <MenuItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size={"small"}
                                        onClick={handleMiscClick}
                                        checked={miscState}
                                    />
                                }
                                label="Miscellaneous"
                            />
                        </MenuItem>
                    </Menu>
                </div>
            </div>
            {
                JSON.stringify(chartJsData) !== "{}" &&
                <div style={{padding: 10}}>
                    <Line data={chartJsData} options={options} height={"100"} width={"200"}/>
                </div>
            }
        </div>
    )
}

export default CostDashboard;
