import {AuthContext} from "../../../../../../../lib/authContext";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogContentText,
    DialogTitle,
    Divider,
    Fab,
    Grid, OutlinedInput, Select,
    TextField
} from "@material-ui/core";
import {DataGrid} from "@material-ui/data-grid";
import {ErrorContext} from "../../../../../../../lib/errorContext";
import {Drawer, IconButton, Skeleton} from "@mui/material";
import {createDetails, deleteDetails, getDetails, updateDetails} from "../../../../../../../utils/fetch-util";
import {hostport} from "../../../../../../../next.config";
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import {useRouter} from "next/router";
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import {makeStyles, withStyles} from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import Can from "../../../../../../../lib/Can";
import DeleteIcon from "@material-ui/icons/Delete";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import ProjectEditor from "../../../../../../../components/project/ProjectEditor";
import ProjectLayout from "../../../../../../../components/project/ProjectLayout";
import React, {useCallback, useContext, useEffect, useState} from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import NewProjectEditor from "../../../../../../../components/project/NewProjectEditor";
import EditorView from "../../../../../../../components/editor/EditorView";
import EditorHelper from "../../../../../../../components/editor/EditorHelper";
import Share from "../../../../../../../components/Share";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import PopupHelp from "../../../../../../../components/PopupHelp";
import TextfieldInfo from "../../../../../../../components/TextfieldInfo";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import {useTheme} from "@mui/material/styles";
import TemplateStepper from "../../../../../../../components/templates/TemplateStepper";
import UseStyle from "../../../../../../../components/styles";
import {anyStateTrue, ErrorState} from "../../../../../../../utils/validation";
import _ from "lodash";
import yaml from "js-yaml";
import {SnackbarContext} from "../../../../../../../lib/toaster/SnackbarContext";
import Loading from "../../../../../../../components/Loading";
import playCircleFill from "@iconify/icons-eva/play-circle-fill";
import Changerequest from "../../../../../../../components/Changerequest";
import {Refresh} from "@material-ui/icons";
import DataGridComponent from "../../../../../../../components/DataGridComponent";

const moduleColumn = [
    {
        field: "id",
        headerName: "ID",
        width: 100
    },
    {
        field: "name",
        headerName: "Name",
        width: 400
    }
];

