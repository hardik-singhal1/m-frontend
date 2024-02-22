import TextField from "@material-ui/core/TextField";
import React, {FunctionComponent, ReactNode, useEffect, useState} from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import MultiSelect from './MultiSelect';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import { Typography } from "@material-ui/core";
import IconButton from '@mui/material/IconButton';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    ListItemText,
    Radio,
    RadioGroup
} from "@material-ui/core";
import {ErrorState, AddToObject} from '../../utils/validation'

interface Property {
    inputType: string;
    type: string;
    description: string;
    title: string;
    validation?: string;
    required?: boolean;
    multiple?: true;
    default?: string | number | boolean | Array<string | number | boolean>;
    options?: Array<string | number>;
    minimum?: number;
    maximum?: number;
    dependents?: object;
    values?: Array<string | number>
}

interface Notification {
    key: string;
    detail: any;
    error: boolean;
}

interface Event {
    target: {
        name: string;
        value: any;
    }
}
function newEvent(name: string, value: any) {
    return {
        target: {
            name: name,
            value: value,
        }
    }
}

interface DynamicBoxProps {
    name: string;
    properties: { [index: string]: Property };
    renderRow: (key: string, property: Property, data: any, notifyBox: (not: Notification) => void) => React.ReactNode;
    handleChange?: (event: Event) => void;
    errorChange?: (error: boolean) => void;
    data?: {};
}

function getNilType(property: Property): any[]|boolean|string|number|undefined {
    if (property.options) {
        return [];
    }

    switch (property.type) {
        case "string":
        case "integer":
            return "";
        case "boolean":
            return false;
    }

    return undefined;
}

function isNil(data: any): boolean {

    if (data === null) {
        return false
    }

    if (Array.isArray(data)) {
        return data.length === 0;
    }

    if (typeof data === "string") {
        return data === "";
    }

    if (typeof data === "undefined") {
        return true;
    }
}

export default function DynamicBox(props: DynamicBoxProps) {
    const [properties, setProperties] = useState(props.properties);
    const [data, setData] = useState((props.data !== undefined) ? props.data : {});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // console.log(props.properties)
        setProperties(props.properties);
        let newErrors = {};
        let newData = {};

        if (props.properties) {
            Object.keys(props?.properties).forEach(key => {

                // set indentation for dependents
                if (props.properties[key].dependents) {
                    Object.keys(props.properties[key].dependents)
                        .forEach(key1 => {
                            Object.keys(props.properties[key].dependents[key1])
                                .forEach(key2 => {
                                    props.properties[key].dependents[key1][key2].title = `\t${props.properties[key].dependents[key1][key2].title}`;
                                })
                        });
                }

                // console.log(key, props.properties[key].default, props.properties[key].required ? (!props.properties[key].default) : false)

                if (!isNil(props.properties[key].default)) {
                    newData = {...newData, [key]: props.properties[key].default};
                }
                newErrors = {...newErrors, [key]: props.properties[key].required ? (!props.properties[key].default) && (!data[key]) : false};
            });
        }
        // console.log("new", newErrors, data, newData)
        setData(newData);
        setErrors(newErrors);
    }, [props.properties]);

    useEffect(() => {
        if(props.data !== undefined) {
            setData(props.data);
        }
    }, [props.data, props.name]);

    function notifyBox(not: Notification) {
        let newData = {...data, [not.key]: not.detail};
        let newErrors = {...errors, [not.key]: not.error};

        // check if the selected property has dependents
        if (properties[not.key].dependents) {
            let newProperties = {...properties};
            let insertIndex = Object.keys(properties).findIndex(value => value === not.key) + 1;

            // push selected deps to the main properties list
            let selectedDeps = props.properties[not.key].dependents[not.detail];
            if (selectedDeps) {
                Object.keys(selectedDeps)
                    .forEach(key => {
                        newProperties = AddToObject(newProperties, key, selectedDeps[key], insertIndex++) as { [index: string]: Property };
                        newData = {...newData, [key]: selectedDeps[key].default ?
                                selectedDeps[key].default :
                                getNilType(selectedDeps[key])};
                        newErrors = {...newErrors, [key]: selectedDeps[key].required}
                    });
            }

            // remove the not selected properties from the main properties list
            let deps = props.properties[not.key].dependents;
            Object.keys(deps)
                .filter(key => key !== not.detail)
                .filter(key => properties.hasOwnProperty(Object.keys(deps[key])[0]))
                .forEach(key => {
                    Object.keys(deps[key])
                        .forEach(key1 => {
                            delete newProperties[key1];
                            delete newData[key1];
                            delete newErrors[key1];
                        });
                });
            setProperties(newProperties);
        }

        props.errorChange(Object.values(newErrors).some(e => e === true));
        props.handleChange(newEvent(props.name, newData));
        // console.log("sent", newData)
        setData(newData);
        setErrors(newErrors);
    }

    useEffect(() => {
    },[errors])

    return (<React.Fragment>
        {
            properties &&
            Object?.keys(properties)?.map(key => {
                return(
                    // whiteSpace is set to pre-wrap to enable indentations for the dependents
                    <div>
                        <div style={{whiteSpace: "pre-wrap"}}>
                            {
                                props.renderRow(key, properties[key], data[key], notifyBox)
                            }
                        </div>
                        {/*{*/}
                        {/*    properties[key].description != "" &&*/}
                        {/*    <div>*/}
                        {/*        <Typography variant="caption">*/}
                        {/*            <Tooltip title={properties[key].description} componentsProps={{*/}
                        {/*                tooltip: {*/}
                        {/*                    sx: {*/}
                        {/*                        bgcolor: 'common.black',*/}
                        {/*                        '& .MuiTooltip-arrow': {*/}
                        {/*                            color: 'common.black',*/}
                        {/*                        },*/}
                        {/*                    },*/}
                        {/*                },*/}
                        {/*            }}>*/}
                        {/*                <IconButton>*/}
                        {/*                    <InfoTwoToneIcon sx={{color: "lightsteelblue"}}/>*/}
                        {/*                </IconButton>*/}
                        {/*            </Tooltip>*/}
                        {/*        </Typography>*/}
                        {/*    </div>*/}
                        {/*}*/}
                    </div>
                )
            })
        }
    </React.Fragment>)
}

