import {Router} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthService {
    user: any = {};
    public token: any;

    constructor() {
        this.token = window.localStorage.getItem('token') || false;
        let user = window.localStorage.getItem('user');
        try {
            this.user = JSON.parse(user);
        } catch (e) {
            this.logout();
        }
    }

    setUser(user) {
        this.user = user;
        window.localStorage.setItem('user', JSON.stringify(user));
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
    }

    getUser() {
        return this.user;
    }

    isAuthenticated() {
        return !!this.token;
    }
}
