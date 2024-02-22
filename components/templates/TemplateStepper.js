import Box from "@mui/material/Box";
import {Button, Divider, Step, StepLabel, Stepper, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import DynamicBox, {DynamicField} from "../tools/DynamicBox";
import Grid from "@mui/material/Grid";
import {anyStateTrue, ErrorState} from "../../utils/validation";
import {hostport} from "../../next.config";
import {getDetails} from "../../utils/fetch-util";
import {useRouter} from "next/router";
import yaml from "js-yaml";

export default function TemplateStepper({
                             activeStep,
                             templates,
                             handleReset,
                             customclass,
                             properties,
                             handleCloseStepper,
                             errorStates,
                             handleError,
                             detailsTemplate,
                             handleChangeTotal,
                             templateDetails
                         }) {
    const router = useRouter();
    const organizationName = router.query.organization_name;
    const [propertiesState, setPropertiesState] = useState([]);
    const [errorsState, setErrorsState] = useState([]);
    const [activeStage, setActiveStage] = useState(0);
    const [data, setData] = useState([]);
    const [disableSubmit, setDisableSubmit] = useState(true);

    function handleChange(event) {
        let newData = [...data];
        newData[activeStage] = event.target.value;
        setData(newData);

        let obj = {};
        newData.forEach((d, i) => {
            if (d) {
                obj[templates[i]] = d;
            }
        })
        handleChangeTotal(obj);
    }

    function handleReset() {
        setActiveStage(0);
    }

    useEffect(() => {
        setDisableSubmit(errorsState[activeStage]);
    }, [activeStage, errorsState]);

    function handleNext() {
        setActiveStage(prevActiveStage => prevActiveStage + 1);
    }

    function handleBack() {
        setActiveStage(prevActiveStage => prevActiveStage - 1);
    }

    useEffect(async () => {
        if (templates && templates.length > 0) {
            let newPropertiesState = [];
            let newErrorsState = [];
            let data = [];
            for (let i=0; i<templates.length; i++) {
                let e = templates[i];
                let getTemplates = `${hostport}/api/v1/organizations/${organizationName}/templates/${e}/schema`;
                let res = await getDetails(getTemplates, "", "", "", "");
                let schema = res.response_data;
                schema = yaml.load(schema);
                if(templateDetails && templateDetails[e]){
                    switch (e){
                        case "project_setup":
                            schema.properties.environment.default=templateDetails.project_setup.environment
                            schema.properties.project_name.default=templateDetails.project_setup.project_name
                            schema.properties.sub_folder_name.default=templateDetails.project_setup.sub_folder_name
                            schema.properties.key.default=templateDetails.project_setup.key
                            break
                        // case "container_cluster":
                        //     schema.properties.pods_range_name.options=templateDetails.container_cluster.pods_range_name
                        //     schema.properties.services_range_name.options=templateDetails.container_cluster.services_range_name
                        //     break
                        default :
                            break
                    }
                }
                newPropertiesState.push(schema.properties);
                newErrorsState.push(true);
                let prop = []
                // if (!arr.includes(templateSchema) && !schemaList.includes(templateSchema)) {
                //     arr.push(templateSchema)
                //     setSchemaList(arr)
                //     arr.map((a) => {
                //         const schema = yaml.load(a.schema);
                //         if (!prop.includes(schema.properties) && !properties.includes(schema.properties)) {
                //             prop.push(schema.properties)
                //             setProperties(prop)
                //             setDetailsTemplate({...detailsTemplate, resource_type: a.name});
                //             setErrorStates({...errorStates, resource_type: new ErrorState(cloud === '', '')});
                //         }
                //     })
                // }
            }
            setData(data);
            setPropertiesState(newPropertiesState);
            setErrorsState(newErrorsState);
        }

    }, [templates]);
    return (<div>
        <Box sx={{width: '100%'}}>
            <Stepper activeStep={activeStage}>
                {templates?.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};

                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStage === templates.length ? (
                <React.Fragment>
                    <Typography sx={{mt: 2, mb: 1}}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                        <Box sx={{flex: '1 1 auto'}}/>
                        <Button onClick={handleReset}
                                size={"small"}>Reset</Button>
                        <Button type={"submit"}
                                variant="contained"
                                size={"small"}>Create</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Paper sx={{width: "70%", }}>
                        <div style={{margin: 40, marginTop: 40}}>
                            <DynamicBox
                                name={templates?.[activeStage]}
                                properties={propertiesState?.[activeStage]}
                                data={data?.[activeStage]}
                                renderRow={(key, property, data, notifyBox) => (
                                    <Grid sx={{display: 'flex', flexDirection: 'row'}}>
                                        <Grid container justify={"space-between"} key={key} >
                                            <Grid item sx={customclass.subnetFormLabel}>
                                                <Typography variant="subtitle1" sx={{margin: "auto"}}>{property.title}</Typography>
                                            </Grid>
                                            <Box sx={{flexGrow: 1}}/>
                                            <Grid item>
                                                <DynamicField KEY={key} property={property} data={data}
                                                              notifyBox={notifyBox}
                                                              className={customclass.subnetForm}
                                                              variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>
                                        <br/><br/>
                                    </Grid>
                                )}
                                handleChange={handleChange}
                                errorChange={error => {
                                    let newErrorStates = [...errorsState];
                                    newErrorStates[activeStage] = error;
                                    setErrorsState(newErrorStates);
                                }}
                            />
                        </div>
                    </Paper>
                    <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                        {activeStage !== 0 && <Button
                            color="inherit"
                            onClick={handleBack}
                            sx={{mr: 1}}
                            variant={"outlined"}
                        >
                            Back
                        </Button>}
                        {activeStage === 0 && <Button
                            color="inherit"
                            onClick={handleCloseStepper}
                            sx={{mr: 1}}
                            variant={"outlined"}
                        >
                            Back
                        </Button>}
                        <Box sx={{flex: '1 1 auto'}}/>
                        <Button disabled={disableSubmit} onClick={handleNext} variant={"outlined"}>
                            {activeStage === templates.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
        <p>
            <Divider/>
        </p>

    </div>)
}
