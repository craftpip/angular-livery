import {Component, OnInit} from '@angular/core';
import {ROUTES} from './sidebar-routes.config';
import {RouteInfo} from "./sidebar.metadata";
import {Router, ActivatedRoute} from "@angular/router";
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
        let g = this.user.group;
        if (typeof ROUTES[g] === 'undefined') {
            this.menuItems = [];
        } else {
            this.menuItems = ROUTES[this.user.group].filter(menuItem => {
                return !menuItem.hide;
            });
        }
    }
}
