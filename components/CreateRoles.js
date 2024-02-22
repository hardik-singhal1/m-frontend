// import React, {useEffect, useState} from 'react'
// import {Button, Divider, TextField, Typography} from "@material-ui/core";
// import {DataGrid} from "@material-ui/data-grid";
// import {hostport} from "../next.config";
// import {createDetails, getDetails} from "../utils/fetch-util";
//
// export default function CreateRoles({close}) {
//
//     const actions = [];
//     // const [ actionRows ] = useState([]);
//     // const [ actionSelected ] = useState([]);
//     const actionColumn = [
//         {
//             field: "name",
//             headerName: "Name",
//             width: 250,
//             headerAlign: "center"
//         },
//         {
//             field: "description",
//             headerName: "Description",
//             width: 350,
//             headerAlign: "center"
//         }
//     ];
//
//     const [
//         actionRows,
//         setActionRows
//     ] = useState([]);
//     const [
//         actionSelected,
//         setActionSelected
//     ] = useState([]);
//
//     useEffect(() => {
//         if (roleName != "" && description != "" && actionRows != null) {
//             value.Name = roleName;
//             value.description = description;
//             value.actions = actionSelected;
//             value.object = `organization/${organizationName}`;
//             value.policy = false;
//         }
//     }, [
//         roleName,
//         description,
//         actionSelected
//     ]);
//
//     const getActions = () => {
//         try {
//             const GetActions = `${hostport}/api/v1/auth/organizations/${organizationName}/actions`;
//
//             getDetails(GetActions, "")
//                 .then((res) => {
//                     if (res) {
//                         for (let i = 0; i < res[0].length; i++) {
//                             res[0][i].id = i + 1;
//                         }
//
//                         const obj = res[0].Actions;
//
//                         handleActions(obj);
//                     } else {
//                         setActionRows([]);
//                     }
//                 })
//                 .catch((err) => {
//                     errorTrigger("error", JSON.stringify(err.message));
//                 });
//         } catch (err) {
//             errorTrigger("error", JSON.stringify(err.message));
//         }
//     };
//
//     const handleCloseCreate = () => {
//         try {
//             const createRole = `${hostport}/api/v1/auth/organizations/${organizationName}/role`;
//
//             createDetails(createRole, "", value)
//                 .then((res) => {
//                     res;
//                 })
//                 .catch((err) => {
//                     errorTrigger("error", JSON.stringify(err.message));
//                 });
//         } catch (err) {
//             errorTrigger("error", JSON.stringify(err.message));
//         }
//
//         setCreateOpen(true);
//         close;
//     };
//
//     const handleClose = useCallback(() => {
//         close;
//     },[])
//
//     const handleActions = (obj) => {
//         for (const key in obj) {
//             if (obj.hasOwnProperty(key)) {
//                 var val = obj[key];
//             }
//
//             const rowData = {
//                 id: "",
//                 name: val.Name,
//                 description: val.Description
//             };
//
//             actions.push(rowData);
//         }
//
//         for (let iter = 0; iter < actions.length; iter++) {
//             actions[iter].id = iter + 1;
//         }
//
//         setActionRows(actions);
//     };
//
//
//     useEffect(()=>{
//         getActions()
//     },[])
//
//
//     function onSelectedActionListChange(newSelectedList) {
//         setActionSelected(newSelectedList);
//     }
//
//     return (
//         <div>
//             <Typography variant="h4">Create Role</Typography>
//             <br />
//             <Typography variant="h6">Name the role</Typography>
//             <br />
//             <Divider />
//             <br />
//             <Typography variant="inherit">Role Name</Typography>
//             <br />
//             <Typography variant="caption">
//                 Enter a role name to assign it to users.
//             </Typography>
//             <br />
//             <TextField
//                 defaultValue={roleName}
//                 onChange={(event) => {
//                     setRoleName(event.target.value);
//                 }}
//                 size="small"
//                 sx={{ width: 300 }}
//             />
//             <br />
//             <br />
//             <Divider />
//             <br />
//             <Typography variant="h6">Add Role Description</Typography>
//             <br />
//             <Typography variant="caption">
//                 Enter a description for this role.
//             </Typography>
//             <br />
//             <TextField
//                 defaultValue={description}
//                 onChange={(event) => {
//                     setDescription(event.target.value);
//                 }}
//                 size="small"
//                 sx={{ width: 300 }}
//             />
//             <br />
//             <br />
//             <Divider />
//             <br />
//             <Typography variant="h6">Level of Action</Typography>
//             <br />
//             <div style={{ height: 400,
//                 width: "100%" }}
//             >
//                 <DataGrid
//                     checkboxSelection
//                     columns={actionColumn}
//                     disableSelectionOnClick
//                     onSelectionModelChange={(newSelectionModel) => {
//                         onSelectedActionListChange(actionRows.filter((event) => newSelectionModel.includes(event.id)));
//                     }}
//                     pageSize={5}
//                     rows={actionRows}
//                     rowsPerPageOptions={[5]}
//                 />
//             </div>
//             <Divider />
//             <br />
//             <div align="right">
//                 <Button onClick={handleClose}>Cancel</Button>
//                 <Button onClick={handleCloseCreate} variant="contained">
//                     Create
//                 </Button>
//             </div>
//         </div>
//
//     )
// }