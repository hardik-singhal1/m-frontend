import React, {useCallback, useEffect, useState, useContext} from 'react'
import {Box, Checkbox, Typography} from "@mui/material";
import {Divider, Grid, TextField} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {Button} from "@mui/material";
import {DatePicker} from "@mui/lab";
import Autocomplete from "@mui/material/Autocomplete";
import DialogBox from "./DialogBox";
import {hostport} from "../next.config";
import {createDetails, getDetails, updateDetails} from "../utils/fetch-util";
import {ErrorContext} from "../lib/errorContext";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import {styled} from "@mui/material/styles";
import Tooltip, {tooltipClasses} from "@mui/material/Tooltip";
import {AuthContext} from "../lib/authContext";
import {useRouter} from "next/router";


export default function CreateAccessToken({close}) {
    const router = useRouter();
    const {organization_name} = router.query;
    const [value, setValue] = React.useState(new Date());
    const {userData} = useContext(AuthContext)
    const d = new Date().toLocaleDateString()
    const {errorTrigger} = useContext(ErrorContext)
    const [orgActions, setOrgActions] = React.useState([]);
    const [projActions,setProjActions] = useState([]);
    const currentdate = new Date().getUTCFullYear() +"-"+d.slice(3,5)+"-"+new Date().getUTCDate()
    const [dates,setdates] =useState(["07 days","30 days","90 days","custom"])
    const [expiredate,setExpiredate] = useState("")
    const [rows,setRows] = useState([])
    const [date,setDate] = useState("")
    const [selected,setSelected] = useState([])
    const [notetext,setNotetext] =useState("")
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [maincheck,setMaincheck] = useState(false)
    const [projectActions,setProjectActions] = useState([{
        name: '',
        description:''
    }])
    const [projectchecked, setProjectchecked] = useState([]
    );
    const [token,setToken] = useState("")
    const actions = [];
    const[len,setLen] = useState(0)
    const projectactions = [];
    const description =[];
    const [
        actionRows,
        setActionRows
    ] = useState([
        {
            name: '',
            description:''
        }
    ]);
    const [actionDescription,setactionDescription] = useState([])
    const [createRequestBody,setCreateRequestBody] = useState({
        note : notetext,
        expiry_date:"",
        identity:userData.identity.id,
        organization_actions:orgActions,
        project_actions:projActions

    })
    var length = actionRows.length
    const [checked, setChecked] = useState(
        []
    );

const handleClose = useCallback(() =>{
    let newValue = {
        ...createRequestBody,
        name:"",
        organization_actions:[],
        project_actions:[],
        expiry_date : ""
    }
    setValue("")
    setCreateRequestBody(newValue)
    setExpiredate("")
    setChecked([])
    setProjectchecked([])
 close()
})

    const handleOpenDialog =useCallback(() => {
        setDialogOpen(true)
    })
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
    ];
    const [state, setState] = React.useState(false);


    const handleChange = (type,event) => {
        if(type === 'project')
        {
            if(maincheck === false){
                setMaincheck(true)
                for(let i=0; i<projectActions.length; i++){
                    projectchecked[i] = true
                    if( projActions.includes(projectActions[i].name))
                    {
                        continue
                    }
                    else{
                        projActions.push(projectActions[i].name)
                    }
                }
            } else{
                setMaincheck(false)
                for(let i=0; i<projectActions.length; i++){
                    projectchecked[i] = false
                    projActions.pop(projectActions[i].name)
                }

            }
            setChecked(checked)
        }
        else{
            if(state === false){
                setState(true)
                for(let i=0; i<length; i++){
                    checked[i] = true
                    if( orgActions.includes(actionRows[i].name))
                    {
                       continue
                    }
                    else{
                        orgActions.push(actionRows[i].name)
                    }

                }
            } else{
                setState(false)
                for(let i=0; i<length; i++){
                    checked[i] = false
                    orgActions.pop(actionRows[i].name)
                }
            }
            setChecked(checked)
        }

    };


    const handleOnChange = (position,type,name,check) => {
        if (type === 'project') {
            const updatedCheckedState = projectchecked.map((item, index) =>
                    index === position ? !item : item


            );
            if(check === "false"){
                for(let i= 0 ;i<projectActions.length;i++){
                    if(projectActions.length === 0)
                    {
                        projActions.push(name)
                        break
                    }
                    else if (projActions[i] !== name){
                        projActions.push(name)
                        break
                    }


                }
            }
            else{
                projActions.splice(projActions.indexOf(name),1)
            }

            setProjectchecked(updatedCheckedState)
        } else {
            const updatedCheckedState = checked.map((item, index) =>
                index === position ? !item : item,
            );
            if(check === "false"){
                for(let i= 0 ;i<actionRows.length;i++){
                    if(actionRows.length === 0)
                    {
                        orgActions.push(name)
                        break
                    }
                    else if (orgActions[i] !== name){
                        orgActions.push(name)
                        break
                    }

                }

            }
            else{
                orgActions.splice(orgActions.indexOf(name),1)
            }
            setChecked(updatedCheckedState)
        }
    }

    const handleActions = (obj,org) => {
        let val = "";
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
            }
            checked.push(false)
            const rowData = {
                name: val.Name,
                description:val.Description
            };

                actions.push(rowData)

        }
        setActionRows(actions)

    };

    const handleProjectActions = (obj) => {
        let val = "";
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
            }
            projectchecked.push(false)
            const rowData = {
                name: val.Name,
                description:val.Description
            };
            projectactions.push(rowData)

        }
        setProjectActions(projectactions)

    };

    const requestbody = {
        level : "organization",
        objid: `organizations/${organization_name}`
    }


    const getActions = () => {
        try {
            const GetActions = `${hostport}/api/v1/accesstoken/actions`
            getDetails(GetActions, "","organization",`organizations/${organization_name}`, requestbody, {
                "organization_name": organization_name
            })
                .then((res) => {
                    if (res.response_data) {
                        for (let iter = 0;iter < res.response_data[0].length; iter++) {

                            res.response_data[0][iter].id = iter + 1;
                        }
                        const obj = res.response_data[0].Actions;
                        handleActions(obj,"organization");
                    } else {
                        setActionRows([]);
                    }
                })
                .catch((err) => {
                    errorTrigger("error", JSON.stringify(err.message));
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    };

    const createAccessToken  = useCallback(() => {
            let createToken =
                hostport +
                `/api/v1/accesstoken/`;

            createDetails(createToken, "","organization",`organizations/${organization_name}`, createRequestBody, {
                "organization_name": organization_name
            })
                .then((res) => {
                    setToken(res.response_data)
                    handleOpenDialog()
                })
                .catch((err) => {
                    console.log("Error",err.message)
                });
    })

    const getProjectActions = useCallback(() => {
        try {
            const projectrequestbody = {
                level : "project"
            }
            const GetActions = `${hostport}/api/v1/accesstoken/actions`
            getDetails(GetActions, "","organization",`organizations/${organization_name}`, projectrequestbody, {
                "organization_name": organization_name
            })
                .then((res) => {
                    if (res.response_data) {
                        for (let iter = 0;iter < res.response_data[0].length; iter++) {
                            res.response_data[0][iter].id = iter + 1;
                        }
                        const obj = res.response_data[0].Actions;

                        handleProjectActions(obj,"project");
                    } else {
                        setProjectActions([]);
                    }
                })
                .catch((err) => {
                    errorTrigger("error", JSON.stringify(err.message));
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    });
    const LightTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.common.white,
            color: 'rgba(0, 0, 0, 0.87)',
            boxShadow: theme.shadows[1],
            fontSize: 11,
        },
    }));

    const handlechangeNote = useCallback((event) => {
        setNotetext(event.target.value)
    })

    useEffect(() => {
        getActions()
        getProjectActions()
    },[])



useEffect(() => {
    if(expiredate!== null) {
        if (expiredate !== 'custom') {
            let datesplit = expiredate.slice(0, 2)
            var dt = new Date();
            dt.setDate(dt.getDate() + Number(datesplit));
            const formatted = dt.toISOString() ;
            let newValue = {
                ...createRequestBody,
                note: notetext,
                organization_actions: orgActions,
                identity : userData.identity.id,
                project_actions: projActions,
                expiry_date: formatted
            }
            setCreateRequestBody(newValue)
        } else {
            let newValue = {
                ...createRequestBody,
                name: notetext,
                identity : userData.identity.id,
                organization_actions: orgActions,
                project_actions: projActions,
                expiry_date: value
            }
            setCreateRequestBody(newValue)
        }
    }

},[value,notetext,orgActions,projActions,expiredate])

    return (
        <div>
            <Grid>
            { dialogOpen?<DialogBox accessToken = {token} close={handleClose}/>:
                <Grid>
                    <Typography variant={"h4"}>New personal access token</Typography>
                    <br/>
                    <Divider/>
                    <br/>
                    <Typography variant={"caption"} style={{color: 'dimgray'}}>Personal access tokens function like
                        ordinary OAuth access tokens. They can be used instead of a password for CLI over HTTPS, or can
                        be used to authenticate to the API over Basic Authentication.</Typography>
                    <br/>
                    <br/>
                    <Typography variant={'subtitle1'}>Note :</Typography>
                    <br/>
                    <Typography variant={'caption'} fontStyle={"oblique"}>
                        What’s this token for ?
                        <br/>
                        <TextField sx={{width: 300}} size={'small'} onChange={handlechangeNote}/>
                    </Typography>
                    <br/>
                    <br/>
                    <Typography variant={'subtitle1'}>
                        Expiration :
                        <br/>
                        <br/>
                        <Grid sx={{display: 'flex', flexDirection: 'row'}}>
                            <Autocomplete
                                sx={{width: 300}}
                                options={dates}
                                autoHighlight
                                onChange={(e, newValue) => {
                                    setExpiredate(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: "new-env",
                                        }}
                                        size="small"
                                        required
                                    />
                                )}
                            />
                            <Box sx={{flexGrow: 0.1}}/>
                            {expiredate === 'custom' &&
                            <div>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        value={value}
                                        minDate={new Date()}
                                        onChange={(newValue) => {
                                            setValue(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} sx={{width: 300}}
                                                                            size={'small'}/>}

                                    />
                                </LocalizationProvider>
                            </div>
                            }
                        </Grid>

                    </Typography>
                    <br/>
                    <Typography variant={'subtitle1'}>Scopes :</Typography>
                    <br/>
                    <Typography variant={'caption'}>Scopes define the access for personal tokens.</Typography>
                    <br/>
                    <div style={{display:'flex',flexDirection:'row'}}>

                                <ol>

                                    <input type={'checkbox'} checked={state} onChange={handleChange} name="Actions"/> Organization
                                    <br/>
                                    <br/>
                                    <Divider/>
                                    <br/>

                                    <ul>
                                        {
                                            actionRows.map((e, index) => {
                                                return (
                                                    <div style={{display:'flex',flexDirection:'row'}}>
                                                        <Typography variant="caption">
                                                            <LightTooltip title={e.description}>
                                                                <InfoTwoToneIcon
                                                                    sx={{color: "lightslategrey"}}
                                                                />
                                                            </LightTooltip>
                                                        </Typography>&nbsp;&nbsp;
                                                        <input type={'checkbox'} checked={checked[index]} id={String(checked[index])}  name={e.name} onChange={(event) => handleOnChange(index,"organization",event.target.name,event.target.id)}/> &nbsp;{e.name}

                                                    </div>



                                                )
                                            })
                                        }
                                    </ul>

                                    <br/>
                                </ol>

                            <ol>
                                <Box sx={{flexGrow:1}}></Box>

                                <input type={"checkbox"} checked={maincheck} onChange={() => handleChange("project")} name="Actions"/><label> Project</label>
                                <br/>
                                <br/>
                                <Divider/>
                                <br/>

                                <ul>

                                    {
                                        projectActions.map((e, index) => {
                                            return (
                                                <div style={{display:"flex",flexDirection:'row',maxWidth:400}}>
                                                  <label>  <Typography variant="caption">
                                                      <LightTooltip title={e.description}>
                                                          <InfoTwoToneIcon
                                                              sx={{color: "lightslategrey"}}
                                                          />
                                                      </LightTooltip>
                                                  </Typography></label>&nbsp;&nbsp;
                                                    <input type={'checkbox'} checked={projectchecked[index]} id={String(projectchecked[index])} name={e.name} onChange={(event) => handleOnChange(index,"project",event.target.name,event.target.id)}/>&nbsp;{e.name}

                                                </div>


                                            )
                                        })
                                    }
                                </ul>
                                <br/>
                            </ol>
                    </div>

                    <br/>
                    <br/>
                    <Divider/>
                    <br/>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Box sx={{flexGrow: 1}}/>
                        <Button onClick={handleClose} color={"error"}>Close</Button>
                        {
                            (notetext === "" || expiredate === "" || expiredate === null || (orgActions.length == 0 && projActions.length ===0))?
                            <Button disabled={true}>Create</Button>:
                                <Button onClick={createAccessToken}>Create</Button>
                        }
                    </div>
                </Grid>
            }
            </Grid>
        </div>
    )
}
