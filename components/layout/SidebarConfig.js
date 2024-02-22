import {Icon} from '@iconify/react';
import home from '@iconify/icons-eva/home-fill';
import cubeFill from '@iconify/icons-eva/cube-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import EqualizerIcon from '@mui/icons-material/Equalizer';
import CloudIcon from '@mui/icons-material/Cloud';

const getIcon = (name) => <Icon icon={name} width={22} height={22}/>;
// each menu will have different set of minimum access for it to be accessible for the user
// so follow the below format if in future there needs to be added any new menu and if the menu has subMenus make sure the
// children array also follows the same format as used below.this sidebar format would be altered a little and
// would be sent to backend for further validation purposes...( Praveen R - praveen.ravi@bootlabstech.com)

// access_level = [] implies that the specific menu doesn't need any access.
const sidebarConfig = [
    {
        access_level:[],
        disabled:false,
        title: 'home',
        path: '/',
        icon: getIcon(home)
    },
    {
        access_level: [],
        disabled:false,
        title: 'projects',
        path: '/projects',
        icon: getIcon(cubeFill)
    },
    {
        access_level: [],
        disabled:false,
        icon: <CloudIcon />,
        path: "/CIDR",
        title: "CIDR"
    },
    {
        access_level: ["read_templates"],
        disabled:false,
        title: 'templates',
        path: '/templates',
        icon: getIcon(fileTextFill)
    },
    {
        access_level: ["read"],
        disabled:false,
        title: 'logs',
        path: '/logs',
        icon: <EqualizerIcon/>
    },
    {
        access_level: ["read"],
        disabled:false,
        title: 'IAM',
        icon: getIcon(peopleFill),
        children: [
            {
                access_level:["read","read_users"],
                disabled:false,
                title: 'Users',
                path: '/iam/users',
            },
            {
                access_level:["read","read_group"],
                disabled:false,
                title: 'Groups',
                path: '/iam/groups',
            },
            {
                access_level:["read","read_role"],
                disabled:false,
                title: 'Roles',
                path: '/iam/roles',
            }
        ]
    },
    {
        title: 'settings',
        children: [
            {
                access_level:[],
                disabled:false,
                title: 'Git',
                path: '/settings/git'

            },
            {
                access_level:[],
                disabled:false,
                title: 'Cloud',
                path :'/settings/cloud'
            },
            {
                access_level:[],
                disabled:false,
                title : "Developer settings",
                path :'/settings/developer-settings'
            }
        ],
        icon: <SettingsIcon/>,
    }
];

export default sidebarConfig;
