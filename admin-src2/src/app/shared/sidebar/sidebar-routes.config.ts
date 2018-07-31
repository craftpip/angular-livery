import {RouteInfo} from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
    {
        path: '/home', title: 'Dashboard', icon: 'ft-layout', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    },
    {
        path: '/users', title: 'Users', icon: 'ft-users', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    },
    {
        path: '/demo/calendar', title: 'Calendar', icon: 'ft-calendar', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    },
    // {
    //     path: '/demo/list1', title: 'List1', icon: 'ft-users', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    // }, // this page exists but is not useful for demo
    {
        path: '/demo/tabs', title: 'Tabs', icon: 'ft-tag', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: []
    },
    {
        path: '', title: 'Menu Levels', icon: 'ft-align-left', class: 'has-sub', badge: '1', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false,
        submenu: [
            {path: 'javascript:;', title: 'Second Level', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: []},
            {
                path: '', title: 'Second Level Child', icon: '', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
                submenu: [
                    {path: 'javascript:;', title: 'Third Level 1.1', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: []},
                    {path: 'javascript:;', title: 'Third Level 1.2', icon: '', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: []},
                ]
            },
        ]
    },
];
