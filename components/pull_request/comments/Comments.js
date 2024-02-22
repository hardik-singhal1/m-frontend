import Typography from "@material-ui/core/Typography";
import {Box, Divider} from "@mui/material";
import {Button, ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import React, {useCallback, useEffect, useState} from "react";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import IconButton from "@mui/material/IconButton";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {hostport} from "../../../next.config";
import {createDetails, deleteDetails, updateDetails} from "../../../utils/fetch-util";
import router from "next/router";
import EditIcon from '@material-ui/icons/Edit';
import {Refresh} from "@material-ui/icons";
import DeleteIcon from '@material-ui/icons/Delete';
import CommentIcon from '@material-ui/icons/Comment';
import ChatBubbleOutlineRoundedIcon from '@material-ui/icons/ChatBubbleOutlineRounded';
import Avatar from 'react-avatar';
import DialogContentText from "@mui/material/DialogContentText";


export default function Comments() {
    const[edit,setEdit] = useState(false)
    const [commentId,setCommentId] = useState("")
    const [editcomment,setEditcomment] = useState("")
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState([])
    const {project_name} = router.query;
    const {organization_name} = router.query;
    const {environment_name} = router.query;
    const {pull_request} = router.query;
    const {pull_request_id} = router.query;

    const handlePostComment = useCallback(() => {
        try {
            const requestbody = {
                "git": "bitbucket",
                "project": project_name,
                "organization": organization_name,
                "change_request_id": pull_request_id,
                "changeRequestComment": comment
            };
            const PullrequestComment = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/git/changeRequest/comment`;

            createDetails(PullrequestComment, "", "", "", requestbody)
                .then((res) => {
                    handleGetComments()
                    handleGetComments()
                })
                .catch((err) => {
                    console.log("Err", err.message);
                });
        } catch (err) {
            console.log("err", err);
        }
    })


    const handleGetComments = useCallback(() => {
        try {
            const requestbody = {
                "git": "bitbucket",
                "project": project_name,
                "organization": organization_name,
                "change_request_id": pull_request_id,

            };
            const GetPullrequestComments = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/git/changeRequest/comments`;

            updateDetails(GetPullrequestComments, "", requestbody, "")
                .then((res) => {
                    if (res.response_data) {
                        setComments(res.response_data.reverse())
                        setComment("")
                    } else {
                        setComments([])
                    }
                })
                .catch((err) => {
                    console.log("Err", err.message);
                });
        } catch (err) {
            console.log("err", err);
        }
    })


    const handleDeleteComments = useCallback((comment_id) => {
        try {
            const requestbody = {
                "git": "bitbucket",
                "project": project_name,
                "organization": organization_name,
                "change_request_id": pull_request_id,
                "commentId": String(comment_id)

            };
            const DeletePullrequestComments = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/git/changeRequest/comment`;

            deleteDetails(DeletePullrequestComments, "", "","",requestbody,"")
                .then((res) => {
                        handleGetComments()

                })
                .catch((err) => {
                    console.log("Err", err.message);
                });
        } catch (err) {
            console.log("err", err);
        }
    })

    const handleEditComments = useCallback(() => {
        console.log("enters")
        try {
            const requestbody = {
                "git": "bitbucket",
                "project": project_name,
                "organization": organization_name,
                "change_request_id": pull_request_id,
                "commentId": commentId,
                "changeRequestComment":editcomment,


            };
            const EditPullrequestComments = `${hostport}/api/v1/organizations/${organization_name}/projects/${project_name}/environment/${environment_name}/modules/git/changeRequest/comment`;

            updateDetails(EditPullrequestComments, "", requestbody,"")
                .then((res) => {
                    handleGetComments()
                    setEdit(false)

                })
                .catch((err) => {
                    console.log("Err", err.message);
                });
        } catch (err) {
            console.log("err", err);
        }
    })

    const handleComment = useCallback((e) => {
        setComment(e.target.value)
    })

    const handleEditComment = useCallback((e) => {
        setEditcomment(e.target.value)
    })


    useEffect(() => {
        handleGetComments()
    }, [router, organization_name, project_name, environment_name])


    return (
        <div style={{dispay:"flex",flexDirection:"row"}}>
            {
                edit && <div> <Dialog open={true} fullWidth={"100%"} >
                    <DialogTitle>
                        <div style={{display: "flex", flexDirection: "row", flex: "wrap"}}>
                            <div>
                                <CommentIcon/>
                            </div>
                            <div style={{paddingLeft: 20}}>
                                <Typography><b>Comment</b></Typography>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            value={editcomment}
                            multiline sx={{width: "100%"}}
                            onChange={(e) => handleEditComment(e)}
                            placeholder={"Enter your comments here ....."}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{borderRadius:8}} color={"secondary"} onClick={() => {
                            setEdit(false)
                        }
                        } >Cancel</Button>
                        <Button sx={{borderRadius:8}} disabled={editcomment.length>0?false:true} onClick={handleEditComments} >Save</Button>
                    </DialogActions>
                </Dialog>
                </div>
            }
        <div>
            <br/>
            <div style={{display: "flex", flexDirection: "row"}}>
                    <CommentIcon/>&nbsp;
                <Typography variant={"h6"}>
                    <b>Comments</b>
                </Typography>
                <Box flexGrow={"1"}/>
                <IconButton onClick={handleGetComments}><Refresh color={"primary"}/></IconButton>
            </div>

            <br/>
            <Divider/>
            <br/>
            <br/>
            <div>
                <div>
                    <TextField
                        value={comment}
                        multiline sx={{width: "100%"}}
                        onChange={(e) => handleComment(e)}
                        placeholder={"Enter your comments here ....."}
                    />
                </div>
                <br/>
                <div style={{display: "flex", flexDirection: "row", flex: "wrap"}}>
                    <div>
                        <CommentIcon/>
                    </div>
                    <div style={{paddingLeft: 20}}>
                        <Typography><b>{comments.length} Comments</b></Typography>
                    </div>
                    <Box flexGrow={1}/>
                    <div>
                        <Button sx={{borderRadius:8}} disabled={comment.length >0?false:true} onClick={handlePostComment} variant={"contained"}>
                            Save
                        </Button>
                    </div>


                </div>
            </div>
            <br/>
            <div style={{height: 300, width: "100%", overflowY: "scroll", scrollMarginBlockEnd: "1"}}>
                {
                    comments.map((e) => {
                        return (
                            <div style={{padding: 10}}>
                                <div style={{display: "flex", flexDirection: "row", gap: 10}}>
                                    <div>
                                        <Avatar size={"30"} round name={e.commentedBy}/>
                                    </div>
                                    <div>
                                        <Typography variant={"inherit"}>{e.commentedBy}</Typography>
                                    </div>
                                    &nbsp;
                                </div>
                                <div style={{paddingLeft: 40}}>
                                    <Typography
                                        variant={"subtitle1"}
                                    >
                                        {e.comment}
                                    </Typography>
                                </div>
                                <br/>
                                <div style={{paddingLeft: 40,display : "flex", flexDirection : "row"}}>
                                    <Button onClick={() => {
                                        setEdit(true)
                                        setEditcomment(e.comment)
                                        setCommentId(String(e.commentId))
                                    }} size={"small"} sx={{color:"gray"}} startIcon ={<EditIcon/>}>
                                        Edit
                                    </Button>
                                    <Box flexGrow={0.04}></Box>
                                    <Button  size={"small"} sx={{color:"gray"}} onClick={() => {handleDeleteComments(e.commentId)}} startIcon ={<DeleteIcon/>}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )
                    })
                }


            </div>
        </div>
        </div>
    );
}