import { Icon } from "@iconify/react";
import bxGitPullRequest from "@iconify/icons-bx/bx-git-pull-request";
import cubeFill from "@iconify/icons-eva/cube-fill";
import fileOutput from "@iconify/icons-lucide/file-output";
import fileTextFill from "@iconify/icons-eva/file-text-fill";
import peopleFill from "@iconify/icons-eva/people-fill";
import symbolVariable from "@iconify/icons-codicon/symbol-variable";
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import playCircleFill from '@iconify/icons-eva/play-circle-fill';
import EqualizerIcon from "@mui/icons-material/Equalizer";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import DashboardIcon from '@mui/icons-material/Dashboard';
import DnsIcon from '@mui/icons-material/Dns';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import CloudIcon from '@mui/icons-material/Cloud';
import SecurityIcon from '@mui/icons-material/Security';

const getIcon = (name) => (<Icon
    height={22}
    icon={name}
    width={22}
/>);
// for more information on the format to follow on adding new menus look at /components/layout/SidebarConfig.js file
const sidebarConfig = [
    {
        access_level:[],
        disabled:false,
        title: 'Dashboard',
        path: '/dashboard',
        icon:  <DashboardIcon/>
    },
    {
        access_level:[],
        disabled:false,
        icon: <CodeIcon />,
        path: "/",
        title: "Overview"
    },
    {
        access_level: [],
        disabled: false,
        icon: <CloudIcon />,
        path: "/CIDR",
        title: "CIDR"
    },
    {
        access_level: ["read"],
        disabled: false,
        icon: getIcon(bxGitPullRequest),
        path: "/pullrequests",
        title: "pull-requests"
    },
    {
        access_level: ["read"],
        disabled: false,
        icon: getIcon(playCircleFill),
        path: "/runs",
        title: "runs"
    },
    {
        access_level:["read"],
        disabled:false,
        title: 'DNS',
        path: '/dns',
        icon:  <DnsIcon/>
    },
    {
        access_level:["read"],
        disabled:false,
        title: 'projects logs',
        path: '/projectlogs',
        icon:  <EqualizerIcon/>
    },
    {
        access_level: ["read"],
        disabled: false,
        children: [
            {
                access_level:["read"],
                disabled:false,
                path: "/security/ingress",
                title: "Ingress"
            },
            {
                access_level:["read"],
                disabled:false,
                path: "/security/prisma",
                title: "Prisma"
            }
        ],
        icon:<SecurityIcon />,
        title: "Security"
    },
    {
        access_level: ["read"],
        disabled: false,
        children: [
            {
                access_level:["read","read_role"],
                disabled:false,
                path: "/iam/roles",
                title: "Roles"
            }
        ],
        icon: getIcon(peopleFill),
        title: "IAM"
    },
    {
        access_level: ["read"],
        disabled: false,
        title: 'Inventory',
        children: [
            {
                access_level:["read"],
                disabled:false,
                title: 'Application Catalog',
                path: '/inventory/catalogs',
            },
            {
                access_level:["read"],
                disabled:false,
                title: 'Graph',
                path: '/inventory/graph',
            },
            {
                access_level:["read"],
                disabled:false,
                title: 'Table',
                path: '/inventory/table',
            }
        ],
        icon: <InventoryRoundedIcon/>
    },
  {
        access_level:["read"],
        disabled:false,
        title: 'Settings',
        children: [
            {
                access_level:["read"],
                disabled:false,
                title: 'General',
                path: '/settings/general',
            },
            {
                access_level:["read"],
                disabled:false,
                title: 'Business',
                path: '/settings/business',
            }
        ],
        icon:  <SettingsIcon/>
    }
];

export default sidebarConfig;
