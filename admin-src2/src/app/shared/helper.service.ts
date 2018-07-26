import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpParamsOptions} from "@angular/common/http/src/params";
import {AuthService} from "./auth/auth.service";

declare const Tour: any;
declare const Noty: any;

export interface TourSteps {
    element?: string,
    title?: string,
    content?: string,
}

export interface TourOptions {
    name?: string,
    steps?: TourSteps[],
    container?: string,
    smartPlacement?: boolean,
    keyboard?: boolean,
    storage?: any,
    debug?: boolean,
    backdrop?: boolean,
    backdropContainer?: string,
    backdropPadding?: number,
    redirect?: boolean,
    orphan?: boolean,
    duration?: boolean,
    delay?: boolean,
    basePath?: string,
    template?: string,

    afterGetState?(key: any, value: any),

    afterSetState?(key: any, value: any),

    afterRemoveState?(key: any, value: any),

    onStart?(tour: any),

    onEnd?(tour: any),

    onShow?(tour: any),

    onShown?(tour: any),

    onHide?(tour: any),

    onHidden?(tour: any),

    onNext?(tour: any),

    onPrev?(tour: any),

    onPause?(tour: any, duration: any),

    onResume?(tour: any, duration: any),

    onRedirectError?(tour: any),
}

export interface Tour {
    init(),

    start(),
}

export interface NotificationOptions {
    text?: string,
    theme?: string,
    layout?: string,
    timeout?: boolean | number,
    progressBar?: boolean,
    type?: string,
}

@Injectable()
export class TourService {
    constructor() {

    }

    /**
     * @param {TourOptions} options
     * @returns {Tour}
     */
    create(options: TourOptions) {
        let tour = <Tour>new Tour(options);
        return tour;
    }
}


@Injectable()
export class Utils {
    storagePrefix: string;

    constructor() {
        this.storagePrefix = 'fame_';
    }

    /**
     * Simple wrapper for localStorage!
     * Storage objects or whatever and get it as it was stored.
     * @type {{get: (key: string) => (undefined | any); delete: (key: string) => void; set: (key: string, value: any) => void}}
     */
    storage = {
        get: (key: string) => {
            key = this.storagePrefix + key;
            let item = window.localStorage.getItem(key);

            if (!item)
                return undefined;

            try {
                let parsedItem = JSON.parse(item);
                return parsedItem.v;
            } catch (e) {
                return undefined;
            }
        },
        delete: (key: string) => {
            key = this.storagePrefix + key;
            window.localStorage.removeItem(key);
        },
        set: (key: string, value: any) => {
            key = this.storagePrefix + key;
            // this preserves the data type of the value
            window.localStorage.setItem(key, JSON.stringify({
                'v': value,
            }));
        }
    };


    notificationLayouts = {
        top: 'top',
        topLeft: 'topLeft',
        topCenter: 'topCenter',
        topRight: 'topRight',
        center: 'center',
        centerLeft: 'centerLeft',
        centerRight: 'centerRight',
        bottom: 'bottom',
        bottomLeft: 'bottomLeft',
        bottomCenter: 'bottomCenter',
        bottomRight: 'bottomRight',
    };

    notificationType = {
        alert: 'alert',
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info',
    };

    /**
     * show notifications
     * @param {NotificationOptions} options
     * @returns {any}
     */
    notification(options: NotificationOptions) {
        if (!options.theme)
            options.theme = 'light';
        if (!options.timeout)
            options.timeout = 3000;
        if (!options.layout)
            options.layout = this.notificationLayouts.bottomRight;

        let noty = new Noty(options);
        noty.show();
        return noty;
    }
}


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
