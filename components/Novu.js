import { NovuProvider, PopoverNotificationCenter, NotificationBell, useNotifications} from '@novu/notification-center';
import {AppBar, Button, Typography} from "@mui/material";
import { useContext } from 'react';
import { ErrorContext } from '../lib/errorContext';
import { AuthContext } from '../lib/authContext';
import { useRouter } from 'next/router';

export default function Novu() {
    const {userData} = useContext(AuthContext);
    const router = useRouter();

    function onNotificationClick(event) {
        router.push(event?.payload?.link)
    }
    function header(){
        const {
            markAsSeen,notifications
        } = useNotifications();
        return(
            <div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",padding:"1rem 1rem"}}>
                <Typography variant={"h6"} fontWeight={"bold"} color={"#828299"}>Notifications</Typography>
                <Button onClick={()=>{
                    notifications.map(async (noti)=>{
                        if(noti.seen===false){
                            try{
                                await markAsSeen(noti._id);
                            }catch(err){
                                console.log("err",JSON.stringify(err.message));
                            }
                        }
                    })
                }
                }>Mark as read</Button>
            </div>
        )
    }
    return (
            <NovuProvider subscriberId={userData?.identity.traits.email} applicationIdentifier={'5D-WuWbjLNTl'}>
                {/*<AppBar position={"static"} style={{backgroundColor:"inherit",boxShadow:"none"}}>*/}
                    <PopoverNotificationCenter onNotificationClick={onNotificationClick} header={header} footer={()=>""} colorScheme={'light'}>
                        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount}/>}
                    </PopoverNotificationCenter>
                {/*</AppBar>*/}
            </NovuProvider>
    );
}
