import {Component, OnInit} from '@angular/core';
import {ROUTES} from './sidebar-routes.config';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";

declare var $: any;

@Component({
    // moduleId: module.id,
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public user: any = {};

    constructor(private router: Router,
                public authService: AuthService,
                private route: ActivatedRoute) {

        this.user = this.authService.getUser();
    }

    ngOnInit() {
        $.getScript('./assets/js/app-sidebar.js');

        let currentUrl = this.router.url;
        this.updateMenuByUrl(currentUrl);
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                let url = event.urlAfterRedirects;
                this.updateMenuByUrl(url);
            }
        });
    }

    updateMenuByUrl(url) {
        url = url.substr(1);
        let selectedPages = ROUTES.filter(a => {
            if (a.submenu.length) {
                let selectedSubMenu = a.submenu.filter(b => {
                    return url.indexOf(a.path.substr(1)) != -1;
                });
                if (selectedSubMenu.length) {
                    return true;
                }
            }

            if (a.path.trim()) {
                // ?
                // God damn
                // we have to search in child menu's too.
                return url.indexOf(a.path.substr(1)) != -1;
            }
        });

        // console.log(selectedPages);
        // console.log(url);


        if (selectedPages.length) {
            let routeGroupKey = selectedPages[0].routeGroupKey;
            this.updateMenu(routeGroupKey);
        }
    }

    updateMenu(routeGroupKey) {
        let g = this.user.group;

        this.menuItems = ROUTES.filter(menuItem => {
            return !menuItem.hide && menuItem.userGroup == this.user.group && menuItem.routeGroupKey == routeGroupKey;
        });
    }
}
