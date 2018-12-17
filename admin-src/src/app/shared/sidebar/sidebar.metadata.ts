export interface RouteInfo {
    path?: string,
    title?: string,
    titleKey?: string,
    icon?: string,
    class?: string,
    badge?: string,
    badgeClass?: string,
    isExternalLink?: boolean,
    submenu?: RouteInfo[],
    hide?: boolean,
    userGroup?: string,
    routeGroupKey?: string,
}

export interface RouteGroupInfo {
    title: string,
    path: string,
    langKey: string,
    routeKey: string,
    icon: string,
    class: string,
    badge: string,
    isExternalLink: boolean,
}