interface DynamicFieldProps {
    // for some reason "key" is not working, props is received always as undefined, so using "KEY"
    KEY: string;
    property: Property;
    data: any;
    notifyBox: (not: object) => void;
    [index: string]: any;
}

export function DynamicField(props: DynamicFieldProps) {
    const [property, setProperty] = useState(props.property);
    const [errorState, setErrorState] = useState<ErrorState>(new ErrorState(props.property.required ? isNil(props.data) : false, ''));
    const [detail, setDetail] = useState<string | number | boolean | Array<string | number | boolean>>(typeof props.data !== "undefined" ? props.data : (props.property.default ? props.property.default : getNilType(props.property)));

    useEffect(() => {
        setProperty(props.property);
        setErrorState(new ErrorState(props.property.required ? isNil(props.property.default) && isNil(props.data) : false, ''));
    }, [props.property]);

    useEffect(() => {
        setDetail(typeof props.data !== "undefined" ? props.data : (props.property.default ? props.property.default : getNilType(props.property)));
    }, [props.data]);

    function onChange(event) {
        let newErrorState = new ErrorState(false, '');
        if (props.property.validation) {
            let regex = RegExp(props.property.validation);
            if (regex.test(event.target.value)) {
                newErrorState = new ErrorState(false, '');
            } else {
                if (event.target.value) {
                    newErrorState = new ErrorState(true, "Not Valid!");
                } else if(props.property.required) {
                    newErrorState = new ErrorState(true, "");
                } else {
                    newErrorState = new ErrorState(false, '');
                }
            }
        }
        if (props.property.required) {
            if (!event.target.value || event.target.value.length == 0) {
                newErrorState = new ErrorState(true, "");
            } else if (!props.property.validation) {
                newErrorState = new ErrorState(false, '');
            }
        }
        // console.log("heree", event.target.value, newErrorState.state);
        props.notifyBox({key: props.KEY, detail: event.target.value, error: newErrorState.state});
        setDetail(event.target.value);
        setErrorState(newErrorState);
    }

    function onChangeForCheckbox(event) {
        props.notifyBox({key: props.KEY, detail: event.target.checked, error: false});
        setDetail(event.target.checked);
    }

    function onChangeForRadioGroup(event) {
        props.notifyBox({key: props.KEY, detail: event.target.value === 'yes', error: false});
        setDetail(event.target.value === 'yes');
    }

    function parseComponent(property: Property) {
        let Type: FunctionComponent = null;
        let typeProps: {[index: string]:any} = {};
        let children: Array<ReactNode> = [];

        // set common props
        // typeProps.className = ?;
        typeProps.error = errorState.state;
        typeProps.helperText = errorState.reason;
        if (property.type === 'boolean') {

            if (property.inputType === "checkbox") {
                typeProps.onChange = onChangeForCheckbox;
            } else if (property.inputType === "radioGroup") {
                typeProps.onChange = onChangeForRadioGroup;
            }

        } else {
            typeProps.onChange = onChange;
        }
        // typeProps.sx = props.className;
        typeProps.variant = props.variant;
        typeProps.type = property.type;
        typeProps.value = detail;
        typeProps.size = "small";
        //typeProps.name = property.title;
        Type = InputTypes[property.inputType].create(typeProps, children, property, detail);

        return (
            React.createElement(Type, typeProps, children)
        );
    }

    return(<React.Fragment>
        {parseComponent(property)}
    </React.Fragment>)
}

