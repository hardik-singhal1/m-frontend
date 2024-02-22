import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider, InputLabel, OutlinedInput, Select, Step, StepLabel, Stepper,
    TextField,
    Typography
} from "@material-ui/core";
import {useTheme} from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear';
import CircularProgress from '@mui/material/CircularProgress';
import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {hostport, hostport1} from "../../../../../next.config";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {createDetails, getDetails, updateDetails} from "../../../../../utils/fetch-util";
import {useRouter} from "next/router";
import CssBaseline from "@material-ui/core/CssBaseline";
import {Container} from "@mui/material";
import {ErrorContext} from "../../../../../lib/errorContext";
import {makeStyles} from "@material-ui/styles";
import {AuthContext} from "../../../../../lib/authContext";
import {styled} from "@mui/material";
import TextfieldInfo from "../../../../../components/TextfieldInfo";
import {IconButton} from "@mui/material";
import {Delete, PhotoCamera} from "@material-ui/icons";
import {Addchart} from "@mui/icons-material";
import {GridAddIcon} from "@material-ui/data-grid";
import Autocomplete from "@mui/material/Autocomplete";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {DatePicker} from "@mui/lab";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import FormControl from "@mui/material/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@mui/material/Chip";
import DynamicBox, {DynamicField} from "../../../../../components/tools/DynamicBox";
import _ from "lodash";
import UseStyle from "../../../../../components/styles";
import {anyStateTrue, ErrorState} from "../../../../../utils/validation";
import yaml from "js-yaml";
import TemplateStepper from "../../../../../components/templates/TemplateStepper";
import axios, {post} from "axios";
import {detect} from "detect-browser";
import {SnackbarContext} from "../../../../../lib/toaster/SnackbarContext";
import { Icon } from '@iconify/react';
import cubeFill from "@iconify/icons-eva/cube-fill";
const browser = detect();

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
}));

