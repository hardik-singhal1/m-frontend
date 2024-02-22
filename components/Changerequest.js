import { AiOutlinePullRequest } from "react-icons/ai";
import { Typography } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import PropTypes from "prop-types";
import React, {useCallback, useContext, useEffect} from "react";
import Select from "@mui/material/Select";
import {AuthContext} from "../lib/authContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const itemHeight = ITEM_HEIGHT * 4.0;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: itemHeight + ITEM_PADDING_TOP,
            width: 200
        }
    }
};

export default function Changerequest({ data ,changeRequestData}) {
    const [
        crTitle,
        setCrTitle
    ] = React.useState("default");

    const handleChange = useCallback((event) => {
        setCrTitle(event.target.value);
    }, []);

    useEffect(() => {
        changeRequestData(crTitle)
    },[crTitle])

    return (
        <div style={{ display: "flex",
            flexDirection: "row" }}
        >
            <FormControl
                size="small"
                sx={{ margin: 1,
                    width: 200 }}
            >
                <InputLabel id="Change Request">
                    {
                        <Typography>
                            <AiOutlinePullRequest />
                        </Typography>
                    }{" "}
                </InputLabel>
                <Select
                    MenuProps={MenuProps}
                    id="Change Request"
                    input={
                        <OutlinedInput
                            label={<Typography>&nbsp;&nbsp;&nbsp;</Typography>}
                        />
                    }
                    sx={{width : 280}}
                    defaultValue={data[0].title}
                    labelId="Change Request"
                    onChange={handleChange}
                    value={crTitle}
                    variant="outlined"
                >

                    {data !== null &&
                        data.map((title) => <MenuItem key={title.id} value={title.title}>{title.title}</MenuItem>)}
                </Select>
            </FormControl>
        </div>
    );
}

Changerequest.propTypes = {
    data: PropTypes.array.isRequired
};
