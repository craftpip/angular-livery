import {Injectable} from '@angular/core';
import {AppEvents} from "../helper.service";

declare const $: any;

@Injectable()
export class AuthService {
    user: any = {};
    public token: any;

    public userUpdateEvent = 'user-update';
    public userLogoutEvent = 'user-logout';

    public groupMap = {
        '100': 'Admin',
        '91': 'Sales',
        '90': 'Manager',
        '80': 'Account handler',
        '1': 'Customer',
    };

    constructor(
        private events: AppEvents,
    ) {
        this.token = window.localStorage.getItem('token') || false;
        let user = window.localStorage.getItem('user');
        try {
            this.user = JSON.parse(user);

        } catch (e) {
            this.logout();
        }
    }

    getGroups() {
        return this.groupMap;
    }

    getGroup(group) {
        return this.groupMap[group] || false;
    }

    setUser(user) {
        this.user = user;
        window.localStorage.setItem('user', JSON.stringify(user));
        this.events.broadcast(this.userUpdateEvent, this.getUser());
    }

    setToken(token) {
        this.token = token;
        window.localStorage.setItem('token', this.token);
    }

    getToken() {
        return this.token;
    }

    logout() {
        this.user = {};
        this.token = false;
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
        this.events.broadcast(this.userLogoutEvent);
    }

    getUser() {
        return this.user;
    }

    isAuthenticated() {
        return !!this.token;
    }
}
