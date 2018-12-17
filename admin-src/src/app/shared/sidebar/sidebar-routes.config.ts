import {RouteGroupInfo, RouteInfo} from './sidebar.metadata';


export const ROUTE_GROUPS: RouteGroupInfo[] = [
    {
        title: 'Operations',
        path: '',
        langKey: 'operations',
        routeKey: 'operations',
        icon: 'ft-briefcase',
        class: '',
        badge: '',
        isExternalLink: false,
    },
    {
        title: 'Master',
        path: '',
        langKey: 'master',
        routeKey: 'master',
        icon: 'ft-lock',
        class: '',
        badge: '',
        isExternalLink: false,
    },
];


export const ROUTES: RouteInfo[] = [ // admin
    {
        path: '/home',
        title: 'Dashboard',
        titleKey: 'dashboard', // !!NEW this is the language key.
        icon: 'ft-layout',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        userGroup: '100',
        routeGroupKey: 'operations',
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
        submenu: [],
        userGroup: '100',
        routeGroupKey: 'master',
    },
    {
        path: '/sitefield',
        title: 'Site & Field Master',
        titleKey: 'siteFieldMaster',
        icon: 'ft-users',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        userGroup: '100',
        routeGroupKey: 'master',
    },
    {
        path: '/product',
        title: 'Product Master',
        titleKey: 'productMaster',
        icon: 'ft-package',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        userGroup: '100',
        routeGroupKey: 'master',
    },
    // {
    //     path: '/demo/calendar',
    //     title: 'Calendar',
    //     icon: 'ft-calendar',
    //     class: '',
    //     badge: '',
    //     badgeClass: '',
    //     isExternalLink: false,
    //     submenu: [],
    //     userGroup: '100',
    //     routeGroupKey: 'master',
    // },
    // {
    //     path: '/demo/tabs',
    //     title: 'Tabs',
    //     icon: 'ft-tag',
    //     class: '',
    //     badge: '',
    //     badgeClass: '',
    //     isExternalLink: false,
    //     submenu: [],
    //     userGroup: '100',
    //     routeGroupKey: 'master',
    // },
    // {
    //     path: '',
    //     title: 'Menu Levels',
    //     icon: 'ft-align-left',
    //     class: 'has-sub',
    //     badge: '1',
    //     badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1',
    //     isExternalLink: false,
    //     userGroup: '100',
    //     routeGroupKey: 'master',
    //     submenu: [
    //         {
    //             path: 'javascript:;',
    //             title: 'Second Level',
    //             icon: '',
    //             class: '',
    //             badge: '',
    //             badgeClass: '',
    //             isExternalLink: true,
    //             submenu: [],
    //             userGroup: '100',
    //             routeGroupKey: 'master',
    //         },
    //         {
    //             path: '',
    //             title: 'Second Level Child',
    //             icon: '',
    //             class: 'has-sub',
    //             badge: '',
    //             badgeClass: '',
    //             isExternalLink: false,
    //             userGroup: '100',
    //             routeGroupKey: 'master',
    //             submenu: [
    //                 {
    //                     path: 'javascript:;',
    //                     title: 'Third Level 1.1',
    //                     icon: '',
    //                     class: '',
    //                     badge: '',
    //                     badgeClass: '',
    //                     isExternalLink: true,
    //                     submenu: [],
    //                     userGroup: '100',
    //                     routeGroupKey: 'master',
    //                 },
    //                 {
    //                     path: 'javascript:;',
    //                     title: 'Third Level 1.2',
    //                     icon: '',
    //                     class: '',
    //                     badge: '',
    //                     badgeClass: '',
    //                     isExternalLink: true,
    //                     submenu: [],
    //                     userGroup: '100',
    //                     routeGroupKey: 'master',
    //                 },
    //             ]
    //         },
    //     ]
    // },
    {
        path: '/languages',
        title: 'Languages',
        icon: 'ft-layout',
        class: '',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        submenu: [],
        userGroup: '100',
        routeGroupKey: 'master',
        // routeGroupKey: 'operations',
    },
    {
        path: '',
        title: 'Daily Sales',
        icon: 'ft-edit',
        isExternalLink: false,
        userGroup: '100',
        routeGroupKey: 'operations',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        submenu: [
            {
                path: '/daily-sales/entry',
                title: 'Sales entry',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: [],
                userGroup: '100',
                routeGroupKey: 'operations',
            },
            {
                path: '/daily-sales/list',
                title: 'Sales listing',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: [],
                userGroup: '100',
                routeGroupKey: 'operations',
            },
            {
                path: '/daily-summary',
                title: 'Sales summary',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: [],
                userGroup: '100',
                routeGroupKey: 'operations',
            },
            {
                path: '/daily-analytics',
                title: 'Sales analytics',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: [],
                userGroup: '100',
                routeGroupKey: 'operations',
            },
        ]
    },

    {
        path: '',
        title: 'Daily Bank',
        icon: 'icon icon-wallet',
        isExternalLink: false,
        userGroup: '100',
        routeGroupKey: 'operations',
        class: 'has-sub',
        badge: '',
        badgeClass: '',
        submenu: [
            {
                path: '/bank-statement/entry',
                title: 'Bank stmt. entry',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: [],
                userGroup: '100',
                routeGroupKey: 'operations',
            },
            {
                path: '/bank-statement/list',
                title: 'Bank stmt. listing',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: [],
                userGroup: '100',
                routeGroupKey: 'operations',
            },
            {
                path: '/bank-statement/analysis',
                title: 'Bank stmt. analysis',
                icon: '',
                class: '',
                badge: '',
                badgeClass: '',
                isExternalLink: false,
                submenu: [],
                userGroup: '100',
                routeGroupKey: 'operations',
            },
        ]
    },
];