const InputTypes = {
    multi_select_dropdown: {
        create: (props: {[index: string]:any}, children: Array<ReactNode>, property: Property, detail: any) => {
            props['multiple'] = true;
            props.renderValue = (selected) => { return Array.isArray(selected)? selected.join(", ") : selected};
            props.value = detail;

            children.push(
                property?.options?.map(value => (
                    <MenuItem key={value} value={value}>
                        <Checkbox color="primary" checked={detail.indexOf(value) > -1} />
                        <ListItemText primary={`${value}`} />
                    </MenuItem>
                ))
            )

            return CustomSelect;
        }
    },
    multi_select_chips: {
        create: (props: {[index: string]:any}, children: Array<ReactNode>, property: Property, detail: any) => {
            props.options = property.options;

            return MultiSelect;
        }
    },
    textfield: {
        create: (props: {[index: string]:any}, children: Array<ReactNode>, property: Property, detail: any) => {
            if (property.type === 'integer') {
                props.type = 'number';

                if (property.minimum) {
                    props.inputProps = {max: property.maximum, min: property.minimum};
                }
            }
            return TextField;
        }
    },
    select: {
        create: (props: { [index: string]: any }, children: Array<ReactNode>, property: Property, detail: any) => {
            children.push(<MenuItem value="">None</MenuItem>);
            if(property?.values){
                children.push(
                    property?.options?.map((value,index) => (<MenuItem value={property?.values[index]}>{value}</MenuItem>))
                )
            }else{
                children.push(
                     property?.options?.map((value) => (<MenuItem value={value}>{value}</MenuItem>))
                )
            }
            return CustomSelect;
        }
    },
    checkbox: {
        create: (props: { [index: string]: any }, children: Array<ReactNode>, property: Property, detail: any) => {
            children.push(
                <React.Fragment>
                    <FormControlLabel
                        control={<Checkbox checked={detail === true} color="primary" size="small"/>}
                        label=""
                    />
                </React.Fragment>
            )
            return FormControl;
        }
    },
    radioGroup: {
        create: (props: { [index: string]: any }, children: Array<ReactNode>, property: Property, detail: any) => {
            props.row = true;
            children.push(
                <React.Fragment>
                    <FormControlLabel
                        control={<Radio checked={detail === true} color="primary" size="small"/>}
                        label="yes"
                        value="yes"
                    />
                    <FormControlLabel
                        control={<Radio checked={detail != true} color="primary" size="small"/>}
                        label="no"
                        value="no"
                    />
                </React.Fragment>
            )
            return RadioGroup;
        }
    }
}

function CustomSelect(props) {
    let newProps = {...props, className: undefined};
    return (
        <FormControl sx={{width: "100%"}} >
            <Select {...newProps} size={"small"}
                    sx={{width: 195}} />
        </FormControl>
    )
}
