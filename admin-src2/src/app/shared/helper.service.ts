import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpParamsOptions} from "@angular/common/http/src/params";
import {AuthService} from "./auth/auth.service";

@Injectable()
export class HttpHelper {
    // baseUrl: string = 'http://192.168.2.150:81/assets-mg-portal/eapi/';
    // baseUrl: string = 'http://assetalbum.com/eapi/';
    baseUrl: string = 'http://localhost/assets-mg-portal/eapi/';

    defaultOptions = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    constructor(public http: HttpClient, public authService: AuthService) {

    }

    post(url: string, data?, options?) {
        options = {...this.defaultOptions, ...options};
        data = {
            ...data, ...{
                'token': this.authService.getToken()
            }
        };

        return this.http.post(this.baseUrl + url, data, options);
    }

    get(url: string, data?, options?) {
        data = {
            ...data, ...{
                'token': this.authService.getToken()
            }
        };
        return this.http.get(this.baseUrl + url, {
            params: data
        });
    }
}
