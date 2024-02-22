import Typography from "@material-ui/core/Typography";
import TerraformInputs from "./TerraformInputs";
import {useEffect, useState} from "react";
import {Divider} from "@mui/material";

function PopupHelp({terraformInfo, moduleValue, providerValue, devState}) {
    const [isOptional, setIsOptional] = useState([])
    const [isRequired, setIsRequired] = useState([])

    useEffect(() => {
        let req = []
        let opt = []
        if (terraformInfo !== undefined) {
            terraformInfo.forEach((e) => {
                if (e.required === true) {
                    req.push(e)
                } else {
                    opt.push(e)
                }
            })
            setIsOptional(opt)
            setIsRequired(req)
        }
    }, [terraformInfo])

    return (
        <>
            {(moduleValue && providerValue) || (devState) ?
                <div style={{display: 'flex', flexDirection: "column", padding: 10}}>
                    <Typography variant={"h5"}>
                        <b>Required Inputs</b>
                    </Typography>
                    <br/>
                    <Divider/>
                    <br/>
                    {isRequired.map((d) => {
                            return (
                                <TerraformInputs
                                    name={d.name}
                                    type={d.type}
                                    description={d.description}
                                />
                            )
                        }
                    )}
                    <Divider/>
                    <br/>
                    <Typography variant={"h5"}>
                        <b>Optional Inputs</b>
                    </Typography>
                    <br/>
                    <Divider/>
                    <br/>
                    {isOptional.map((d) => {
                            return (
                                <TerraformInputs
                                    name={d.name}
                                    type={d.type}
                                    description={d.description}
                                    defaultValue={d.default}
                                />
                            )
                        }
                    )}
                </div>
                :
                ""
            }
        </>
    )
}

export default PopupHelp
