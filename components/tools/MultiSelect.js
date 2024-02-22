import React, {useEffect} from 'react';
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import theme from "../theme/theme";
import {makeStyles} from "@material-ui/styles";
import Chip from "@material-ui/core/Chip";
import PropTypes, {array} from 'prop-types';
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme) => ({
    select: {
        width: "100%",
    },
    chipContainer: {
        width: "100%",
        display: 'flex',
        justifyContent: 'right',
        flexWrap: 'wrap',
        listStyle: 'none',
        paddingTop: theme.spacing(1),
        margin: 0,
    },
    chip: {
        marginTop: theme.spacing(1),
    },
}));

export default function MultiSelect(props) {
    const classes = useStyles(theme);
    const [options, setOptions] = React.useState([...props.options]);
    const [values, setValues] = React.useState(Array.isArray(props.value) ? [...props.value] : []);
    const [error, setError] = React.useState(props.error);

    const event = {
        target: {
            name: props.name,
            id: props.id,
            value: props.value,
        }
    }

    const handleChange = (values) => {
        event.target.value = values;
        props.onChange(event);
    }

    useEffect(() => {
        setOptions([...props.options]);
    }, [props.options]);

    useEffect(() => {
        let newValues = Array.isArray(props.value) ? [...props.value] : [];
        setValues(newValues);
        let newOptions = props.options.filter(e => !newValues.some((element) => element == e));
        newOptions.sort();
        setOptions(newOptions);
    }, [props.value]);

    useEffect(() => {
        setError(props.error);
    }, [props.error]);

    return (
        <div>
            <FormControl variant="outlined" className={classes.select} error={error}>
                <Select
                    value={""}
                    onChange={(e) => {
                        if (e.target.value && e.target.value !== "") {
                            let newValues = [...values];
                            if (!props.type || props.type !== "number") {
                                newValues.push(e.target.value);
                            } else {
                                newValues.push(parseInt(e.target.value));
                            }
                            newValues.sort();
                            handleChange(newValues);
                        }
                    }}
                    size={"small"}
                    sx={{width: 195}}
                >
                    <MenuItem value="" disabled>Choose...</MenuItem>
                    {
                        options ? options.map(value => {
                            return (
                                <MenuItem value={value} key={value}>{value}</MenuItem>
                            )
                        }) : null
                    }
                </Select>
            </FormControl>
            <div sx={{display: 'flex', flexWrap: 'wrap'}}>
                {values.map((v) => {
                    return (
                        <li key={v}>
                            <Chip
                                color="primary"
                                label={v}
                                onDelete={() => {
                                    let newValues = values.filter((value) => {
                                        return value !== v;
                                    });
                                    handleChange(newValues);
                                }}
                                className={classes.chip}
                            />
                        </li>
                    );
                })}
            </div>
        </div>
    )
}

MultiSelect.propTypes = {
    error: PropTypes.bool,
    options: PropTypes.array,
    onChange: PropTypes.func,
};