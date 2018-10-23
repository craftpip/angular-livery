import {RouteInfo} from './sidebar.metadata';

export const ROUTES: {
    [key: string]: RouteInfo[],
} = {
    '100': [ // admin
        {
            path: '/home',
            title: 'Dashboard',
            titleKey: 'dashboard', // !!NEW this is the language key.
            icon: 'ft-layout',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
        {
            path: '/languages',
            title: 'Languages',
            icon: 'ft-layout',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
        {
            path: '/users',
            title: 'Users',
            titleKey: 'users',
            icon: 'ft-users',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
        {
            path: '/demo/calendar',
            title: 'Calendar',
            icon: 'ft-calendar',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
        {
            path: '/demo/tabs',
            title: 'Tabs',
            icon: 'ft-tag',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
        {
            path: '',
            title: 'Menu Levels',
            icon: 'ft-align-left',
            class: 'has-sub',
            badge: '1',
            badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1',
            isExternalLink: false,
            submenu: [
                {
                    path: 'javascript:;',
                    title: 'Second Level',
                    icon: '',
                    class: '',
                    badge: '',
                    badgeClass: '',
                    isExternalLink: true,
                    submenu: []
                },
                {
                    path: '',
                    title: 'Second Level Child',
                    icon: '',
                    class: 'has-sub',
                    badge: '',
                    badgeClass: '',
                    isExternalLink: false,
                    submenu: [
                        {
                            path: 'javascript:;',
                            title: 'Third Level 1.1',
                            icon: '',
                            class: '',
                            badge: '',
                            badgeClass: '',
                            isExternalLink: true,
                            submenu: []
                        },
                        {
                            path: 'javascript:;',
                            title: 'Third Level 1.2',
                            icon: '',
                            class: '',
                            badge: '',
                            badgeClass: '',
                            isExternalLink: true,
                            submenu: []
                        },
                    ]
                },
            ]
        },
    ],
    '1': [ //customer
        {
            path: '/home',
            title: 'Dashboard',
            icon: 'ft-layout',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
        // {
        //     path: '/ledger-mapping',
        //     title: 'Ledger Mapping',
        //     icon: 'ft-users',
        //     class: '',
        //     badge: '',
        //     badgeClass: '',
        //     isExternalLink: false,
        //     submenu: [],
        // },
        {
            path: '/ledger-format',
            title: 'Data mapping',
            icon: 'ft-copy',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: [],
        },
        {
            path: '/ledger-mapping',
            title: 'Create data mapping',
            icon: 'ft-copy',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: [],
            hide: true,
        },
        {
            path: '/ledger',
            title: 'Data sets',
            icon: 'ft-box',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
        {
            path: '/tax-return/customer-view',
            title: 'Tax Returns',
            icon: 'ft-check-circle',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
    ],
    '80': [ // account handler
        {
            path: '/home',
            title: 'Dashboard',
            icon: 'ft-airplay',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
        {
            path: '/user-list',
            title: 'Customer List',
            icon: 'ft-users',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
        {
            path: '/manage/ledger-format',
            title: 'Data Formats',
            icon: 'ft-align-center',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: [],
        },
        {
            path: '/manage/ledger-format/create',
            title: 'Create data formats',
            icon: 'ft-align-center',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: [],
            hide: true,
        },
        {
            path: '/ledger',
            title: 'Uploaded Data',
            icon: 'ft-box',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
        {
            path: '/tax-return',
            title: 'Tax Return',
            icon: 'ft-check-circle',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
    ],
    '91': [ // sales
        {
            path: '/home',
            title: 'Dashboard',
            icon: 'ft-layout',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: [],
        }, {
            path: '/ledger-format',
            title: 'Ledger formats',
            icon: 'ft-users',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
        {
            path: '/customer-verification',
            title: 'Customer verification',
            icon: 'ft-users',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
    ],
    '90': [
        {
            path: '/customer-assign',
            title: 'Customer assignment',
            icon: 'ft-users',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: [],
        }, {
            path: '/home',
            title: 'Dashboard',
            icon: 'ft-layout',
            class: '',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
            submenu: []
        },
    ]
};
