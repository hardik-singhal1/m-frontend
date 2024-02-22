import React, {useContext, useEffect, useState} from 'react';
import {Button, DialogActions, DialogContent, Rating, Typography} from "@mui/material";
import {Dialog, DialogContentText, DialogTitle, TextField} from "@material-ui/core";
import ReviewsIcon from "@mui/icons-material/Reviews";
import Zoom from "@mui/material/Zoom";
import {Box} from "@mui/system";
import StarIcon from "@mui/icons-material/Star";
import {useRouter} from "next/router";
import {SnackbarContext} from "../../../../lib/toaster/SnackbarContext";
import {hostport} from "../../../../next.config";
import {createDetails} from "../../../../utils/fetch-util";
import {AuthContext} from "../../../../lib/authContext";

function Feedback() {
    const [rating,setRating] = useState(null);
    const { userData } = useContext(AuthContext);
    const [ratingValue,setRatingValue] = useState(null);
    const [hover, setHover] = useState(-1);
    const [review,setReview] = useState("");
    const router = useRouter();
    const { setSnackbar } = useContext(SnackbarContext);
    const labels = {
        0.5: '',
        1: '',
        1.5: 'Ok',
        2: 'Ok+',
        2.5: 'Good',
        3: 'Good+',
        3.5: 'Very_Good',
        4: 'Very_Good+',
        4.5: 'Excellent',
        5: 'Excellent+',
    };

    const [organizationName,setOrganizationName] = useState("");

    useEffect(()=>{
        if(router.isReady){
            setOrganizationName(router.query.organization_name);
        }
    },[router])

    function getLabelText(value) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }

    const postFeedback = (params) =>{
        let url = `${hostport}/api/v1/organizations/${organizationName}/feedback/`;
        const date=new Date()
        let payload={...params,name:userData?.identity?.traits?.first_name,email:userData?.identity?.traits?.email,id:`${userData?.identity.id}/${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`}
        let uid=Math.floor((Math.random() * 10000) + 1);
        setSnackbar("Submitting Feedback ...","loading",uid)

        createDetails(url, "","","", payload)
            .then((res) => {
                setSnackbar("Thanks for your valuable feedback","success",uid);
                router.push(`/organization/${organizationName}/`)
            })
            .catch((err) => {
                setSnackbar(err.response?.data?.response_message || err.message,"error",uid)
            })
    }

    return (
        <>
            <div style={{display:"flex",marginTop:"1rem",justifyContent:"space-between",marginRight:"1rem"}}>
                <div style={{display:"flex",alignItems:"center",marginBottom:"1rem"}}>
                    <ReviewsIcon style={{color:"navy",marginRight:"0.5rem"}}/>
                    <Typography fontWeight={"bold"} variant={"h6"} sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`}}>Leave a Review</Typography>
                </div>
                <div>
                    <Button
                        onClick={()=>{
                            if(ratingValue===null){
                                setSnackbar("Please fill the rating","error")
                            }
                            else {
                                postFeedback({stars:ratingValue,review:review})
                            }
                        }}
                        variant="contained"
                        style={{borderRadius:"10px"}}
                        size={"small"}
                        sx={{
                            "&.MuiButton-contained": { backgroundColor: "#1b4077" },
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </div>
            <div style={{display:"flex"}}>
                <div style={{width:"60%"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
                        <div>
                            <div style={{padding:"0.5rem 0"}}>
                                <Typography sx={{fontWeight:"600",fontFamily:`"Public Sans", sans-serif`,fontSize:"14px"}}>Rate us *</Typography>
                            </div>
                            <Zoom
                                in={true}
                                style={{ transformOrigin: '0 0 0' }}
                                {...{ timeout: 1000 }}
                            >
                                <Box
                                    sx={{
                                        width: 200,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Rating
                                        name="size-large"
                                        size="large"
                                        defaultValue={0}
                                        value={ratingValue}
                                        precision={0.5}
                                        getLabelText={getLabelText}
                                        onChange={(event, newValue) => {
                                            setRatingValue(newValue);
                                        }}
                                        onChangeActive={(event, newHover) => {
                                            setHover(newHover);
                                        }}
                                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                                    {ratingValue !== null && (
                                        <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : ratingValue]}</Box>
                                    )}
                                </Box>
                            </Zoom>
                        </div>
                    </div>
                    <div style={{height:"100%"}}>
                        <div style={{paddingBottom:"1rem"}}>
                            <Typography sx={{fontWeight:"600",fontSize:"14px",fontFamily:`"Public Sans", sans-serif`}}>Provide your Feedback here </Typography>
                        </div>
                        <div style={{height:"100%"}}>
                            <Zoom
                                in={true}
                                style={{ transformOrigin: '0 0 0' }}
                                {...{ timeout: 1000 }}
                            >
                            <TextField
                                multiline
                                rows={10}
                                // InputProps={{ sx: { height: 250 } }}
                                placeholder={"Review"}
                                value={review}
                                onChange={(event) => setReview(event.target.value)}
                                size="small"
                                sx={{width: "100%"}}
                                inputProps={{
                                    maxLength : 2000
                                }}
                                required
                            />
                            </Zoom>
                        </div>
                    </div>
                </div>
                <div style={{width:"40%"}}>
                    <Zoom
                        in={true}
                        // style={{ transformOrigin: '0 0 0' }}
                        {... { timeout: 1000 }}
                    >
                        <img src="/review.svg" alt="review" width="100%" height="100%" />
                    </Zoom>
                </div>
            </div>
        </>
    );
};

export default Feedback;