const ListItem = styled('li')(({theme}) => ({
    margin: theme.spacing(0.5),
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const initialState = {
    disableSubmit: true,
    errorStates: {
        resource_type: new ErrorState(true, ''),
        data: new ErrorState(true, '')
    },
    details: {
        resource_type: '',
        data: {},
    }
}

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const useStyle = makeStyles(UseStyle);

export default function CreateProject() {
    const classes = useStyles();
    const [credentials,setCredentials] = useState([]);
    const [cloudCredentails,setCloudCredentials] = useState("");
    const [azureRegion,setAzureRegion] = useState();
    const [regionOptions,setRegionOptions] = useState([{label:"Central India",value:"ci"},{label:"South India",value:"si"}])
    const customclass = useStyle();
    const { setSnackbar } = useContext(SnackbarContext);
    const [error, setError] = useState(false)
    const uploadInputRef = useRef(null);
    const d = new Date().toLocaleDateString()
    const currentdate = new Date().getUTCFullYear() + "-" + d.slice(3, 5) + "-" + new Date().getUTCDate()
    const router = useRouter();
    const {errorTrigger} = useContext(ErrorContext);
    const [rows, setRows] = useState([])
    const [organizationName,setOrganizationName] = useState("");
    const {userData} = useContext(AuthContext);
    const [disaster, setDisaster] = useState(["HIGH", "MODERATE", "LOW"])
    const [rpo, setRpo] = useState("")
    const [rto, setRto] = useState("")
    const [envRequestArr, setEnvRequestArr] = useState(["PRD","UAT", "DEV"])
    const [cloudProvider, setCloudProvider] = useState(["AWS", "Google", "Azure"])
    const [foldersList, setFoldersList] = useState([])
    const [folders, setFolders] = useState("")
    const [roleUsers, setRoleUsers] = useState([]);
    const [gitCredID, setGitCredID] = useState("/organizations/mahindra-and-mahindra/bitbucket/aravindarc");
    const [selectedCredName, setSelectedCredName] = useState("bitbucket/aravindarc");
    const [workspace, setWorkspace] = useState("")
    const [gitId, setGitId] = useState("")
    const [git, setGit] = useState("")
    const [openDialog, setOpenDialog] = useState(false)
    const [folderSelected, setFolderSelected] = useState(false)
    const [disableSubmit, setDisableSubmit] = useState(initialState.disableSubmit);
    const [errorStates, setErrorStates] = useState(initialState.errorStates);
    const [detailsTemplate, setDetailsTemplate] = useState(_.cloneDeep(initialState.details));
    const [templateValues, setTemplateValues] = useState([])
    const [schemaValues, SetScehmaValues] = useState([])
    const [properties, setProperties] = useState([]);
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const BU_options= [
        {
            label:"CERO",
            value:"ou-n3ro-gm24454e"
        },
        {
            label: "Farm Equipment",
            value:"ou-n3ro-mw627xyh"
        },
        {
            label:"Gromax Agri Equipment ltd",
            value:"ou-n3ro-yi6e4cja"
        },
        {
            label:"Group Corporate (GCO)",
            value:"ou-n3ro-u4br8odx"
        },
        {
            label:"Mahindra Aerospace ltd",
            value:"ou-n3ro-wei1ug9m"
        },
        {
            label:"Mahindra Agri",
            value:"ou-n3ro-7y7h1oez"
        },
        {
            label:"Mahindra Auto Division",
            value:"ou-n3ro-mwrzaadz"
        },
        {
            label:"Mahindra Construction Equipment",
            value:"ou-n3ro-fakxz62a"
        },
        {
            label:"Mahindra Consulting Engineering",
            value:"ou-n3ro-2l0amf4n"
        },
        {
            label:"Mahindra Electric",
            value:"ou-n3ro-p72fidss"
        },
        {
            label:"Mahindra Farm Division",
            value:"ou-n3ro-76iprtav"
        },
        {
            label:"Mahindra First choice services",
            value:"ou-n3ro-o7d8csw3"
        },
        {
            label:"Mahindra First choice wheels",
            value:"ou-n3ro-pa57n523"
        },
        {
            label:"Mahindra Gears and Transformation",
            value:"ou-n3ro-wjz0gsye"
        },
        {
            label:"Mahindra Integrated Busniess Solutions",
            value:"ou-n3ro-8b4smrb0"
        },


        {
            label:"Mahindra Lifespace Developers Ltd",
            value:"ou-n3ro-4tspo10r"
        },
        {
            label:"Mahindra Logistics Ltd",
            value:"ou-n3ro-qrsnm1xb"
        },
        {
            label:"Mahindra Marine Pvt Ltd.",
                value:"ou-n3ro-25645089"
        },
        {
            label:"Mahindra Racing",
                value:"ou-n3ro-0ftthgo2"
        },
        {
            label:"Mahindra Special Services Group",
            value:"ou-n3ro-2wo0dutv"
        },
        {
            label:"Mahindra Susten Pvt Ltd",
            value:"ou-n3ro-zf3uuzmz"
        },
        {
            label:"Mahindra Truck & Bus Division",
            value:"ou-n3ro-hpowzekt"
        },
        {
            label:"Mahindra Two wheelers Ltd",
            value:"ou-n3ro-47p69cfx"
        },
        {
            label:"Mahindra USA Inc",
            value:"ou-n3ro-ihms2mum"
        },
        {
            label:"Mahindra Ugine Steel Company",
            value:"ou-n3ro-4s22k0pe"
        },
        {
            label:"Mahindra United Ball",
            value:"ou-n3ro-jh3mefnp"
        },
        {
            label:"SBU",
            value:"ou-n3ro-k8tw7ksz"
        },
        {
            label:"SSU",
            value:"ou-n3ro-qnf3gbnz"
        },
        {
            label:"Swaraj Division",
            value:"ou-n3ro-h3yhaatu"
        },
        {
            label:"TEQO",
            value:"ou-n3ro-unbb4y9i"
        },
        {
            label:"Mahindra Research Valley",
            value:"ou-n3ro-mo20u68w"
        },
        {
            label:"Mahindra Intertrade Ltd",
            value:"ou-n3ro-65b5uarn"
        },
        {
            label:"Mahindra Digital Engine",
            value:"ou-n3ro-2wdnutqw"
        },
        {
            label:"Group Strategy Office (GSO)",
            value:"ou-n3ro-ux25ky2b"
        },
        {
            label:"Sandbox",
            value:"ou-n3ro-y7pdlpgj"
        },
        {
            label:"Corporate IT",
            value:"ou-n3ro-vism6h4b"
        },
        {
            label:"Landing zone Infra",
            value:"ou-n3ro-em1mz5yb"
        },
        {
            label:"Shared VPC",
            value:"ou-n3ro-7v4eq135"
        },
        {
            label:"Security",
            value:"ou-n3ro-y4zlbxam"
        },
        {
            label:"Account Factory Terraform",
            value:"ou-n3ro-byat10d7"
        },
        {
            label:"Others",
            value:"ou-n3ro-rgonwmxk"
        },
        {
            label:"Mahindra & Mahindra Financial Services Ltd",
            value:"ou-n3ro-x5mlc3pi"
        }
    ]


    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name);
        }
    },[router])

    useEffect(()=>{
        if(organizationName!==""){
            getCredentials();
        }
    },[organizationName])

    const getCredentials = () => {
        try {
            let Getcredentials =
                hostport +
                `/api/v1/organizations/${organizationName}/credentials/`;

            getDetails(Getcredentials, "","","","")
                .then((res) => {
                    if (res.response_data === null) {
                        setCredentials([]);
                    } else {
                        let temp=[];
                        res.response_data.forEach((item)=>{
                            if(item.cloud==="azurerm")
                                temp.push(item.name);
                        })
                        setCredentials(temp);
                    }
                })
                .catch((err) => {
                    console.log(err.message)
                });
        } catch (err) {
            console.log(err.message)
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const [
        selectedFile,
        setSelectedFile
    ] = useState(null);

    const [
        enValue,
        setEn
    ] = useState({
        configurations: {
            outputs: [],
            variables: []
        },
        id: "",
        modules: [],
        name: ""
    });

    const [
        templatesList,
        setTemplatesList
    ] = useState([])

    const [
        schemaList,
        setSchemaList
    ] = useState([])

    const [
        users,
        setUsers
    ] = useState([]);

    const [
        commisondate,
        setCommisondate
    ] = React.useState(new Date())

    const [
        decommisondate,
        setDecommisondate
    ] = React.useState("")

    const [
        projectName,
        setProjectName
    ] = React.useState("");

    const [
        projectOwner,
        setProjectOwner
    ] = React.useState("")

    const [
        applicationTechnicalGroup,
        setApplicationTechnicalGroup
    ] = React.useState("")

    const [
        name,
        setName
    ] = React.useState("")

    const [
        contact,
        setContact
    ] = React.useState("")

    const [
        email,
        setEmail
    ] = React.useState("")

    const [
        availability,
        setAvailability
    ] = React.useState("")

    const [
        organizationnameselect,
        setOrganizationnameselect
    ] = React.useState(organizationName)

    useEffect(()=>{
        if(router.isReady){
            setOrganizationnameselect(router.query.organization_name)
        }
    },[router])

    const [
        bussinessunit,
        setBussinessunit
    ] = React.useState("")

    const [
        costcenter,
        setCostcenter
    ] = React.useState("")

    const [
        costcenterpercentage,
        setCostcenterpercentage
    ] = React.useState("")

    const [
        crossorganization,
        setCrossorganization
    ] = React.useState("")

    const [
        disasterval,
        setDisasterval
    ] = useState(["YES", "NO"])

    const theme = useTheme();

    const [
        template,
        setTemplate
    ] = useState([]);

    const [
        disval,
        setDisval
    ] = useState("NO")

    const [
        environmentrequest,
        setEnvironmentRequest
    ] = React.useState("")

    const [
        operationalSupport,
        setOperationalSupport
    ] = React.useState("No")

    const [
        complianceValue,
        setComplianceValue
    ] = React.useState("STD")

    const [
        cloud,
        setCloud
    ] = React.useState("")

    const [
        disasterrecovery,
        setDisasterrecovery
    ] = React.useState("")

    const [
        backupdetails,
        setBackupdeatils
    ] = React.useState("")

    const [
        drhrarequirement,
        setDrhrarequirement
    ] = React.useState("")

    const [
        details,
        setDetails
    ] = React.useState("")

    const [
        stepperEnable,
        setStepperEnable
    ] = useState(false)

    const [chipData, setChipData] = React.useState([]);

    const [repoCreation, setRepoCreation] = useState({
        id: "",
        organization: workspace,
        project: projectName,
        git: ""
    })



    const yesNoOption = [
        'Yes',
        'No'
    ]

    const complianceOption = [
        'STD',
        'PDPA/GDPR'
    ]

    const [createProjectPayload, setCreateProjectPayload] = React.useState({
        environments: [],
        id: "",
        modules: [],
        name: projectName,
        organization_id: "",
        credential_id: gitCredID,
        work_space: workspace,
        tags: {
            project_owner: projectOwner,
            project_owner_ID: assignOwner,
            name: name,
            contact: contact,
            email: email,
            commission_date: commisondate,
            de_commisssion_date: String(decommisondate),
            organization_name: String(organizationnameselect),
            business_unit: bussinessunit.label,
            aws_business_unit_id : bussinessunit.value,
            cost_centre: chipData,
            cross_org: crossorganization,
            details_and_attachments: details,
            environment_request: environmentrequest,
            disaster_recovery: {
                rto: rto,
                rpo: rpo
            },
            backup_details: backupdetails,
            drhrarequirement: drhrarequirement,
            cloud: cloud,
            folder: folders,
            operational_support_by: operationalSupport,
            compliance: complianceValue,
            application_technical_group: applicationTechnicalGroup,
            availability:availability,
            requester_name: userData?.identity?.traits?.first_name
        }
    })

    let headerObject = ""
    let assignHeader = ""

    useEffect(() => {
        if (router.isReady) {
            headerObject = `organizations/${organizationName}`;
            assignHeader = `organizations/${organizationName}/projects/${projectName}`
        }
    })

    useEffect(() => {
        let arr = []
        template.map(async (e) => {
            let getTemplates = `${hostport}/api/v1/organizations/${organizationName}/templates/${e}/schema`
            await getDetails(getTemplates, "", "", "", "")
                .then((t) => {
                    let templateSchema = {
                        name: e,
                        schema: t.response_data
                    }
                    let prop = []
                    if (!arr.includes(templateSchema) && !schemaList.includes(templateSchema)) {
                        arr.push(templateSchema)
                        setSchemaList(arr)
                        arr.map((a) => {
                            const schema = yaml.load(a.schema);
                            if (!prop.includes(schema.properties) && !properties.includes(schema.properties)) {
                                prop.push(schema.properties)
                                setProperties(prop)
                                setDetailsTemplate({...detailsTemplate, resource_type: a.name});
                                setErrorStates({...errorStates, resource_type: new ErrorState(cloud === '', '')});
                            }
                        })
                    }

                })
                .catch((err) => console.log("Error", err))
        })
    }, [template])

    function getEnvironments(data) {
        try {
            const GetEnvironment = `${hostport}/api/v1/organizations/${organizationName}/projects/${data}/environment/`;

            getDetails(GetEnvironment, "", "", "", "")
                .then((res) => {
                    let filter = res.response_data.filter((event) => event.id.includes(`/organization/${organizationName}/projects/${data}/`));

                    if (filter.length === 0) {
                        filter = "Default";
                    } else {
                        filter = filter[0].name;
                    }

                    // SetEnvironment(filter);
                    router.replace(`/organization/${organizationName}/projects/${data}/environment/${filter}`);
                })
                .catch((err) => {
                    errorTrigger("error", JSON.stringify(err.message));
                });
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    }

    const onClick = useCallback(() => {
        setProjectName(`${name}`);
        getEnvironments(`${name}`);
    }, [
        name,
        setProjectName
    ], [router]);

    const [userlist, setUserlist] = React.useState([])

    const handleClose = useCallback(() => {
        console.log("formsubmited")
        router.push(`/organization/${organizationName}/projects`)
    });

    const handleOpenStepper = useCallback(() => {
        setStepperEnable(true)
    });

    const handleCloseStepper = useCallback(() => {
        setStepperEnable(false)
    });

    const [otherName, setOtherName] = useState("")

    useEffect(() => {
        setChipData(chipData)
        const formData = new FormData();
        if(selectedFile){
            formData.append(
                "myFile",
                selectedFile,
                selectedFile.name
            );
        }
        const newvalue = {
            ...createProjectPayload,
            cloud_credentials:`organizations/${organizationName}/credential/${cloud==="Azure"?"azurerm":cloud}/${cloudCredentails}`,
            tags: {
                projectName: projectName.toLowerCase(),
                project_owner: projectOwner,
                project_owner_ID : assignOwner,
                name: name === "Others" ? otherName : name,
                contact: contact,
                email_id: email,
                commission_date: String(commisondate),
                de_commission_date: String(decommisondate),
                organization_name: organizationnameselect,
                business_unit: bussinessunit.label,
                aws_business_unit_id : bussinessunit.value,
                cost_centre: chipData,
                cross_org: crossorganization,
                details_and_attachments: details,
                environment_request: environmentrequest,
                disaster_recovery: {
                    rpo: rpo,
                    rto: rto
                },
                backup_details: backupdetails,
                drhrarequirement: drhrarequirement,
                folder: folders,
                cloud: cloud,
                operational_support_by: operationalSupport,
                compliance: complianceValue,
                application_technical_group: applicationTechnicalGroup,
                availability:availability,
            }
        }
        setCreateProjectPayload(newvalue)
    }, [projectName, projectOwner, name, contact, email, commisondate, decommisondate,
        organizationnameselect, bussinessunit, costcenter, costcenterpercentage, chipData,
        crossorganization, details, environmentrequest, rpo, rto, disaster, backupdetails,
        drhrarequirement, folders, cloud,cloudCredentails, selectedFolder,operationalSupport,complianceValue,applicationTechnicalGroup,availability,assignOwner])


    useEffect(() => {
        let newvalue = {
            ...repoCreation,
            id: gitId,
            organization: workspace,
            project: projectName,
            git: git
        }
        setRepoCreation(newvalue)
    }, [workspace, projectName, gitCredID])

    useEffect(() => {
        if(cloud === "Google"){
            setTemplatesList(["project_setup"])
        }else if(cloud === "Azure"){
            setTemplatesList(["resource_group"])
        }
        // if (cloud !== "AWS") {
        //     try {
        //         const GetTemplates = `${hostport}/api/v1/organizations/${organizationName}/templates/`;
        //
        //         getDetails(GetTemplates, "", "", "")
        //             .then((res) => {
        //                 if (res.response_data) {
        //                     setTemplatesList(res.response_data)
        //                 } else {
        //                     setTemplatesList([])
        //                 }
        //             })
        //             .catch((err) => {
        //                 console.log("Error", error.message)
        //             });
        //     } catch (err) {
        //         console.log("Error", error.message)
        //     }
        // }
    }, [cloud])

    const [assignRoleValue, setAssignRoleValue] = useState({
        level: "",
        object: "",
        role: "",
        subject: ""
    });
    const [roleAssign, setRoleAssign] = useState(false)
    const [assignOwner, setAssignOwner] = useState([])

    const [data, setData] = useState([])

    useEffect(() => {
        userlist.filter((users) => {
            if (users.name === projectOwner)
                setAssignOwner(users.id)
        })
    }, [projectOwner, userlist])

    useEffect(() => {
        assignRoleValue.level = "project";
        assignRoleValue.object = `organizations/${organizationName}/projects/${projectName}`
        assignRoleValue.role = "role::project_owner";
        assignRoleValue.subject = ["identity::" + assignOwner];
    }, [organizationName, projectName, projectOwner, assignOwner])


    // const assignProjectOwner = useCallback((e) => {
    //     try {
    //         const assignRole = `${hostport}/api/v1/iam/roles/assign`;
    //         createDetails(assignRole, "", "project", assignHeader, assignRoleValue)
    //             .catch((err) => {
    //                 e.preventDefault()
    //                 e.preventDefault()
    //                 console.log("error", JSON.stringify(err.message));
    //             });
    //     } catch (err) {
    //         console.log("error", JSON.stringify(err.message));
    //     }
    // })

    function getBranchName(userData) {

        let randomstring = (Math.random() + 1).toString(36).substring(7);

        if (userData !== undefined) {
            if (userData.identity.traits.first_name !== undefined) {
                return `${projectName}${userData.identity.traits.first_name}-${randomstring}`
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    function createProjectFunc(createProject,e){
        e.preventDefault()
        const formData = new FormData();
        formData.append('file_input',selectedFile);
        let temp={};
        if(cloud==="Azure"){
            let checkCred = false;
            credentials.forEach((item)=>{
                if(item.includes(environmentrequest?.toLowerCase()) && item.includes(azureRegion?.value)){
                    checkCred=true;
                    temp={
                        ...createProjectPayload,
                        cloud_credentials:`organizations/${organizationName}/credential/${cloud==="Azure"?"azurerm":cloud}/${item}`
                    }
                    formData.append("params", JSON.stringify(temp));
                }
            })
            e.preventDefault()
            if(!checkCred){
                setSnackbar("Credentials not found","error");
                e.preventDefault()
                return;
            }
        }else{
            formData.append("params", JSON.stringify(createProjectPayload));
        }

        const config = {
            "content-type": "multipart/form-data",
            "Authorization": "Bearer",
            "Accept":"*/*",
            "Level": "",
            "Objid": "",
            "Accept-Encoding":"gzip, deflate, br",
            withCredentials:true
        }
        let uid=Math.floor((Math.random() * 10000) + 1);
        setSnackbar("Creating Project ...","loading",uid)
        axios.post(createProject, formData, config).then((response) => {
            setSnackbar("Project created successfully","success",uid)
            // adding the next api call here ensures that the assignProjectOwner function is called
            // only after the promise is returned (after project is created)..
            // Using this function call outside "then" results in parallel api calls which
            // fails to assign "project_owner" role

            let newValueTest = {
                template : template,
                dynamic_values : templateValues,
                project: projectName,
                environment : environmentrequest
            }
            let generateTemplateUrl = `${hostport}/api/v1/organizations/${organizationName}/templates/generate`
            createDetails(generateTemplateUrl,"","","",newValueTest)
                .then((res) => {
                    if(res.response_data) {
                        for(var i=0;i<res.response_data.length;i++) {
                            if(res.response_data[i].name === "variables.tfvars"){
                                res.response_data[i].name = `variables.${environmentrequest}.tfvars`
                            }
                        }

                        let file_name = res.response_data.map((e) => e.name)
                        let file_contents = res.response_data.map((e) => e.contents)
                        // assignProjectOwner(e)
                        let branchName = getBranchName(userData)

                        let gitworkflow = {
                            project_id: `organizations/${organizationName}/projects/${projectName}`,
                            bitbucket_project: projectName,
                            bitbucket_org: organizationName,
                            raised_by_id: userData.identity.id,
                            source_branch: "master",
                            branch_name: branchName,
                            pr_name: branchName + "-pr",
                            files: file_name,
                            file_contents: file_contents,
                        }

                        const createCommit = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentrequest}/modules/workflow/startgitworkflow`;
                        try {
                            createDetails(createCommit, "", "", "", gitworkflow)
                                .then(r => {
                                    handleClose();
                                    // setSnackbar("Project Created Successfully","success")
                                })
                                .catch(err => {
                                    e.preventDefault()
                                    e.preventDefault()
                                    console.log(err)
                                })
                        } catch (err) {
                            if (e.response.status === 409) {
                                setSnackbar("another change request already exists, please close it first before doing other changes","error");
                            }
                            else setSnackbar(err.response?.data?.response_message || err.message,"error")
                            return
                        }
                    }else{
                        handleClose();
                        // setSnackbar("Project Created Successfully","success")
                    }
                })
                .catch((err) => {
                    setSnackbar(err.response?.data?.response_message || err.message,"error")
                })
        })
            .catch((err) => {
                setSnackbar(err.response?.data?.response_message || err.message,"error",uid)
                // if the complete project creation happens successfully
                // assignProjectOwner function call can be removed from this line
                // this call has been added only for testing purpose as repo creation was failing and giving a rejection in promise

                e.preventDefault()
            });

        e.preventDefault()
    }

    const handleCloseCreate = useCallback((e) => {
        try {
            const createProject = `${hostport}/api/v1/organizations/${organizationName}/upload`;
            let temp = 0;
            console.log(Number(costcenterpercentage),chipData.length)
            if(Number(costcenterpercentage) === 100 && !chipData.length) {
                createProjectFunc(createProject,e)
                // create(createProject,e)
            }else {
                temp = Number(costcenterpercentage)
                for (let i = 0; i < chipData.length; i++) {
                    temp += Number(chipData[i].percentage)
                    if (temp === 100) {
                        createProjectFunc(createProject,e)
                        // create(createProject,e)
                    } else if ((temp < 100 && i === chipData.length - 1) || temp > 100) {
                        console.log("error")
                        e.preventDefault()
                        e.preventDefault()
                        setError(true)
                    }
                }
            }
        } catch (err) {
            errorTrigger("error", JSON.stringify(err.message));
        }
    }, [
        organizationName,
        createProjectPayload,
        projectName,
        enValue,
        templateValues
    ]);

    const Item = styled(Paper)(({theme}) => ({
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const [selectedFolder, setSelectedFolder] = useState("")

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    };

    useEffect(() => {
        setChipData([])
    }, [])

    const getIdentity = () => {
        try {
            const GetUsers = `${hostport}/api/v1/iam/identities`;
            getDetails(GetUsers, "", "organization", headerObject)
                .then((res) => {
                    let tempArr = [];
                    for (let iter = 0; iter < res.response_data.length; iter++) {
                        setUserlist(res.response_data)
                        if (!users.includes(res.response_data[iter].name)) {
                            let userData = res.response_data[iter].name
                            tempArr.push(userData);
                        }
                    }
                    setUsers(tempArr.sort())
                })
                .catch((err) => {
                    console.log("Error", error.message)
                });
        } catch (err) {
            console.log("Error", error.message)
        }
    };

    const getRoleUsers = () => {
        try {
            const GetRoleUsers = `${hostport}/test/users`;

            const GetRoleUsersValue = {
                role: {
                    id: "role::organization_owner"
                },
                object: `organizations/${organizationName}`,
                level: "organization"
            }
            getDetails(GetRoleUsers, "", "organization", headerObject, GetRoleUsersValue)
                .then((res) => {
                    for (var iter = 0; iter < res.response_data.length; iter++) {
                        if (!roleUsers.includes(res.response_data[iter].name)) {
                            roleUsers.push(res.response_data[iter].name)
                        } else {
                            roleUsers.pop(res.response_data[iter].name)
                        }

                    }
                })
                .catch((err) => {
                    console.log("error", JSON.stringify(err.message));
                });
        } catch (err) {
            console.log("error", JSON.stringify(err.message));
        }
    };

    function getRows() {
        try {
            var Getcredentials = `${hostport}/api/v1/organizations/${organizationName}/settings/git/credentials`;

            getDetails(Getcredentials, "", "", "", "")
                .then((res) => {
                    if (res.response_data) {
                        setRows(res.response_data)
                    } else {
                        setRows([])
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
        if (organizationName) {
            getIdentity();
            getRoleUsers();
            getRows();
        }
    }, [organizationName]);


    const onClickAddCostCenter = (costcentrename, percentage) => () => {
        if (costcentrename.length > 0 || !costcentrename.includes(" ") || percentage.length > 0 || !percentage.includes(" ")) {
            let uid=Math.floor((Math.random() * 10000) + 1);
            setSnackbar("verifying cost centre","loading",uid)
            getDetails(`${hostport}/api/v1/organizations/${organizationName}/SAP/${costcentrename}`, "", "", "", "").then((r)=>{
                setSnackbar("cost centre verified","success",uid)
                chipData.push({key: chipData.length, costcentrename: costcentrename, percentage: percentage})
                setCostcenter("")
                setCostcenterpercentage("")
            }).catch((err)=>{
                setSnackbar(err.response?.data?.response_message || err.message,"error",uid)
            })
        }
    }

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleError = (newErrorStates) => {
        // console.log(newErrorStates)
    };

    useEffect(() => {

        setChipData(chipData)

    }, [chipData])

    useEffect(() => {

        const newValue = {
            ...createProjectPayload,
            id: `organizations/${organizationName}/projects/${projectName}`,
            credential_id: gitCredID,
            name: projectName,
            work_space: workspace,
            organization_id: `organizations/${organizationName}`,
            request_raised_by:`${userData?.identity?.traits?.first_name} ${userData?.identity?.traits?.last_name}`
        };

        if (newValue !== createProjectPayload) {
            setCreateProjectPayload(newValue);
        }


    }, [
        organizationName,
        projectName,
        gitCredID,
        workspace
    ]);

    const handleKeyDown = (e) => {
        if (e.key === " " || e.key === "_") {
            e.preventDefault();
        }
    };

    const handleChangeChip = (event) => {
        const {
            target: {value},
        } = event;

        console.log(value)
        setTemplate(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    function handleChange(event) {
        if (event.target.name === "resource_type") {
            let newErrorStates = {...errorStates, resource_type: new ErrorState(event.target.value === '', '')};
            setErrorStates(newErrorStates);
            setDisableSubmit(anyStateTrue(newErrorStates));

        }

        setDetailsTemplate({...detailsTemplate, [event.target.name]: event.target.value});
    }

    function handleChangeTotal(data) {
        setTemplateValues(data);
    }

    useEffect(() => {
        setFolders(selectedFolder)
    }, [selectedFolder])

    useEffect(() => {
        setFolders("")
    }, [cloud])

    return (
        <div>
            <form onSubmit={handleCloseCreate}>
                {
                    !stepperEnable &&
                    <Container component="main" maxWidth="xl">
                        <CssBaseline/>
                        <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                            <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                                <Icon
                                    icon={cubeFill}
                                    height={22}
                                    width={22}
                                    color="navy"
                                />
                                <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                                    Create Project
                                </Typography>
                            </div>
                            <div>
                                <Button
                                    onClick={handleClose}
                                    color={"error"}
                                    variant={"outlined"}
                                    size={"small"}
                                    style={{marginRight:"0.5rem"}}
                                >
                                    Cancel
                                </Button>
                                {
                                    template.length === 0 ? <Button
                                        type={"submit"}
                                        variant="contained"
                                        size={"small"}
                                    >
                                        Create
                                    </Button> : <Button
                                        variant="contained"
                                        size={"small"}
                                        // onClick={}
                                        onClick={()=>{
                                            if(projectName && projectOwner && bussinessunit && availability && environmentrequest && details && chipData.length){
                                                handleOpenStepper();
                                            }else{
                                                setSnackbar("Please fill all the required fields","warning")
                                            }
                                         }
                                        }
                                    >
                                        Next
                                    </Button>
                                }
                            </div>
                        </div>
                        <div style={{height:"70vh",overflow:"auto",paddingBottom:"1.5rem",backgroundColor:"#fafbfb",paddingLeft:"1rem",borderRadius:"16px"}}>
                            <Box sx={{flexGrow: 1}}>
                                <div  style={{display : 'flex', flexWrap:'wrap', gap:50}}>
                                    <div>
                                        <TextfieldInfo
                                            name={"Name of the Project *"}
                                            info={"Please enter a meaningful name for the Project"}
                                        />
                                        <TextField
                                            defaultValue={projectName}
                                            value={projectName}
                                            placeholder={"Project-Name"}
                                            onChange={(event) => {
                                                setProjectName(event.target.value.toLowerCase())
                                            }}
                                            onKeyDown={handleKeyDown}
                                            size="small"
                                            sx={{width: 300}}
                                            required
                                        />
                                        <TextfieldInfo
                                            name={"Project Owner Name *"}
                                            info={"Please input the Project Owner's name who owns the Project"}
                                        />
                                        <Autocomplete
                                            sx={{width: 300}}
                                            options={users.sort()}
                                            value={projectOwner}
                                            autoHighlight
                                            onChange={(e, newValue) => {
                                                setProjectOwner(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-env",
                                                    }}
                                                    size="small"
                                                    placeholder={"Project-Owner-Name"}
                                                    required
                                                />
                                            )}
                                        />
                                        {/*<TextfieldInfo*/}
                                        {/*    name={"Organization *"}*/}
                                        {/*    info={"Please enter the Organization name under which this project would fall into"}*/}
                                        {/*/>*/}
                                        {/*<TextField*/}
                                        {/*    defaultValue={organizationnameselect}*/}
                                        {/*    value={organizationnameselect}*/}
                                        {/*    onChange={(event) => setOrganizationnameselect(event.target.value)}*/}
                                        {/*    size="small"*/}
                                        {/*    sx={{width: 300}}*/}
                                        {/*    required*/}
                                        {/*/>*/}
                                        <TextfieldInfo
                                            name={"Details *"}
                                            info={"Please provide a summary for your project in 2000 characters. This summary will help in quick approvals"}
                                        />
                                        <TextField
                                            defaultValue={details}
                                            multiline
                                            rows={10}
                                            placeholder={"Project-Details"}
                                            value={details}
                                            onChange={(event) => setDetails(event.target.value)}
                                            size="small"
                                            sx={{width: 300}}
                                            inputProps={{
                                                maxLength : 2000
                                            }}
                                            required
                                        />
                                        <TextfieldInfo
                                            name={"File"}
                                            info={"Please choose the file"}
                                        />
                                        <input
                                            ref={uploadInputRef}
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={onFileChange}
                                        />

                                        <div style={{display:"flex",alignItems:"center"}}>
                                            <Button
                                                onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
                                                variant="contained"
                                                style={{marginRight:"0.5rem"}}
                                            >
                                                Upload
                                            </Button>
                                            {
                                                selectedFile ? <div style={{display:"flex",alignItems:"center"}}>{selectedFile.name} <ClearIcon sx={{"&:hover": { color: "red"}  ,"height":"1rem"}} onClick={()=>setSelectedFile(null)}/></div> : <div>No file chosen</div>
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <TextfieldInfo
                                            name={"Business Unit *"}
                                            info={"Please enter the details of the Business Unit in the Organization mentioned above"}
                                        />
                                        <Autocomplete
                                            onChange={(e, v) => {
                                                setBussinessunit(v)
                                            }}
                                            value={bussinessunit}
                                            options={BU_options}
                                            size="small"
                                            sx={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} required/>}
                                        />
                                        <TextfieldInfo
                                            name={"Availability *"}
                                            info={"Availabilty of the project"}
                                        />
                                        <TextField
                                            defaultValue={availability}
                                            value={availability}
                                            placeholder={"Availability in  %"}
                                            onChange={(event) => setAvailability(event.target.value)}
                                            size="small"
                                            sx={{width: 300}}
                                            required
                                        />
                                        <TextfieldInfo
                                            name={"Environment Request *"}
                                            info={"Please select the desired environment from the drop-down - PROD/UAT/DEV etc,."}
                                        />
                                        <Autocomplete
                                            sx={{width: 300}}
                                            options={envRequestArr}
                                            value={environmentrequest}
                                            autoHighlight
                                            onChange={(e, newValue) => {
                                                setEnvironmentRequest(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-env",
                                                    }}
                                                    size="small"
                                                    placeholder={"Environment-Request"}
                                                    required
                                                />
                                            )}
                                        />
                                        <TextfieldInfo
                                            name={"Cost Centre *"}
                                            info={"Please enter the details of the cost Centre. If the project consumes multiple cost centres, you can enter the cost centre details along with the corresponding percentage share. Please ensure all the cost center values sum upto 100"}
                                        />
                                        <div style={{ display : "flex", flexDirection : "column", gap: 10}}
                                        >
                                            {chipData.map((data) => {
                                                let icon;

                                                return (
                                                    <div key={data.key} >
                                                        <Box sx={{flexGrow: 1}}>
                                                            <div style={{display: "flex"}}>
                                                                <div style={{display: "flex", gap: 15}}>
                                                                    <div>
                                                                        <TextField
                                                                            defaultValue={data.costcentrename}
                                                                            InputProps={{
                                                                                readOnly: true
                                                                            }}
                                                                            size="small"
                                                                        />
                                                                    </div>
                                                                    <div style={{width : 65}}>
                                                                        <TextField
                                                                            defaultValue={data.percentage}
                                                                            InputProps={{
                                                                                readOnly: true
                                                                            }}
                                                                            size="small"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <IconButton>
                                                                        <Delete
                                                                            color={"error"}
                                                                            onClick={handleDelete(data)}
                                                                        />
                                                                    </IconButton>
                                                                </div>
                                                            </div>
                                                        </Box>
                                                    </div>
                                                );
                                            })}
                                            <div style={{display: "flex"}}>
                                                <div style={{display : "flex", gap:15}}>
                                                    <div>
                                                        {(createProjectPayload.tags.cost_centre.length > 0 && !createProjectPayload.tags.cost_centre.includes(" ")) ?
                                                            <TextField
                                                                defaultValue={costcenter}
                                                                value={costcenter}
                                                                placeholder={"Cost-Center"}
                                                                onChange={(event) => {
                                                                    setCostcenter(event.target.value)
                                                                }}
                                                                size="small"
                                                            /> :
                                                            <TextField
                                                                defaultValue={costcenter}
                                                                value={costcenter}
                                                                placeholder={"Cost-Center"}
                                                                onChange={(event) => {
                                                                    setCostcenter(event.target.value)
                                                                }}
                                                                size="small"

                                                            />

                                                        }
                                                    </div>
                                                    <div style={{width : 65}}>
                                                        <TextField
                                                            defaultValue={costcenterpercentage}
                                                            value={costcenterpercentage}
                                                            placeholder={"100"}
                                                            onChange={(event) => {
                                                                setCostcenterpercentage(event.target.value)
                                                            }}
                                                            size="small"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    &nbsp;&nbsp;
                                                    {
                                                        (costcenter.length > 0 && costcenterpercentage.length > 0) &&
                                                        <Button
                                                            variant={"contained"}
                                                            onClick={(costcenter.includes(" ") || costcenter.length === 0 || costcenterpercentage.includes(" ") || costcenterpercentage.length === 0) ? (() => {
                                                            }) : onClickAddCostCenter(costcenter, costcenterpercentage)}
                                                        >
                                                            Add
                                                        </Button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <TextfieldInfo
                                            name={"Application Technical Contact"}
                                            info={"Enter name of application technical contact(SPOC)"}
                                        />
                                        <TextField
                                            defaultValue={applicationTechnicalGroup}
                                            value={applicationTechnicalGroup}
                                            placeholder={"Application-technical-contact"}
                                            onChange={(event) => setApplicationTechnicalGroup(event.target.value)}
                                            size="small"
                                            sx={{width: 300}}
                                        />
                                    </div>
                                    <div>
                                        {/*<TextfieldInfo*/}
                                        {/*    name={"Select Git Credentials *"}*/}
                                        {/*    info={"Git credentials to be used for git actions"}*/}
                                        {/*/>*/}
                                        {/*<TextField*/}
                                        {/*    disabled={true}*/}
                                        {/*    rows={10}*/}
                                        {/*    value={selectedCredName}*/}
                                        {/*    size="small"*/}
                                        {/*    sx={{width: 300}}*/}
                                        {/*    required*/}
                                        {/*/>*/}
                                        {/*<br/>*/}
                                        {(rto === "HIGH" || rpo === "HIGH") && (
                                            <div>
                                                <TextfieldInfo
                                                    name={"DR/HA Requirement *"}
                                                    info={"Please enter the details of Disaster Recovery / High Availability that are required for the project"}
                                                />
                                                <TextField
                                                    defaultValue={drhrarequirement}
                                                    placeholder={""}
                                                    value={drhrarequirement}
                                                    onChange={(event) => setDrhrarequirement(event.target.value)}
                                                    size="small"
                                                    sx={{width: 300}}
                                                    required
                                                />
                                            </div>)

                                        }
                                        <TextfieldInfo
                                            name={"Cloud *"}
                                            info={"Select the Cloud provider"}
                                        />
                                        <Autocomplete
                                            sx={{width: 300}}
                                            options={cloudProvider}
                                            value={cloud}
                                            autoHighlight
                                            onChange={(e, newValue) => {
                                                setCloud(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-env",
                                                    }}
                                                    size="small"
                                                    placeholder={"Cloud"}
                                                    required
                                                />
                                            )}
                                        />
                                        {cloud==="Azure" &&
                                            <>
                                                <TextfieldInfo
                                                    name={"Cloud Region *"}
                                                    info={"Select the region"}
                                                />
                                                <Autocomplete
                                                    sx={{width: 300}}
                                                    options={regionOptions}
                                                    value={azureRegion}
                                                    autoHighlight
                                                    onChange={(e, newValue) => {
                                                        setAzureRegion(newValue);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            inputProps={{
                                                                ...params.inputProps,
                                                                autoComplete: "new-env",
                                                            }}
                                                            size="small"
                                                            placeholder={"Region"}
                                                            required
                                                        />
                                                    )}
                                                />
                                                {/*<TextfieldInfo*/}
                                                {/*    name={"Azure credentials *"}*/}
                                                {/*    info={"Select the credentials"}*/}
                                                {/*/>*/}
                                                {/*<Autocomplete*/}
                                                {/*    sx={{width: 300}}*/}
                                                {/*    options={credentials}*/}
                                                {/*    value={cloudCredentails}*/}
                                                {/*    autoHighlight*/}
                                                {/*    onChange={(e, newValue) => {*/}
                                                {/*        setCloudCredentials(newValue);*/}
                                                {/*    }}*/}
                                                {/*    renderInput={(params) => (*/}
                                                {/*        <TextField*/}
                                                {/*            {...params}*/}
                                                {/*            inputProps={{*/}
                                                {/*                ...params.inputProps,*/}
                                                {/*                autoComplete: "new-env",*/}
                                                {/*            }}*/}
                                                {/*            size="small"*/}
                                                {/*            placeholder={"Credentials"}*/}
                                                {/*            required*/}
                                                {/*        />*/}
                                                {/*    )}*/}
                                                {/*/>*/}
                                            </>
                                        }
                                        {
                                            (folders !== "" && cloud === "Google") && <div>
                                                <TextfieldInfo
                                                    name={"Folder"}
                                                    info={"select the folder"}
                                                />
                                                <TextField
                                                    value={folders}
                                                    rows={10}
                                                    size="small"
                                                    sx={{width: 300}}
                                                    InputProps={{
                                                        readOnly: true
                                                    }}
                                                    required
                                                />
                                            </div>
                                        }
                                        {
                                            (cloud === "Google" || cloud==="Azure" ) && <div>
                                                <TextfieldInfo
                                                    name={"Templates"}
                                                    info={"Please select the templates that needs to be created"}
                                                />
                                                <FormControl sx={{width: 300}}>
                                                    <Select
                                                        labelId="demo-multiple-chip-label"
                                                        id="demo-multiple-chip"
                                                        multiple
                                                        size="small"
                                                        value={template}
                                                        onChange={handleChangeChip}
                                                        input={<OutlinedInput id="select-multiple-chip" label="Chip"/>}
                                                        renderValue={(selected) => (
                                                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                                                {selected.map((value) => (
                                                                    <Chip key={value} label={value}/>
                                                                ))}
                                                            </Box>
                                                        )}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {templatesList.map((name) => (
                                                            <MenuItem
                                                                key={name}
                                                                value={name}
                                                                style={getStyles(name, template, theme)}
                                                            >
                                                                {name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        }
                                        <TextfieldInfo
                                            name={"Compliance"}
                                            info={"STD and PDPA /GDPR Default is STD"}
                                        />
                                        <Autocomplete
                                            sx={{width: 300}}
                                            options={complianceOption}
                                            value={complianceValue}
                                            autoHighlight
                                            defaultValue={"STD"}
                                            onChange={(e, newValue) => {
                                                setComplianceValue(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-env",
                                                    }}
                                                    size="small"
                                                    placeholder={"Compliance"}
                                                />
                                            )}
                                        />
                                        <TextfieldInfo
                                            name={"Disaster Recovery"}
                                            info={"Disaster Recovery"}
                                        />
                                        <Autocomplete
                                            sx={{width: 300}}
                                            options={disasterval}
                                            value={disval}
                                            autoHighlight
                                            onChange={(e, newValue) => {
                                                setDisval(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: "new-env",
                                                    }}
                                                    placeholder={"Disaster-Recovery"}
                                                    size="small"
                                                    required
                                                />
                                            )}
                                        />
                                        {
                                            disval === "YES" &&
                                            <div>
                                                <br/>
                                                <Divider/>
                                                <TextfieldInfo
                                                    name={"RTO *"}
                                                    info={"Please select the level for Recovery Time Objective (High indicates - Fast recovery is required post any disaster)"}
                                                />
                                                <TextField
                                                    sx={{width: 300}}
                                                    onChange={(e, newValue) => {
                                                        setRto(e.target.value);
                                                    }}
                                                    size={"small"}
                                                    placeholder={"Eg: 2hours"}
                                                    sx={{width:300}}
                                                />

                                                <TextfieldInfo
                                                    name={"RPO *"}
                                                    info={"Please select the level for Recovery Point Objective. High for both RTO & RPO enables DR/HA Requirement"}
                                                />
                                                <TextField
                                                    sx={{width: 300}}
                                                    onChange={(e, newValue) => {
                                                        setRpo(e.target.value);
                                                    }}
                                                    placeholder={"Eg: 2hours"}
                                                    size={"small"}
                                                    sx={{width:300}}
                                                />
                                            </div>
                                        }
                                        <br />
                                    </div>
                                </div>
                            </Box>
                        </div>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            {error &&
                                <div>
                                    <Alert onClose={(e) => {
                                        setError(false);
                                        e.preventDefault()
                                    }} color={"warning"} severity={"warning"} sx={{width: 450}}>The Cost centre value must
                                        be
                                        only sum up to 100%</Alert>
                                </div>
                            }
                        </div>
                    </Container>}
                {
                    stepperEnable &&
                    <TemplateStepper
                        activeStep={activeStep}
                        templates={template}
                        handleReset={handleReset}
                        customclass={customclass}
                        properties={properties}
                        handleChange={handleChange}
                        handleBack={handleBack}
                        handleCloseStepper={handleCloseStepper}
                        errorStates={errorStates}
                        handleError={handleError}
                        detailsTemplate={detailsTemplate}
                        handleChangeTotal={handleChangeTotal}
                        templateDetails={
                            template?.includes("project_setup") ? {
                                project_setup:{
                                    environment: environmentrequest?.toLowerCase(),
                                    sub_folder_name: projectName,
                                    project_name:`${projectName}-${environmentrequest.toLowerCase()}`,
                                    key:`${projectName}-${environmentrequest.toLowerCase()}-key`
                                }} : null}
                    />
                }
            </form>
        </div>
    )
}
