import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import PropTypes from "prop-types";
import React, {useCallback, useEffect} from "react";
import Select from "@mui/material/Select";
import {useRouter} from "next/router";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const itemHeight = ITEM_HEIGHT * 4.0;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: itemHeight + ITEM_PADDING_TOP,
            width: 200
        }
    },
};

export default function ChangeVersion({ data ,changeVersionData}) {
    const [versionTitle, setVersionTitle ] = React.useState("default");
    const router = useRouter()
    const {organization_name: organizationName} = router.query
    const {template_name: templateName} = router.query
    const {template_type : templateType} = router.query

    const handleChange = useCallback((event) => {
        setVersionTitle(event.target.value);
    }, []);

    useEffect(() => {
        changeVersionData(versionTitle)
    },[versionTitle])

    return (
        <div style={{
            display: "flex",
            flexDirection: "row"
        }}
        >
            <FormControl
                size="small"
                sx={{
                    margin: 1,
                    width: 200
                }}
            >
                <InputLabel id="Change-Version">Select Version</InputLabel>
                <Select
                    MenuProps={MenuProps}
                    id="Change-Version"
                    input={
                        <OutlinedInput
                            label="Select Version"
                        />
                    }
                    sx={{width: 200}}
                    defaultValue={data[0].title}
                    labelId="Change-Version"
                    onChange={handleChange}
                    value={versionTitle}
                    variant="outlined"
                    onClick={(event)=> {
                        if(event.target.textContent){
                            router.replace(`/organization/${organizationName}/templates/${templateType}/${templateName}/${event.target.textContent}`)
                        }
                    }}
                >
                    {data !== null &&
                    data.map((title) => <MenuItem key={title.id} value={title.title}>{title.title}</MenuItem>)}
                </Select>
            </FormControl>
        </div>
    );
}

ChangeVersion.propTypes = {
    data: PropTypes.array.isRequired
};