export default function EnvironmentName() {
    const [cloudProviders,setCloudProviders] = useState({
        "meta": {
            "limit": 15,
            "current_offset": 0,
            "next_offset": 15,
            "next_url": "https:///v1/modules?offset=15&verified=true"
        },
        "modules": [
            {
                "id": "GoogleCloudPlatform/lb-http/google/6.3.0",
                "owner": "",
                "namespace": "GoogleCloudPlatform",
                "name": "lb-http",
                "version": "6.3.0",
                "provider": "google",
                "provider_logo_url": "/images/providers/google-cloud.svg",
                "description": "Modular Global HTTP Load Balancer for GCE using forwarding rules.",
                "source": "https://github.com/GoogleCloudPlatform/terraform-google-lb-http",
                "tag": "v6.3.0",
                "published_at": "2022-07-29T18:16:07.22478Z",
                "downloads": 922111,
                "verified": true
            },
            {
                "id": "GoogleCloudPlatform/managed-instance-group/google/1.1.15",
                "owner": "",
                "namespace": "GoogleCloudPlatform",
                "name": "managed-instance-group",
                "version": "1.1.15",
                "provider": "google",
                "provider_logo_url": "/images/providers/google-cloud.svg",
                "description": "Modular Google Compute Engine managed instance group for Terraform.",
                "source": "https://github.com/GoogleCloudPlatform/terraform-google-managed-instance-group",
                "tag": "1.1.15",
                "published_at": "2019-02-14T16:55:26.567562Z",
                "downloads": 152005,
                "verified": true
            },
            {
                "id": "GoogleCloudPlatform/lb-internal/google/5.0.0",
                "owner": "",
                "namespace": "GoogleCloudPlatform",
                "name": "lb-internal",
                "version": "5.0.0",
                "provider": "google",
                "provider_logo_url": "/images/providers/google-cloud.svg",
                "description": "Modular Internal Load Balancer for GCE using forwarding rules.",
                "source": "https://github.com/GoogleCloudPlatform/terraform-google-lb-internal",
                "tag": "v5.0.0",
                "published_at": "2022-07-19T15:30:50.734572Z",
                "downloads": 361755,
                "verified": true
            },
            {
                "id": "GoogleCloudPlatform/nat-gateway/google/1.2.3",
                "owner": "",
                "namespace": "GoogleCloudPlatform",
                "name": "nat-gateway",
                "version": "1.2.3",
                "provider": "google",
                "provider_logo_url": "/images/providers/google-cloud.svg",
                "description": "Modular NAT Gateway on Google Compute Engine for Terraform.",
                "source": "https://github.com/GoogleCloudPlatform/terraform-google-nat-gateway",
                "tag": "v1.2.3",
                "published_at": "2020-02-12T16:37:09.082788Z",
                "downloads": 55696,
                "verified": true
            },
            {
                "id": "Azure/loadbalancer/azurerm/3.4.0",
                "owner": "",
                "namespace": "Azure",
                "name": "loadbalancer",
                "version": "3.4.0",
                "provider": "azurerm",
                "provider_logo_url": "/images/providers/azure.svg?3",
                "description": "Terraform Azure RM Module for Load Balancer",
                "source": "https://github.com/Azure/terraform-azurerm-loadbalancer",
                "tag": "3.4.0",
                "published_at": "2021-05-26T06:12:12.750426Z",
                "downloads": 12523,
                "verified": true
            },
            {
                "id": "Azure/network/azurerm/3.5.0",
                "owner": "",
                "namespace": "Azure",
                "name": "network",
                "version": "3.5.0",
                "provider": "azurerm",
                "provider_logo_url": "/images/providers/azure.svg?3",
                "description": "Terraform Azure RM Module for Network",
                "source": "https://github.com/Azure/terraform-azurerm-network",
                "tag": "3.5.0",
                "published_at": "2021-05-31T06:08:51.988319Z",
                "downloads": 241431,
                "verified": true
            },
            {
                "id": "Azure/computegroup/azurerm/2.1.0",
                "owner": "",
                "namespace": "Azure",
                "name": "computegroup",
                "version": "2.1.0",
                "provider": "azurerm",
                "provider_logo_url": "/images/providers/azure.svg?3",
                "description": "Terraform Azure RM Compute Group Module",
                "source": "https://github.com/Azure/terraform-azurerm-computegroup",
                "tag": "v2.1.0",
                "published_at": "2019-02-14T16:55:32.116884Z",
                "downloads": 3283,
                "verified": true
            },
            {
                "id": "Azure/compute/azurerm/3.14.0",
                "owner": "",
                "namespace": "Azure",
                "name": "compute",
                "version": "3.14.0",
                "provider": "azurerm",
                "provider_logo_url": "/images/providers/azure.svg?3",
                "description": "Terraform Azure RM Compute Module",
                "source": "https://github.com/Azure/terraform-azurerm-compute",
                "tag": "3.14",
                "published_at": "2021-05-25T01:30:43.717457Z",
                "downloads": 93209,
                "verified": true
            },
            {
                "id": "alibaba/ecs-instance/alicloud/2.10.0",
                "owner": "",
                "namespace": "alibaba",
                "name": "ecs-instance",
                "version": "2.10.0",
                "provider": "alicloud",
                "provider_logo_url": "/images/providers/alibaba.png?2",
                "description": "Terraform module which creates ECS instance(s) on Alibaba Cloud.",
                "source": "https://github.com/alibaba/terraform-alicloud-ecs-instance",
                "tag": "v2.10.0",
                "published_at": "2022-07-07T07:48:14.499843Z",
                "downloads": 18605,
                "verified": true
            },
            {
                "id": "alibaba/slb/alicloud/1.7.0",
                "owner": "",
                "namespace": "alibaba",
                "name": "slb",
                "version": "1.7.0",
                "provider": "alicloud",
                "provider_logo_url": "/images/providers/alibaba.png?2",
                "description": "Terraform module which creates Load balancer and attach ECS instances in it on Alibaba Cloud.",
                "source": "https://github.com/alibaba/terraform-alicloud-slb",
                "tag": "v1.7.0",
                "published_at": "2021-12-05T13:00:41.317039Z",
                "downloads": 3567,
                "verified": true
            },
            {
                "id": "alibaba/vpc/alicloud/1.10.0",
                "owner": "",
                "namespace": "alibaba",
                "name": "vpc",
                "version": "1.10.0",
                "provider": "alicloud",
                "provider_logo_url": "/images/providers/alibaba.png?2",
                "description": "Terraform module which creates VPC and Subnet resources on Alibaba Cloud.",
                "source": "https://github.com/alibaba/terraform-alicloud-vpc",
                "tag": "v1.10.0",
                "published_at": "2022-04-13T10:31:35.709404Z",
                "downloads": 38671,
                "verified": true
            },
            {
                "id": "oracle/compute-instance/opc/1.0.1",
                "owner": "",
                "namespace": "oracle",
                "name": "compute-instance",
                "version": "1.0.1",
                "provider": "opc",
                "provider_logo_url": "/images/providers/oracle.svg",
                "description": "Terraform Module for creating Oracle Cloud Infrastructure OPC Compute instances",
                "source": "https://github.com/oracle/terraform-opc-compute-instance",
                "tag": "v1.0.1",
                "published_at": "2019-02-14T16:55:38.116329Z",
                "downloads": 960,
                "verified": true
            },
            {
                "id": "alibaba/security-group/alicloud/2.4.0",
                "owner": "",
                "namespace": "alibaba",
                "name": "security-group",
                "version": "2.4.0",
                "provider": "alicloud",
                "provider_logo_url": "/images/providers/alibaba.png?2",
                "description": "Terraform module which creates Security Group and sets rules for it on Alibaba Cloud.",
                "source": "https://github.com/alibaba/terraform-alicloud-security-group",
                "tag": "v2.4.0",
                "published_at": "2021-08-29T13:02:46.663333Z",
                "downloads": 13037,
                "verified": true
            },
            {
                "id": "Azure/database/azurerm/1.1.0",
                "owner": "",
                "namespace": "Azure",
                "name": "database",
                "version": "1.1.0",
                "provider": "azurerm",
                "provider_logo_url": "/images/providers/azure.svg?3",
                "description": "Terraform Azure RM Module for Database",
                "source": "https://github.com/Azure/terraform-azurerm-database",
                "tag": "v1.1.0",
                "published_at": "2019-02-14T16:55:43.202491Z",
                "downloads": 40769,
                "verified": true
            },
            {
                "id": "GoogleCloudPlatform/sql-db/google/13.0.0",
                "owner": "",
                "namespace": "GoogleCloudPlatform",
                "name": "sql-db",
                "version": "13.0.0",
                "provider": "google",
                "provider_logo_url": "/images/providers/google-cloud.svg",
                "description": "Modular Cloud SQL database instance for Terraform.",
                "source": "https://github.com/GoogleCloudPlatform/terraform-google-sql-db",
                "tag": "v13.0.0",
                "published_at": "2022-11-07T22:35:22.364852Z",
                "downloads": 2049851,
                "verified": true
            }
        ]
    })
    const [terrformModules,setTerraformModules] = useState({});
    const { setSnackbar } = useContext(SnackbarContext);
    const router = useRouter();
    const {project_name: projectName} = router.query;
    const {organization_name: organizationName} = router.query;
    const {environment_name: environmentName} = router.query;
    const [changeReq, setChangeReq] = useState("default")
    const data = useState(cloudProviders.modules);
    const [
        editor,
        setEditor
    ] = useState(false);

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

    const [
        moduleValue,
        setModuleValue
    ] = useState({
        module: "",
        name: "",
        provider: ""
    })

    const [
        stepperEnable,
        setStepperEnable
    ] = useState(false)

    const [
        alreadyExist,
        setAlreadyExist
    ] = useState();
    const [upadtevars, setUpdatevars] = useState([])
    const [
        moduleRows,
        setModuleRows
    ] = useState([]);
    const [
        devModeData,
        setDevModeData
    ] = useState("");

    const [
        terraformInfo,
        setTerraformInfo
    ] = useState([]);

    const [
        providers,
        setProviders
    ] = useState([]);
    const [
        modules,
        setModules
    ] = useState([]);
    const [
        templates,
        setTemplates
    ] = useState(["Stack template", "Resource template"]);
    const [
        availableTemplatesList,
        setAvailableTemplatesList
    ] = useState([])
    const [
        templatesResponse,
        setTemplateResponse
    ] = useState([])
    const [
        availableTemplateVersion,
        setAvailableTemplateVersion
    ] = useState([])
    const [
        selectTemplateType,
        setSelectTemplateType
    ] = useState("")
    const [
        selectedTemplate,
        setSelectedTemplate
    ] = useState("")
    const [
        selectedTemplateVersion,
        setSelectedTemplateVersion
    ] = useState("")
    const [
        moduleName,
        setModuleName
    ] = useState("");
    const [
        selectionModel,
        setSelectionModel
    ] = useState([]);
    const [
        createNotOpen,
        setCreateNotOpen
    ] = useState(true);

    const [
        cloudProviderValue,
        setCloudProviderValue
    ] = useState("");

    const [
        type,
        setType
    ] = useState("")

    const [
        valuesModule,
        setValuesModule
    ] = useState("");
    const [
        isEnvSpecific,
        setIsEnvSpecific
    ] = useState(false);
    const [
        selected,
        setSelected
    ] = useState([]);
    const [
        open,
        setOpen
    ] = useState(false);
    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        newBranch,
        setNewBranch
    ] = useState("")
    const [
        contentsBackup,
        setContentsBackup
    ] = useState([])
    const [
        errorStates,
        setErrorStates
    ] = useState(initialState.errorStates);
    const [
        detailsTemplate,
        setDetailsTemplate
    ] = useState(_.cloneDeep(initialState.details));

    function handleModuleSelect(selectedValue) {
        setSelected(selectedValue);
    }

    const {errorTrigger} = useContext(ErrorContext);

    const [
        formControl,
        setFormControl
    ] = useState(false);
    const {userData} = useContext(AuthContext);

    const [userInfo, setuserInfo] = useState(userData)


    useEffect(() => {
        if (userData && userData !== undefined) {
            setuserInfo(userData)
        }
    }, [userData])

    const DialogContent = withStyles(() => ({
        root: {
            height: 200,
            width: 600
        }
    }))(MuiDialogContent);

    const DialogActions = withStyles((theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(1)
        }
    }))(MuiDialogActions);

    const handleClickDialogOpen = useCallback(() => {
        setOpen(true);
    });

    const handleDialogClose = useCallback(() => {
        setOpen(false);
        setFormControl(false);
    });

    const [fileState, setFileState] = useState([]);
    const [contents, setContents] = useState([])
    const [share, setShare] = useState(false)
    const [isValidate, setIsValidate] = useState(false)
    const [templateValues, setTemplateValues] = useState([])

    const [typesofmodule, setTypesofmodule] = useState(["Registry", "Templates"])

    const onClickEditor = useCallback(() => {
        router.replace(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}`);
        setEditor(false);
    });

    const changeState = useCallback(() => {
        // setCloudProviderValue("");
        setValuesModule("");
        setModuleName("");
        setFormControl(false);
        if (isEnvSpecific === true) {
            setIsEnvSpecific(false);
            setCreateNotOpen(true);
        }

        setDevModeData("");
    });

    const handleError = (newErrorStates) => {
        // console.log(newErrorStates)
    };

    function handleChangeTotal(data) {
        setTemplateValues(data);
    }

    const getModuleRows = async () => {
        setLoading(true);
        let branch = "master"
        try {
            setModuleRows([])
            if (changeReq === "default") {
                let GetModules = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/git/files`;

                let newValue = {
                    "id": `/organizations/${organizationName}/projects/${projectName}`,
                    "organization": organizationName,
                    "project": `${projectName}`,
                    "git": "bitbucket",
                    "branch": branch
                }
                let res = await updateDetails(GetModules, "", newValue);
                if (res.response_data && Array.isArray(res.response_data) && res.response_data.length > 0) {
                    setFileContents(res.response_data);
                    let variablesRegEx = /variables\..*\.tfvars/gm
                    let backendRegEx = /backend\..*\.tfvars/gm
                    let filteredFileState = res.response_data.filter((v, i) => {
                        if (v.name.match(variablesRegEx)) {
                            if (v.name === `variables.${environmentName}.tfvars`) {
                                res.response_data[i].name = "variables.tfvars";
                                return true
                            } else {
                                return false
                            }
                        } else if (v.name.match(backendRegEx)) {
                            if (v.name === `backend.${environmentName}.tfvars`) {
                                res.response_data[i].name = "backend.tfvars";
                                return true
                            } else {
                                return false
                            }
                        }
                        return true
                    })
                    setFileState(filteredFileState.sort((a,b)=>(a.name.toLowerCase()>b.name.toLowerCase()) ? 1 : -1));

                    let newValue = []
                    newValue = filteredFileState.filter((e) => (e.name !== ".gitignore" && e.name !== "" && e.name !== "variables.tf"
                        && e.name !== "Jenkinsfile" && e.name !== "provider.tf"))
                    newValue = newValue?.map((e, i) => {
                        e.id = i + 1;
                        return e
                    })
                    setModuleRows(newValue);
                } else {
                    setFileState([]);
                    setFileContents([]);
                    setModuleRows([]);
                }
            } else {
                let GetModules = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/git/files`;

                let newValue = {
                    "id": `/organizations/${organizationName}/projects/${projectName}`,
                    "organization": `${organizationName}`,
                    "project": `${projectName}`,
                    "git": "bitbucket",
                    "branch": changeReq.replace("pr-", ""),
                    "change_request": changeReq
                }

                let res = await updateDetails(GetModules, "", newValue)
                if (res.response_data && Array.isArray(res.response_data) && res.response_data.length > 0) {
                    setFileContents(res.response_data);
                    let variablesRegEx = /variables\..*\.tfvars/gm
                    let backendRegEx = /backend\..*\.tfvars/gm
                    let filteredFileState = res.response_data.filter((v, i) => {
                        if (v.name.match(variablesRegEx)) {
                            if (v.name === `variables.${environmentName}.tfvars`) {
                                res.response_data[i].name = "variables.tfvars";
                                return true
                            } else {
                                return false
                            }
                        } else if (v.name.match(backendRegEx)) {
                            if (v.name === `backend.${environmentName}.tfvars`) {
                                res.response_data[i].name = "backend.tfvars";
                                return true
                            } else {
                                return false
                            }
                        }
                        return true
                    })

                    setFileState(filteredFileState.sort((a,b)=>(a.name.toLowerCase()>b.name.toLowerCase()) ? 1 : -1));

                    let newValue = [];
                    newValue = filteredFileState.filter((e) => (e.name !== ".gitignore" && e.name !== "" && e.name !== "variables.tf"
                        && e.name !== "Jenkinsfile" && e.name !== "provider.tf"))
                    newValue = newValue?.map((e, i) => {
                        e.id = i + 1;
                        return e
                    })
                    setModuleRows(newValue);
                } else {
                    setFileState([]);
                    setFileContents([]);
                    setModuleRows([]);
                }
            }
        } catch (err) {
            setFileState([]);
            setFileContents([]);
            setModuleRows([]);
        }
        setLoading(false);
    };

    const [
        schemaList,
        setSchemaList
    ] = useState([])

    const getTeraformModules= ()=>{
        let url=`${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/terraform/cloud`
        getDetails(url, "", "", "", "").then((res)=>{
            let temp={};
            temp.modules=res;
            setTerraformModules(temp)
            let t={}
            t.title=res[res.length-1].provider;
            console.log("ooo",res[res.length-1].provider);
            setCloudProviderValue({title:res[res.length-1].provider})
        }).catch((err)=>{
            console.log(err);
        })
    }


    useEffect(() => {
        let arr = []
        template?.map(async (e) => {
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
                        arr?.map((a) => {
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

    function PaperComponent(props) {
        return (
            <Draggable
                handle="#draggable-dialog-title"
                cancel={'[class*="MuiDialogContent-root"]'}
            >
                <Paper {...props} />
            </Draggable>
        );
    }

    const refresh = async () => {
        await getModuleRows();
    };

    const getOptionLabel = (option) => {
        if (typeof option.title === "undefined") {
            return "";
        }

        return option.title;
    };

    const defaultProps = {
        getOptionLabel,
        options: providers
    };

    const defaultPropsProviders = {
        getOptionLabel,
        options: modules
    };

    const [openPopup, setOpenPopup] = useState(false)

    const defaultPropsTemplates = {
        getOptionLabel,
        options: templates
    };

    const defaultPropsTemplatesList = {
        getOptionLabel,
        options: availableTemplatesList
    };

    const defaultPropsTemplatesVersion = {
        getOptionLabel,
        options: availableTemplateVersion
    };

    const handleOpen = useCallback(() => {
        setCreateNotOpen(false);
        setFormControl(true);
    });

    const handleClickOpenCidr = () => {
        router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/CIDR/create`)
    };

    const handleClose = useCallback(() => {
        setCreateNotOpen(true);
        setFormControl(false);
    });

    const handleDelete = useCallback(() => {
        try {
            for (let index = 0; index < selected.length; index++) {
                let deleteContentsFile = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/git/deletefiles`;
                let newValue = {
                    "id": `/organizations/${organizationName}/projects/${projectName}`,
                    "organization": `${organizationName}`,
                    "project": `${projectName}`,
                    "git": "bitbucket",
                }
                if (selected[index].name === "backend.tfvars") {
                    newValue.files = [`backend.${environmentName}.tfvars`];
                } else if (selected[index].name === "variables.tfvars") {
                    newValue.files = [`variables.${environmentName}.tfvars`];
                } else {
                    newValue.files = [selected[index].name];
                }

                if (organizationName !== undefined && organizationName && projectName !== undefined && projectName) {
                    if (changeReq === "default") {
                        newValue.branch = "master";
                    } else {
                        let branchName = changeReq.slice(3, changeReq.length);
                        newValue.branch = branchName;
                    }

                    deleteDetails(deleteContentsFile, "", "", "", newValue)
                        .catch((err) => {
                            //   errorTrigger("error", JSON.stringify(err.message))
                            console.log("error", JSON.stringify(err.message))
                        });
                }
            }
        } catch (err) {
            // errorTrigger("error", JSON.stringify(err.message));
            console.log("error", JSON.stringify(err.message))
        }

        setSelectionModel([]);
        setOpen(false);
        setSelected([]);
        getModuleRows();
    });
    const getModulesData = useCallback(() => {
        let getModules = "";
        let module = valuesModule.title;
        if (cloudProviderValue && module!=="") {
            if (cloudProviderValue.title === "google") {
                try {
                    getModules = `${hostport}/terraform/v1/modules/bootlabstech/${module}/google`;
                    if(module==="modules") getModules = `${hostport}/terraform/v1/modules/bootlabstech/${module}/cloudflare`;
                    getDetails(getModules, "", "", "", "")
                        .then((res) => {
                            setDevModeData(res);
                            setEditor(true)
                        })
                        .catch((err) => {
                            console.log("AWS/Google Module Not Found")
                        })
                } catch (err) {
                    console.log("AWS/Google Module Not Found")
                }
            } else if(cloudProviderValue.title === "aws"){
                try {
                    getModules = `${hostport}/terraform/v1/modules/bootlabstech-m/${module}/aws`;
                    if(module==="modules") getModules = `${hostport}/terraform/v1/modules/bootlabstech/${module}/cloudflare`;
                    getDetails(getModules, "", "", "", "")
                        .then((res) => {
                            setDevModeData(res);
                            setEditor(true)
                        })
                        .catch((err) => {
                            console.log("AWS/Google Module Not Found")
                        })
                } catch (err) {
                    console.log("AWS/Google Module Not Found")
                }
            } else {
                try {
                    getModules = `${hostport}/terraform/v1/modules/bootlabstech/${module}/azurerm`;

                    getDetails(getModules, "", "", "", "")
                        .then((res) => {
                            setDevModeData(res);
                            setEditor(true)
                        })
                        .catch((err) => {
                            console.log("Azure Module Not Found")
                        });
                } catch (err) {
                    console.log("Azure module not found")
                }
            }
        }
    });

    const [
        changeRequestBranch,
        setChangeRequestBranch
    ] = useState("")

    const [
        pr,
        setPr
    ] = useState([{title: "default"}]);

    function switchChangeRequest(res) {
        if (typeof changeReq !== "undefined") {
            setChangeReq(res)
        }
        setChangeRequestBranch(res)
    }

    const getPopupDetails = useCallback(() => {
        let getModules = "";
        let module = valuesModule ? valuesModule.title : "";
        if (cloudProviderValue && module!=="") {
            if (cloudProviderValue.title === "aws" || cloudProviderValue.title === "google") {
                try {

                    getModules = `${hostport}/terraform/v1/modules/bootlabstech/${module}/google`;
                    if(module==="modules") getModules = `${hostport}/terraform/v1/modules/bootlabstech/${module}/cloudflare`;
                    getDetails(getModules, "", "", "", "")
                        .then((res) => {
                            if (res) {
                                setTerraformInfo(res.root.inputs);
                            }
                        })
                        .catch((err) => {
                            console.log("AWS/Google Module Not Found")
                        })
                } catch (err) {
                    console.log("AWS/Google Module Not Found")
                }
            } else {
                try {
                    getModules = `${hostport}/terraform/v1/modules/bootlabstech/${module}/azurerm`;

                    getDetails(getModules, "", "", "", "")
                        .then((res) => {
                            if (res) {
                                setTerraformInfo(res.root.inputs);
                            }
                        })
                        .catch((err) => {
                            console.log("Azure Module Not Found")
                        });
                } catch (err) {
                    console.log("Azure module not found")
                }
            }
        }
    });

    // useEffect(() => {
    //     if(!cloudProviderValue || cloudProviderValue.title === undefined || moduleValue.title === undefined) {
    //         setTerraformInfo([])
    //     }
    // },[cloudProviderValue,moduleValue])

    function availableTemplates() {
        if (cloudProviderValue && selectTemplateType && type === "Templates") {
            let url = `${hostport}/api/v1/organizations/${organizationName}/infratemplates/provider/${cloudProviderValue.title}`;
            getDetails(url, "", "", "", "")
                .then((res) => {
                    if (res.response_data) {
                        let arr = []
                        res.response_data = res.response_data.filter(
                            (i) => i.provider === cloudProviderValue.title,
                        );
                        res?.response_data?.map((e) => {
                            if (!arr.includes(e.template_name) && selectTemplateType === e.template_type) {
                                arr.push({
                                    title: e.template_name
                                })
                            }
                        })
                        setTemplateResponse(res.response_data)
                        setAvailableTemplatesList(arr)
                    } else {
                        setAvailableTemplatesList([])
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    function getAvailableTemplates() {
        if (type === "Templates") {
            let url = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/templates`;
            getDetails(url, "", "project", "", "")
                .then((res) => setAvailableTemplatesList(res.response_data))
                .catch((err) => console.log("err", err))
        }
    }

    useEffect(() => {
        getAvailableTemplates()
    }, [cloudProviderValue, type])

    function availabeVersions() {
        if (cloudProviderValue && selectTemplateType && type === "Templates" && selectedTemplate) {
            let arr = []
            templatesResponse?.map((e) => {
                if (selectedTemplate.title === e.template_name && selectTemplateType === e.template_type) {
                    arr.push({
                        title: e.version
                    })
                }
            })
            setAvailableTemplateVersion(arr)
        }
    }

    useEffect(() => {
        providersJson();
        modulesJson();
        availableTemplates();
        availabeVersions();

        const newValue = {
            ...valuesModule,
            module: (typeof valuesModule === "undefined" || valuesModule === null)
                ? ""
                : valuesModule.title,
            name: moduleName,
            provider: (typeof cloudProviderValue === "undefined" || cloudProviderValue === null)
                ? ""
                : cloudProviderValue.title
        }
        setModuleValue(newValue);

        for (let index = 0; index < moduleRows.length; index++) {
            if (moduleRows[index].name === moduleName) {
                setAlreadyExist(true);
                break;
            } else {
                setAlreadyExist(false);
            }
        }
    }, [
        moduleName,
        valuesModule,
        open,
        type,
        selectedTemplate,
        selectTemplateType,
        createNotOpen,
        cloudProviderValue
    ]);

    useEffect(() => {
        setSelectedTemplate("")
        setSelectedTemplateVersion("")
    }, [selectTemplateType])

    useEffect(() => {
        setSelectedTemplateVersion("")
    }, [selectedTemplate])

    useEffect(() => {
        getPopupDetails();
    }, [cloudProviderValue, valuesModule])

    const [templateDetails,setTemplateDetails]=useState();

    const handleCloseCreate = useCallback(() => {
        if (type === "Registry") {
            if (moduleValue.name !== "" && moduleValue.provider !== null && moduleValue.module !== null && isEnvSpecific) {
                setEditor(true);
                getModulesData();
            } else if (moduleValue.name !== "" && moduleValue.provider !== null && moduleValue.module !== null) {
                setEditor(true);
                getModulesData();
                setCreateNotOpen(true);
            } else {
                errorTrigger("error", "Enter the Required Fields");
            }
            getModuleRows();
        } else if (type === "Templates") {
            // if(template.includes("container_cluster")){
            //     let url=`${hostport}/api/v1/organizations/${organizationName}/cidr/projects/${projectName}/cidr/podsAndServices`
            //     getDetails(url, "", "", "", "").then((res)=>{
            //         let templateResponse={pods_range_name:[],services_range_name:[]}
            //         if(res.response_data.Pods){
            //             templateResponse.pods_range_name=res.response_data.Pods;
            //         }
            //         if(res.response_data.Services){
            //             templateResponse.services_range_name=res.response_data.Services;
            //         }
            //         console.log("templateresponse",templateResponse)
            //         setTemplateDetails({"container_cluster":templateResponse});
            //         setStepperEnable(true)
            //     }).catch((err) => {
            //         setSnackbar(err.response?.data?.response_message || err.message,"error")
            //     })
            // }else{
                setStepperEnable(true)
            // }
        }
    });

    function convertToJson(arr) {
        const orderInputObjects = [];
        arr.forEach((titles, index) => {
            if (index >= 0) {
                orderInputObjects.push({title: titles});
            }
        });

        return orderInputObjects;
    }

    function providersJson() {
        const arr = [];
        if (data !== undefined) {
            for (let index = 0; data[0] !== undefined && index < data[0].length; index++) {
                if (
                    !arr.includes(data[0][index].provider) &&
                    data[0][index].provider !== "opc" &&
                    data[0][index].provider !== "alicloud"
                ) {
                    arr.push(data[0][index].provider);
                }
            }

            const providerSelect = convertToJson(arr);

            setProviders(providerSelect);
        }
    }

    function moduleList(list) {
        const arr = [];
        let tempCloudName=cloudProviderValue?.title;
        if(cloudProviderValue?.title==="azurerm") tempCloudName="azurerm";
        for (let index = 0; index < list.modules.length; index++) {
            // if(list.modules[index].provider===tempCloudName){
                if (!arr.includes(list.modules[index].name)) {
                    arr.push(list.modules[index].name);
                }
            // }
        }

        const providerSelect = convertToJson(arr);

        setModules(providerSelect);
    }

    function modulesJson() {
        if (cloudProviderValue !== "" && cloudProviderValue !== null) {
            // if (typeof cloudProviderValue === "undefined"
            //     ? 0
            //     : cloudProviderValue.title === "google") {
            //     moduleList(google);
            // } else if (typeof cloudProviderValue === "undefined"
            //     ? 0
            //     : cloudProviderValue.title === "azurerm") {
            //     moduleList(azure);
            // } else if (typeof cloudProviderValue === "undefined"
            //     ? 0
            //     : cloudProviderValue.title === "aws") {
            //     moduleList(aws);
            // }
            moduleList(terrformModules);
        }
    }

    function onSelectedListChange(newSelectedList) {
        setSelected(newSelectedList);
    }

    useEffect(() => {
        if (editor) {
            router.replace(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/?create=true&dev=true`, "", {shallow: true});
        } else if (createNotOpen) {
            if (organizationName !== undefined && projectName !== undefined && environmentName !== undefined) {
                router.replace(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}`);
            }
        } else {
            if (organizationName !== undefined && projectName !== undefined && environmentName !== undefined) {
                router.replace(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/?create=true`);
            }
        }

    }, [
        editor,
        createNotOpen
    ]);

    const onChangeSetEnvSpecific = useCallback(() => {
        setIsEnvSpecific(!isEnvSpecific);
    });

    const renderProviderModules = useCallback((params) => (<TextField
        {...params}
        size="small"
    />));

    const handleShare = useCallback(() => {
        setShare(true)
    })

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

    const handleUpdate = async (files) => {
        setLoading(true);

        if (changeReq === "default") {
            let uid=Math.floor((Math.random() * 10000) + 1);
            setSnackbar("Creating PR ...","loading",uid)
            let randomstring = (Math.random() + 1).toString(36).substring(7);

            var gitworkflow = {
                project_id: `organizations/${organizationName}/projects/${projectName}`,
                bitbucket_project: projectName,
                bitbucket_org: organizationName,
                raised_by_id: userData.identity.id,
                source_branch: getBranchName(userData),
                branch_name: getBranchName(userData),
                pr_name: projectName + "-" + randomstring,
                files: files?.map(v => v.name),
                file_contents: files?.map(v => v.content)
            };

            const createCommit = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/workflow/startgitworkflow`;
                createDetails(createCommit, "", "", "", gitworkflow)
                    .then(()=>{
                        setSnackbar("PR Created Successfully","success",uid)
                        router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/runs/?refresh=true`)
                    })
                    .catch((err)=>{
                        setSnackbar(err.response?.data?.response_message || err.message,"error")
                        setLoading(false);
                        return
                    })
        } else {
            const createCommit = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/workflow/update`;
            let body = {
                files: files?.map(v => v.name),
                file_contents: files?.map(v => v.content)
            }
            try{
                await createDetails(createCommit, "", "", "", body)
            }catch(err){
                setSnackbar(err.response?.data?.response_message || err.message,"error")
                setLoading(false);
                return
            }
            setLoading(false);
            setSnackbar("PR Updated Successfully","success");
            router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/runs/?refresh=true`)
        }
    };

    const renderModules = useCallback((params) => (<TextField
        {...params}
        size="small"
    />));

    useEffect(()=>{
        console.log("dfjkd",cloudProviderValue);
    },[cloudProviderValue])

    const onSelectionModuleModelChange = useCallback((newSelectionModel) => {
        setSelectionModel(newSelectionModel.selectionModel);
        console.log("Dsdfsds",moduleRow)
        onSelectedListChange(moduleRows.filter((moduleRow) => newSelectionModel.includes(moduleRow.id)));
    });
    const handleValidate = useCallback(() => {
        setIsValidate(true)
    })

    useEffect(() => {
        return () => {
            setIsValidate(false)
        }
    })

    function canShare() {
        return (
            <Button startIcon={<ShareRoundedIcon/>} color={'info'} onClick={handleShare} variant={"contained"} style={{marginLeft:"0.5rem"}} size={"small"}> Share</Button>
        );
    }

    function canYes() {
        return (
            <div align="right">
                {changeRequestDetails===null&&
                    <Button onClick={handleOpen} startIcon={<AddIcon/>} variant={"contained"} size={"small"}>
                        Create Module
                    </Button>
                }
                {/*{userInfo &&*/}
                {/*    <Can*/}
                {/*        perform="read_module"*/}
                {/*        role={userInfo.identity.id}*/}
                {/*        yes={canShare}*/}
                {/*    />}*/}
                {/*        <Button*/}
                {/*            color="error"*/}
                {/*            disabled={!selected.length>0}*/}
                {/*            startIcon={<DeleteIcon/>}*/}
                {/*            variant={"contained"}*/}
                {/*            style={{marginLeft:"0.5rem"}}*/}
                {/*            size={"small"}*/}
                {/*        >*/}
                {/*            Delete*/}
                {/*        </Button>*/}
            </div>
        );
    }

    function canPlanAndValidate() {
        return (
            <>
                <div align="right">
                    {/*<Button onClick={handleValidate}>*/}
                    {/*    VALIDATE*/}
                    {/*</Button>*/}
                    <Button onClick={async () => {
                        const url = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/terraform/plan`;
                        let res = await createDetails(url, "", "", "", {
                            "files": fileState.map(v => v.name),
                            "file_contents": fileState.map(v => v.content),
                            "branch": changeReq === "default" ? "master" : changeReq.replace("pr-", ""),
                            "project_id": `organizations/${organizationName}/projects/${projectName}`,
                            "environment": environmentName,
                            "triggered_by_id": userData.identity.id
                        })
                        if (res.response_data !== null && typeof res.response_data !== "undefined") {
                            router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/runs/logs/${res.response_data}`)
                        }
                    }} variant={"contained"} size={"small"}>
                        Plan
                    </Button>
                    &nbsp;&nbsp;
                </div>
            </>
        )
    }

    const onChangeModuleName = useCallback((event) => {
        setModuleName(event.target.value);
    });

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

    function getStyles(name, personName, theme) {
        return {
            fontWeight:
                personName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    const [
        template,
        setTemplate
    ] = useState([]);

    const onClickBack = useCallback(() => {
        setCreateNotOpen(false);
        setEditor(false);
        setDevModeData("");
    });

    const onClickCancel = useCallback(() => {
        setEditor(false);
        setFormControl(false);
        changeState();
    });

    const onChangeCloudModules = useCallback((event, newValue) => {
        setValuesModule(newValue);
    });

    const onChangeSelectTemplates = useCallback((event, newValue) => {
        setSelectTemplateType(newValue);
    });

    const onChangeSelectTemplatesList = useCallback((event, newValue) => {
        setSelectedTemplate(newValue);
    });

    const onChangeSelectTemplatesVersion = useCallback((event, newValue) => {
        setSelectedTemplateVersion(newValue);
    });

    const onChangeCloudProvider = useCallback((event, newValue) => {
        if (!newValue) {
            newValue = ""
        }

        // setCloudProviderValue(newValue);
        setValuesModule("");
    });

    const onChangeType = useCallback((event, newValue) => {
        setType(newValue);
    });

    const renderCloudProvider = useCallback((params) => <TextField {...params} size="small"/>);

    function changeRequest(res) {
        setChangeReq(res);
    }

    const theme = useTheme();

    useEffect(async () => {
        await getModuleRows();
    }, [changeReq,environmentName])

    const [isDevModeOn, setIsDevModeOn] = useState(false);

    function onClickDevModeSwitch(isDevModeOn) {
        setIsDevModeOn(isDevModeOn);
    }

    const handleChangeChip = (event) => {
        const {
            target: {value},
        } = event;

        setTemplate(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleCreateTemplate = (e) => {
        e.preventDefault()
        let newValueTest = {
            template: template,
            dynamic_values: templateValues,
            project: projectName,
            environment: environmentName
        }
        let generateTemplateUrl = `${hostport}/api/v1/organizations/${organizationName}/templates/generate`
        createDetails(generateTemplateUrl, "", "", "", newValueTest)
            .then((res) => {
                if (res.response_data) {
                    let filesResponse = res.response_data
                    for (var i = 0; i < res.response_data.length; i++) {
                        if (res.response_data[i].name === "variables.tfvars") {
                            res.response_data[i].name = `variables.${environmentName}.tfvars`
                        }
                    }
                    let branchName = getBranchName(userData)
                    let filesData = fileState
                    filesData?.map((e) => {
                        if (e.name === "variables.tfvars") {
                            res?.response_data?.map((d) => {
                                if (d.name === `variables.${environmentName}.tfvars`) {
                                    e.content = e.content + "\n" + d.contents
                                }
                            })
                        }
                        if (e.name === "variables.tf") {
                            res?.response_data?.map((d) => {
                                if (d.name === `variables.tf`) {
                                    e.content = e.content + "\n" + " ".repeat(5) + d.contents
                                }
                            })
                        }
                    })
                    filesResponse?.map((e) => {
                        if (e.name !== `backend.${environmentName}.tfvars` &&
                            e.name !== `variables.${environmentName}.tfvars` &&
                            e.name !== "variables.tf") {
                            e.content = e.contents
                            filesData.push(e)
                        }
                    })

                    filesData?.map((e) => {
                        if (e.name === "variables.tfvars") {
                            e.name = `variables.${environmentName}.tfvars`
                        } else if (e.name === `backend.tfvars`) {
                            e.name = `backend.${environmentName}.tfvars`
                        }
                    })

                    let file_name = filesData?.map((e) => e.name)
                    let file_contents = filesData?.map((e) => e.content)

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

                    const createCommit = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/workflow/startgitworkflow`;

                    try {
                        createDetails(createCommit, "", "", "", gitworkflow)
                            .then(r => {
                                router.push(`/organization/${organizationName}/projects/${projectName}/environment/${environmentName}/pullrequests`)
                            })
                            .catch((err)=>{
                                if (err?.response.status === 409) {
                                    alert("another change request already exists, please close it first before doing other changes");
                                }
                            })

                    } catch (e) {
                        if (e.response.status === 409) {
                            alert("another change request already exists, please close it first before doing other changes");
                        }

                        return
                    }
                }
            })
    }

    const deleteFile = useCallback(async (fileName) => {
        try {
            {
                let deleteContentsFile = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/git/deletefiles`;
                let newValue = {
                    "id": `/organizations/${organizationName}/projects/${projectName}`,
                    "organization": `${organizationName}`,
                    "project": `${projectName}`,
                    "git": "bitbucket",
                }
                if (fileName === "backend.tfvars") {
                    newValue.files = [`backend.${environmentName}.tfvars`];
                } else if (fileName === "variables.tfvars") {
                    newValue.files = [`variables.${environmentName}.tfvars`];
                } else {
                    newValue.files = [fileName];
                }

                if (organizationName !== undefined && organizationName && projectName !== undefined && projectName) {
                    if (changeReq === "default") {
                        newValue.branch = "master";
                    } else {
                        let branchName = changeReq.slice(3, changeReq.length);
                        newValue.branch = branchName;
                    }

                    await deleteDetails(deleteContentsFile, "", "", "", newValue)
                        .catch((err) => {
                            //   errorTrigger("error", JSON.stringify(err.message))
                            console.log("error", JSON.stringify(err.message));
                        });
                }
            }
            await handleRefresh();
        } catch (err) {
            // errorTrigger("error", JSON.stringify(err.message));
            console.log("error", JSON.stringify(err.message));
        }

    });

    function onFileSave(fileName, fileContent) {
        let newFileState = [...filesState];

        newFileState.forEach((v, i) => {
            if (v.name === fileName) {
                newFileState[i] = {
                    name: fileName,
                    content: fileContent
                }
            }
        });

        setFileContents(newFileState);
        setFileState(newFileState);
    }


    const [changeRequestDetails, setChangeRequestDetails] = useState(null);
    function getChangeRequest() {
        setLoading(true);
        const getChangeRequestDetails = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/workflow/details`;

        getDetails(getChangeRequestDetails, "", "", "", "").then(r => {
            if (r !== null) {
                if (r.state === 5) {
                    setChangeRequestDetails(null)
                } else {
                    setChangeRequestDetails(r);
                }
            }
        })
    }
    const [accId,setAccId] = useState("")
    function getAccountID(){
        let account_id;
        getDetails(`${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/awsAccountDetails`, "", "", "", "")
            .then((res) => {
                let temp= res.response_data?.environment_ou;
                temp.forEach((item)=>{
                    if(item.name===environmentName){
                        account_id= item.account_id;
                        setAccId(item.account_id)
                    }
                })
            })
            .catch((err) => {
                console.log("error", JSON.stringify(err.message));
            });
    }


    useEffect(() => {
        if (cloudProviderValue.title === "google" && type === "templates") {
            let url = `${hostport}/api/v1/organizations/${organizationName}/templates/`
            getDetails(url, "", "", "", "")
                .then((res) => console.log("Response", res))
                .catch((err) => console.log("err", err))
        }
    }, [type, cloudProviderValue])

    const handleShareClose = useCallback(() => {
        setShare(false)

    })

    const [devModeState, setDevModeState] = useState(false)

    function changePopupState() {
        setOpenPopup(!openPopup)
        // setCloudProviderValue("")
        setValuesModule("")
    }

    const [fileContents, setFileContents] = useState([]);
    const [activeStep, setActiveStep] = React.useState(0);
    const [properties, setProperties] = useState([]);



    const handleRefresh = () => {
        getModuleRows();
    };

    function handleChange(event) {
        if (event.target.name === "resource_type") {
            let newErrorStates = {...errorStates, resource_type: new ErrorState(event.target.value === '', '')};
            setErrorStates(newErrorStates);
            setDisableSubmit(anyStateTrue(newErrorStates));

        }

        setDetailsTemplate({...detailsTemplate, [event.target.name]: event.target.value});
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleOpenStepper = useCallback(() => {
        setStepperEnable(true)
    });

    const handleCloseStepper = useCallback(() => {
        setStepperEnable(false)
    });

    const handleReset = () => {
        setActiveStep(0);
    };

    const onChangeDevMode = useCallback((e, checked) => {
        if (typeof onClickDevModeSwitch !== "undefined") {
            onClickDevModeSwitch(checked);
        }
        if (isDevMode) {
            setIsDevMode(false);
        } else {
            setIsDevMode(true);
        }
    });

    const [
        isDevMode,
        setIsDevMode
    ] = useState(typeof router === "undefined"
        ? false
        : Boolean(router.pathname.includes("dev-mode")));

    const useStyle = makeStyles(UseStyle);

    const customclass = useStyle();

    const [changeRequestData] = useState({
        git: "bitbucket",
        project: projectName,
        organization: organizationName
    });

    useEffect(() => {
        if(organizationName && projectName && environmentName){
            // getEnvironments();
            getPullRequest();
            getTeraformModules();
            getChangeRequest(
            )
            getAccountID()
            // setCurrentEnvironment(environmentName)
        }
    }, [organizationName,projectName,environmentName]);

    function getPullRequest() {
        try {
            const getPullRequestroute = `${hostport}/api/v1/organizations/${organizationName}/projects/${projectName}/environment/${environmentName}/modules/git/changeRequest`;

            changeRequestData.project = projectName
            changeRequestData.organization = organizationName

            updateDetails(getPullRequestroute, "", changeRequestData)
                .then((res) => {
                    let changeRequest = [{title: "default"}]
                    res.response_data.map((e) => changeRequest.push(e))
                    setPr(changeRequest);
                })
                .catch((err) => {
                    console.log("Change Request List error", err.message)
                });
        } catch (err) {
            console.log("Change Request List error", err.message)
        }
    }

    const LoadingSkeleton = useCallback(() => (<Box
            sx={{
                height: "max-content",
                animation: "pulse",
                marginTop:"3.5rem"
            }}
        >
            {
                [...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        style={{ display: "flex"}}
                    >
                        {
                            // [...Array(moduleColumn.length)].map((x, j) => (
                                <Skeleton
                                    // key={j}
                                    sx={{ height: 35,
                                        width: "100%",
                                        my: 1,
                                        mx: 1 }}
                                    variant="rectangular"
                                />
                            // ))
                        }
                    </div>
                ))
            }
        </Box>));

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                {/*<ProjectLayout formswitch={formControl} modules={moduleRows} changeRequestTitle={changeRequest}*/}
                {/*               onClickDevModeSwitch={onClickDevModeSwitch}>*/}
                    {stepperEnable ?
                        <div>
                            <form onSubmit={handleCreateTemplate}>
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
                                    templateDetails={templateDetails}
                                />
                            </form>
                            <div>
                                <div style={{position:"fixed",right:"10vw",bottom:"10vw"}}>
                                    <Fab
                                        onClick={changePopupState}
                                        size="small"
                                        color="primary"
                                        aria-label="add"
                                        style={{position: 'fixed'}}
                                    >
                                        ?
                                    </Fab>
                                </div>
                            </div>
                        </div>
                        : share ? <Share cancel={handleShareClose} rows={moduleRows} refresh={handleRefresh}/> :
                            editor
                                ? (
                                    <div>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems:"center"
                                        }}
                                        >
                                            <Typography variant="h5" style={{color:"navy"}}>{moduleName}</Typography>
                                            <Box sx={{flexGrow: 1}}/>
                                            <Button autoFocus onClick={handleClickOpenCidr}
                                                    startIcon={<AddIcon/>}
                                                    size={"small"}
                                                    variant={"contained"}
                                                    style={{marginRight:"0.5rem"}}
                                            >
                                                Generate CIDR
                                            </Button>
                                            <Button
                                                color="error"
                                                onClick={onClickBack}
                                                variant={"outlined"}
                                                size={"small"}
                                                style={{marginRight:"0.5rem"}}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                color="error"
                                                onClick={onClickCancel}
                                                variant={"outlined"}
                                                size={"small"}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                        <br/>
                                        {(devModeData !== "" && devModeData !== undefined && devModeData) && (
                                            <div style={{display: 'flex'}}>
                                                <div style={{width: "100%"}}>
                                                    <ProjectEditor
                                                        awsAcc={accId}
                                                        type={type}
                                                        changeReq={changeReq}
                                                        change={changeState}
                                                        createOpen={createNotOpen}
                                                        datas={devModeData}
                                                        editor={editor}
                                                        contents={contents}
                                                        isEnvSpecific={isEnvSpecific}
                                                        module={valuesModule}
                                                        name={moduleName}
                                                        onClickEditor={onClickEditor}
                                                        provider={cloudProviderValue}
                                                    />
                                                </div>
                                                <div align={"right"} style={{display: "flex", paddingTop: 330}}>
                                                    <Box sx={{'& > :not(style)': {m: 1}}}>
                                                        <Fab
                                                            onClick={changePopupState}
                                                            size="small"
                                                            color="primary"
                                                            aria-label="add"
                                                            style={{position: 'fixed'}}
                                                        >
                                                            ?
                                                        </Fab>
                                                    </Box>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                                : (
                                    <div>
                                        {createNotOpen
                                            ? (
                                                <div style={{
                                                    height: 400,
                                                    width: "100%"
                                                }}
                                                >
                                                    <div style={{display:"flex",alignItems:"center",flexDirection:"row",justifyContent:"space-between",paddingBottom:"0.5rem"}}>
                                                        <div style={{paddingBottom:"0.5rem",display:"flex",alignItems:"center"}}>
                                                            <CodeIcon style={{color:"navy"}}/>
                                                            <Typography variant="h5" style={{paddingLeft:"0.5rem"}}>
                                                                Overview
                                                            </Typography>
                                                        </div>
                                                        <div style={{display:"flex",alignItems:"center"}}>
                                                            {/*<div style={{marginRight:"6rem"}}>*/}
                                                            {/*</div>*/}
                                                            <FormControlLabel
                                                                control={
                                                                    <Switch
                                                                        checked={isDevMode}
                                                                        color="secondary"
                                                                        name="checkedB"
                                                                        onChange={onChangeDevMode}
                                                                    />
                                                                }
                                                                label="Edit Mode"
                                                                sx={{color: "#000000"}}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent:"space-between",
                                                        alignItems:"center"
                                                    }}
                                                    >
                                                        <div>
                                                            <Changerequest data={pr} changeRequestData={switchChangeRequest}/>
                                                        </div>
                                                        <div style={{
                                                            display: "flex",
                                                            flexDirection: "row"
                                                        }}>
                                                            <Box sx={{flexGrow: 1}}/>
                                                            <div align="right">
                                                                <Button onClick={refresh} size={"small"} startIcon={<Refresh/>}/>
                                                            </div>
                                                            {
                                                                userInfo &&
                                                                <Can
                                                                    perform="read_module"
                                                                    role={userInfo.identity.id}
                                                                    yes={canPlanAndValidate}
                                                                />
                                                            }
                                                            {
                                                                userInfo &&
                                                                <Can
                                                                    perform="write_module"
                                                                    role={userInfo.identity.id}
                                                                    yes={canYes}
                                                                />
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        isDevModeOn ?
                                                            <div>
                                                                <EditorHelper
                                                                    files={fileState}
                                                                    isValidate={isValidate}
                                                                    onFileContentChange={(fileName, fileContent, markers, autoComplete, onValueChange) => {
                                                                        return (
                                                                            <>
                                                                                <EditorView
                                                                                    key={fileName}
                                                                                    editorFileName={fileName}
                                                                                    editorValue={fileContent}
                                                                                    editorExpanded={false}
                                                                                    deleteFile={deleteFile}
                                                                                    editorMarkers={markers}
                                                                                    onFileSave={onFileSave}
                                                                                    autoComplete={autoComplete}
                                                                                    onValueChange={onValueChange}
                                                                                />
                                                                                <br/>
                                                                            </>
                                                                        );
                                                                    }}
                                                                    saveButtonText={changeReq === "default" ? "Create Change Request" : "Update"}
                                                                    onSave={(files) => {
                                                                        let newFiles = _.cloneDeep(files);
                                                                        let i = files.findIndex((v) => v.name === "variables.tfvars")
                                                                        if (i!==-1){
                                                                            newFiles[i].name = `variables.${environmentName != undefined ? environmentName : ""}.tfvars`;
                                                                        }
                                                                        let j = files.findIndex((v) => v.name === "backend.tfvars")
                                                                        if (j!==-1){
                                                                            newFiles[j].name = `backend.${environmentName != undefined ? environmentName : ""}.tfvars`;
                                                                        }
                                                                        handleUpdate(newFiles);
                                                                    }}
                                                                />
                                                            </div>
                                                            :
                                                            <>
                                                                <div style={{display: 'flex', flexDirection: "column"}}>
                                                                    <div style={{height: "52vh"}}>
                                                                        <DataGridComponent
                                                                            selectedValues={handleModuleSelect}
                                                                            columns={moduleColumn}
                                                                            pageSize={5}
                                                                            rows={moduleRows}
                                                                            rowsPerPageOptions={[5]}
                                                                            loading={loading}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div align={"right"}>
                                                                    <Box sx={{'& > :not(style)': {m: 1}}}>
                                                                        <Fab
                                                                            onClick={changePopupState}
                                                                            size="small"
                                                                            color="primary"
                                                                            aria-label="add"
                                                                            style={{position: 'fixed'}}
                                                                        >
                                                                            ?
                                                                        </Fab>
                                                                    </Box>
                                                                </div>
                                                            </>
                                                    }
                                                    <div>
                                                        <Dialog
                                                            aria-describedby="alert-dialog-description"
                                                            aria-labelledby="alert-dialog-title"
                                                            onClose={handleDialogClose}
                                                            open={open}
                                                        >
                                                            <DialogTitle id="alert-dialog-title">
                                                                Do you wish to continue?
                                                                <br/>
                                                                <Divider/>
                                                            </DialogTitle>
                                                            <DialogContent>
                                                                <DialogContentText id="alert-dialog-description">
                                                                    <b>Module(s) once deleted cannot be retrieved.</b>
                                                                    <br/>
                                                                    <br/>
                                                                    Are you sure you want to delete this Module?
                                                                </DialogContentText>
                                                            </DialogContent>
                                                            <DialogActions>
                                                                <Button color="primary" onClick={handleDialogClose}>
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    autoFocus
                                                                    color="error"
                                                                    onClick={handleDelete}
                                                                    variant="contained"
                                                                >
                                                                    Yes, Delete
                                                                </Button>
                                                            </DialogActions>
                                                        </Dialog>
                                                    </div>
                                                </div>
                                            )
                                            : (
                                                <div>
                                                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexDirection:"row",marginBottom:"0.5rem"}}>
                                                        <Typography variant="h5">
                                                            Create Module
                                                        </Typography>
                                                        <div>
                                                            <Button onClick={handleClose} size={"small"} variant={"outlined"} style={{marginRight:"0.5rem"}}>Cancel</Button>
                                                            {(!alreadyExist && moduleValue.name === "" && moduleValue.module === "" && moduleValue.provider === "")
                                                                ? (<Button disabled variant="contained" size={"small"}>
                                                                    Next
                                                                </Button>)
                                                                : (<Button onClick={handleCloseCreate} variant="contained" size={"small"}>
                                                                    Next
                                                                </Button>)}
                                                        </div>
                                                    </div>
                                                    <div style={{height:"65vh",overflow:"auto",paddingBottom:"1.5rem",backgroundColor:"#fafbfb",paddingLeft:"1rem",borderRadius:"0.5rem"}}>
                                                        <div>
                                                            <TextfieldInfo
                                                                name={"Module Name *"}
                                                                info={"Enter a meaningful name to identify this Module."}
                                                            />
                                                        <div>
                                                            {alreadyExist
                                                                ? (
                                                                    <TextField
                                                                        defaultValue={moduleName}
                                                                        error
                                                                        helperText="Already Exists"
                                                                        onChange={onChangeModuleName}
                                                                        size="small"
                                                                        sx={{width: 300}}
                                                                    />
                                                                )
                                                                : (
                                                                    <TextField
                                                                        defaultValue={moduleName}
                                                                        onChange={onChangeModuleName}
                                                                        size="small"
                                                                        sx={{width: 300}}
                                                                    />
                                                                )}
                                                        </div>
                                                        </div>
                                                        <Grid container spacing={20}>
                                                            <Grid
                                                                item
                                                                sm={5}
                                                                xs={12}
                                                            >
                                                                {/*<TextfieldInfo*/}
                                                                {/*    name={"Select Provider *"}*/}
                                                                {/*    info={"choose a provider."}*/}
                                                                {/*/>*/}
                                                                {/*<Autocomplete*/}
                                                                {/*    sx={{width: 300}}*/}
                                                                {/*    {...defaultProps}*/}
                                                                {/*    id="controlled-demo"*/}
                                                                {/*    onChange={onChangeCloudProvider}*/}
                                                                {/*    renderInput={renderCloudProvider}*/}
                                                                {/*    value={cloudProviderValue}*/}
                                                                {/*/>*/}
                                                                <TextfieldInfo
                                                                    name={"Select from Registry or Templates *"}
                                                                    info={"choose a provider."}
                                                                />
                                                                <div>
                                                                    <Autocomplete
                                                                        sx={{width: 300}}
                                                                        options={typesofmodule}
                                                                        id="controlled-demo"
                                                                        onChange={onChangeType}
                                                                        renderInput={renderCloudProvider}
                                                                        value={type}
                                                                    />
                                                                </div>
                                                            </Grid>
                                                            {
                                                                (type === "Registry" && cloudProviderValue) && <Grid
                                                                    item
                                                                    sm={6}
                                                                    xs={12}
                                                                >
                                                                    <TextfieldInfo
                                                                        name={"Select Module *"}
                                                                        info={"choose a module."}
                                                                    />
                                                                <div>
                                                                    {(typeof cloudProviderValue === "undefined")
                                                                        ? (
                                                                            <div>
                                                                                <Typography variant="caption">choose a
                                                                                    module</Typography>
                                                                                <br/>
                                                                                <Autocomplete
                                                                                    sx={{width: 300}}
                                                                                    {...defaultPropsProviders}
                                                                                    disabled
                                                                                    id="controlled-demo"
                                                                                    renderInput={renderModules}
                                                                                    value={""}
                                                                                />
                                                                            </div>
                                                                        )
                                                                        : (
                                                                            <div>
                                                                                <Autocomplete
                                                                                    sx={{width: 300}}
                                                                                    {...defaultPropsProviders}
                                                                                    id="controlled-demo"
                                                                                    onChange={onChangeCloudModules}
                                                                                    renderInput={renderProviderModules}
                                                                                    value={valuesModule}
                                                                                />
                                                                            </div>
                                                                        )}
                                                                </div>
                                                                </Grid>
                                                            }
                                                            {
                                                                (type === "Templates" && cloudProviderValue) &&
                                                                <Grid
                                                                    item
                                                                    sm={6}
                                                                    xs={12}
                                                                >
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
                                                                            input={<OutlinedInput id="select-multiple-chip"
                                                                                                  label="Chip"/>}
                                                                            renderValue={(selected) => (
                                                                                <Box sx={{
                                                                                    display: 'flex',
                                                                                    flexWrap: 'wrap',
                                                                                    gap: 0.5
                                                                                }}>
                                                                                    {selected?.map((value) => (
                                                                                        <Chip key={value} label={value}/>
                                                                                    ))}
                                                                                </Box>
                                                                            )}
                                                                            MenuProps={MenuProps}
                                                                        >
                                                                            {availableTemplatesList?.map((name) => (
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
                                                                </Grid>
                                                            }
                                                        </Grid>
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    checked={isEnvSpecific}
                                                                    color="secondary"
                                                                    name="checkedB"
                                                                    onChange={onChangeSetEnvSpecific}
                                                                />
                                                            }
                                                            label="Add as Environment specific"
                                                            sx={{color: "#000000",marginTop:"1rem"}}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                )
                    }
                    {/*<Backdrop*/}
                    {/*    // sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}*/}
                    {/*    open={loading}*/}
                    {/*    invisible={true}*/}
                    {/*>*/}
                    {/*    /!*<Loading />*!/*/}
                    {/*</Backdrop>*/}

                {/*</ProjectLayout>*/}
                <div>
                    <React.Fragment key={"bottom"}>
                        <Drawer
                            PaperProps={{
                                sx: {
                                    width: "50%",
                                    borderRadius: 0.5,
                                    top: 65,
                                    zIndex: '1200',
                                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                                    overflow: 'hidden',

                                }
                            }}
                            size="small"
                            anchor={"right"}
                            open={openPopup}
                            variant="persistent"
                            // sx={{position: "absolute"}}
                        >
                            <div style={{display:"flex",justifyContent:"flex-end",paddingRight:"2rem"}}>
                                <IconButton
                                    edge="end"
                                    color="inherit"
                                    onClick={changePopupState}
                                    aria-label="close"
                                >
                                    <CloseIcon/>
                                </IconButton>
                            </div>
                            <div>
                                {devModeData ?
                                    // {setDevModeState(true)}
                                    <div style={{height: '70vh', width: '100%', overflowY: 'auto', scroll}}>
                                        <PopupHelp
                                            terraformInfo={terraformInfo}
                                            providerValue={cloudProviderValue}
                                            moduleValue={valuesModule}
                                            devState={true}
                                        />
                                    </div>
                                    :
                                    <div>
                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                justifyContent: 'center',
                                                gap:"0.5rem",
                                                backgroundColor:"#fafbfb",
                                                padding:"0.5rem 0.5rem",
                                                margin:"0 0.5rem",
                                                borderRadius:"0.5rem"
                                            }}>
                                                <div style={{paddingBottom:"0.5rem"}}>
                                                    <Typography variant="inherit">
                                                        <b>Select Provider</b>
                                                    </Typography>
                                                    <br/>
                                                    <Typography variant="caption">choose a provider</Typography>
                                                    <br/>
                                                    <Autocomplete
                                                        sx={{width: 160}}
                                                        {...defaultProps}
                                                        id="controlled-demo"
                                                        onChange={onChangeCloudProvider}
                                                        renderInput={renderCloudProvider}
                                                        value={cloudProviderValue}
                                                    />
                                                </div>
                                                <div>
                                                    <div>
                                                        <Typography variant="inherit">
                                                            <b>Select Module</b>
                                                        </Typography>
                                                        <br/>
                                                        <Typography variant="caption">
                                                            choose
                                                            a {!cloudProviderValue ? "" : cloudProviderValue.title} module
                                                        </Typography>
                                                        <br/>
                                                        <Autocomplete
                                                            sx={{width: 160}}
                                                            {...defaultPropsProviders}
                                                            id="controlled-demo"
                                                            onChange={onChangeCloudModules}
                                                            renderInput={renderProviderModules}
                                                            value={valuesModule}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{height: '65vh', overflowY: 'auto', scroll,borderRadius:"0.5rem",margin:"0.5rem",backgroundColor:"#fafbfb"}}>
                                                <PopupHelp
                                                    terraformInfo={terraformInfo}
                                                    providerValue={cloudProviderValue}
                                                    moduleValue={valuesModule}
                                                    devState={false}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </Drawer>
                    </React.Fragment>
                </div>
            </div>
        </>
    );
}

