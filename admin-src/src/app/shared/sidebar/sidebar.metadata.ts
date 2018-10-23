export interface RouteInfo {
    path: string,
    title: string,
    titleKey?: string,
    icon: string,
    class: string,
    badge: string,
    badgeClass: string,
    isExternalLink: boolean,
    submenu: RouteInfo[],
    hide?: boolean,
}
