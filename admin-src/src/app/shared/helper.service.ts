import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs/internal/Subject";
import * as moment from "moment";
import {Moment} from "moment";
import {configs} from "./configs";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {Location} from "@angular/common";

declare const Noty: any;
declare const $: any;

export interface NotificationOptions {
    text?: string,
    theme?: string,
    layout?: string,
    timeout?: boolean | number,
    progressBar?: boolean,
    type?: string,
}

export interface AppEvent {
    key?: any,
    data?: any,
}

/**
 * Global events for application,
 * list and broadcast events anywhere in the application.
 */
@Injectable()
export class AppEvents {
    subject: Subject<AppEvent> = new Subject<AppEvent>();

    /**
     * List of subscriptions
     * @type {{}}
     */
    subscriptions: any = {};

    constructor() {
        this.subject.subscribe((data: AppEvent) => {
            this.globalListener(data);
        });
    }

    /**
     * Unsubscribe all events from a group.
     *
     * @param {string} groupName
     */
    offGroup(groupName: string) {
        for (let id of Object.keys(this.subscriptions)) {
            if (this.subscriptions[id].group == groupName)
                this.off(id);
        }
    }

    /**
     * Give an array of ids to remove listeners.
     *
     * @param {string[]} ids
     */
    offIds(ids: string[]) {
        for (let id of ids) {
            this.off(id);
        }
    }

    /**
     * Remove listener using the ID that was returned when @this.on was fired.
     *
     * @param {string} id
     * @returns {boolean}
     */
    off(id: string) {
        if (typeof this.subscriptions[id] === 'undefined') {
            return false;
        } else {
            delete this.subscriptions[id];
            return true;
        }
    }

    /**
     * Adds the key and callback to subscriptions and sends back its id.
     *
     * @param key
     * @param callback
     * @param group
     * @returns {string}
     */
    on(key, callback, group?) {
        let subscribeId = Math.floor(Math.random() * 99999).toString();
        this.subscriptions[subscribeId] = {
            'key': key,
            'callback': callback,
            'group': group || 'default'
        };
        return subscribeId;
    }

    /**
     * @param key
     * @param data
     */
    broadcast(key, data?) {
        this.subject.next(<AppEvent>{
            key: key,
            data: data,
        });
    }

    /**
     * Lets get all the events, and distribute them to the listeners
     *
     * @param data
     */
    private globalListener(data: AppEvent) {
        for (let id of Object.keys(this.subscriptions)) {
            if (this.subscriptions[id].key == data.key) {
                this.subscriptions[id].callback({...data.data});
            }
        }
    }
}

/**
 * Eval code in sandbox,
 * that's not really a sandbox, but we can specify a different context for the code we want to run.
 * the code that's provided is in string format.
 *
 */
export class Eval {
    output: string;
    error: string;
    isError: boolean;

    /**
     * Functions that can be used inside eval
     * Define your functions here, will be injected in the eval code.
     */
    functions = [
        function num(a) {
            return parseFloat(a);
        },
        function date(a) {
            return moment(a).unix();
        }
    ];

    constructor(code: string, params: any) {
        this.registerPrototypes();
        this.run(code, params);
    }

    /**
     * Register string prototypes here
     * NOTE: prototypes are registered globally. this are not just for the EVAL class.
     *
     * Add definition @ admin-src/src/typings.d.ts
     */
    registerPrototypes() {
        if (typeof String.prototype.contains != 'undefined')
            return;

        String.prototype.contains = function (c: string) {
            return this.toString().indexOf(c) != -1;
        };
        String.prototype.equals = function (c) {
            return this.toString() === c.toString();
        };
    }

    /**
     * Alter code for execution
     * The code can be user friendly.
     *
     * @param code
     */
    private validate(code) {
        // add support for AND and OR
        code = code.replace(/ or /ig, ' || ');
        code = code.replace(/ and /ig, ' && ');

        // do not allow alert, confirm and prompt
        if (code.match(/alert\(|confirm\(|prompt\(/ig))
            return "false";

        // do not allow assignment statements.
        if (code.match(/ = /ig))
            return "false";

        return code;
    }

    private compileFunctions() {
        let funcDeclarations = " ";
        for (let f of this.functions) {
            funcDeclarations += f.toString() + ' ';
        }
        return funcDeclarations;
    }

    private compileVariables(params) {
        let declarations = " ";
        for (let variable of Object.keys(params)) {
            let value = JSON.stringify(params[variable]);
            // value dataType is not preserved.
            // everything is converted to string no matter what
            declarations += `var ${variable} = ${value} ;`;
        }
        return declarations;
    }

    private run(code: string, params: any) {
        code = this.validate(code);
        let compiledVariables = this.compileVariables(params);
        let compiledFunctions = this.compileFunctions();
        code = compiledFunctions + compiledVariables + code;
        // console.warn(code);
        try {
            this.output = eval(code);
        } catch (e) {
            this.isError = true;
            this.error = e.message;
        }
    }
}

declare const alasql: any;

export interface GraphLinesMergerArg {
    data?: any,
    l?: string[],
    v?: any[],
    sort?: any,
};

export interface GraphLineMergerResult {
    headers: string[],
    lines: {
        data: any,
        line: any[]
    }[]
}

export interface GraphLineMergerOptions {
    sortLegend?: string,
    defaultValue?: string | number,
}

@Injectable()
export class Utils {

    public graphLineMerger(arr: GraphLinesMergerArg[], options: GraphLineMergerOptions = {}): GraphLineMergerResult {
        let defaultValue = typeof options.defaultValue == undefined ? null : options.defaultValue;
        let length = arr.length;
        let a = alasql;

        let cols = ['l'];
        for (let i in arr) {
            let i2 = parseInt(i) + 1;
            cols.push(`v${i2}`);
        }
        // console.log(cols);
        let tempTable = "A" + Math.round(Math.random() * 9999);
        // let tempTable = "T";
        a(`DROP TABLE IF EXISTS ${tempTable}`);
        a(`CREATE TABLE ${tempTable} (${cols.join(', ')})`);


        for (let lineIndx in arr) {
            // lineIndex
            let lineCol = 'v' + (parseInt(lineIndx) + 1);
            let line = arr[lineIndx];

            for (let entryIndx in line.l) {
                let l = line.l[entryIndx];
                let v = line.v[entryIndx];

                // check if the legend exists
                let res = a(`select * from ${tempTable} where l = '${l}'`);
                if (res.length) {
                    if (typeof v == 'string') {
                        a(`update ${tempTable} set ${lineCol} = '${v}' where l = '${l}'`);
                    }
                    else {
                        // console.log(lineCol, v);
                        a(`update ${tempTable} set ${lineCol} = ${v} where l = '${l}'`);
                    }
                } else {
                    // insert new
                    let values = {};
                    values['l'] = l;
                    values[lineCol] = v;

                    // console.log('insert', values);
                    a(`insert into ${tempTable} VALUES ?`, [values]);
                }
                let r = a(`select * from ${tempTable}`);
                // console.table(r);
            }
        }

        let sortQ = '';
        // let sortList = arr.filter(a => {
        //     return a.sort;
        // }).map(a => {
        //     return a.sort;
        // });
        // if (sortList && sortList.length) {
        sortQ += ` order by `;
        let sortQList = [];
        for (let i in arr) {
            let a = arr[i];
            if (a.sort) {
                let indx = 'v' + (parseInt(i) + 1);
                sortQList.push(` ${indx} ${a.sort} `);
            }
        }
        if (options.sortLegend) {
            sortQList.push(` l ${options.sortLegend} `);
        }
        sortQ += sortQList.join(', ');

        // console.log(sortQ);
        let sq = `select * from ${tempTable} ${sortQList.length ? sortQ : ''}`;
        // console.log(sq);
        let results = a(sq);
        // console.table(results);
        let headers = results.map((a) => {
            return a.l;
        });

        let lines = [];
        for (let lineIndx in arr) {

            let i2 = parseInt(lineIndx) + 1;
            let lineName = `v${i2}`;
            let line = results.map(a => {
                    let v = a[lineName];
                    if (typeof v == 'undefined')
                        v = defaultValue;
                    return v;
                }
            );
            lines.push({
                data: arr[lineIndx].data,
                line: line,
            });
        }

        // a(`DROP TABLE ${tempTable}`);

        return {
            headers: headers,
            lines: lines,
        };
    }


    storagePrefix: string;

    public countries: { 'code': string, 'name': string }[] = [
        {
            'code': 'IND',
            'name': 'india',
        },
        {
            'code': 'BAH',
            'name': 'Bahrain',
        },
        {
            'code': 'UAE',
            'name': 'UAE',
        },
        {
            'code': 'KSA',
            'name': 'Saudi Arabia',
        },
        {
            'code': 'OMN',
            'name': 'Oman',
        },
        {
            'code': 'KU',
            'name': 'Kuwait',
        }
    ];

    public userGroups: { 'code': number, 'name': string }[] = [
        {
            'code': 100,
            'name': 'Admin'
        },
        {
            'code': 91,
            'name': 'Sales'
        },
        {
            'code': 90,
            'name': 'Manager'
        },
        {
            'code': 80,
            'name': 'Account handler'
        },
        {
            'code': 1,
            'name': 'Customer'
        },
    ];
    public dateFormats: {
        LT: 'LT'
        LTS: 'LTS'
        L: 'L'
        l: 'l'
        LL: 'LL'
        ll: 'll'
        LLL: 'LLL'
        lll: 'lll'
        LLLL: 'LLLL'
        llll: 'llll'
    };

    /**
     * Simple wrapper for localStorage!
     * Storage objects or whatever and get it as it was stored.
     * @type {{get: (key: string) => (undefined | any); delete: (key: string) => void; set: (key: string, value: any) => void}}
     */
    storage = {
        get: (key: string, cache: boolean = true) => {
            let time = 3600; // seconds to cache // 1 hr
            time *= 1000;

            key = this.storagePrefix + key;
            let item = window.localStorage.getItem(key);

            if (!item)
                return undefined;

            try {
                let parsedItem = JSON.parse(item);

                let iTime = parsedItem.t
                let currTime = (+new Date());
                iTime += time;

                if (iTime < currTime && cache) {
                    return undefined;
                } else {
                    return parsedItem.v;
                }

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
                't': (+new Date()),
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

    // ('LLLL'); // Sunday, August 5, 2018 12:57 PM
    // ('LT');   // 12:57 PM
    // ('LTS');  // 12:57:40 PM
    // ('L');    // 08/05/2018
    // ('l');    // 8/5/2018
    // ('LL');   // August 5, 2018
    // ('ll');   // Aug 5, 2018
    // ('LLL');  // August 5, 2018 12:57 PM
    // ('lll');  // Aug 5, 2018 12:57 PM
    // ('llll'); // Sun, Aug 5, 2018 12:57 PM

    constructor() {
        this.storagePrefix = 'fame_';
    }

    /**
     *
     */
    public getCountries() {
        return this.countries.slice();
    }

    /**
     * @param code
     */
    public getCountry(code) {
        let c = this.countries.filter(a => {
            return (a.code == code);
        });

        return c.length ? c[0] : false;
    }

    userGroup(code) {
        let r = this.userGroups.filter((a) => {
            return a.code == code;
        });

        return r[0];
    }

    /**
     * Create a deep copy of objects. *
     * similar to angular.copy
     *
     * @param obj
     */
    copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     *
     * @param unixTimestamp
     */
    unixTimestampToMoment(unixTimestamp): Moment {
        return moment.unix(unixTimestamp);
    }

    dateFormat(unixTimestamp: any, format: string = 'll') {
        let m = this.unixTimestampToMoment(unixTimestamp);
        return m.format(format);
    }

    dateFromatNormal(date) {
        return moment(date).format('ll')
    }

    dateCalendar(unixTimestamp: any) {
        return this.unixTimestampToMoment(unixTimestamp).calendar();
    }

    /**
     *
     * @param unixTimestamp
     * @param alter
     */
    dateAlter(unixTimestamp: any, alter: any) {
        let m = this.unixTimestampToMoment(unixTimestamp);
        let o = alter.substr(0, 1);
        let s = alter.substr(1).slice(' ');
        if (o == '+') {
            return m.add(s[0], s[1]);
        } else {
            return m.subtract(s[0], s[1]);
        }
    }

    /**
     * Save col state for ag grid
     * @param columns
     * @param $event
     * @param name
     */
    agGridSaveColState(columns: any, $event: any, name: string) {
        // event fired when a col is moved in ag grid
        let newIndex = $event.toIndex;
        let columnMoved = $event.column.colId;
        let cols = <any>columns.slice();
        let oldIndex;
        for (let i in cols) {
            if (cols[i].field == columnMoved) {
                oldIndex = i;
            }
        }

        let temp = cols[newIndex];
        cols[newIndex] = cols[oldIndex];
        cols[oldIndex] = temp;

        let map = cols.map((e) => {
            return e.field;
        });

        this.storage.set('cols_' + name, map);
    }

    /**
     * Get saved cols + get cols ordered
     * @param columns
     * @param name
     */
    agGridGetSavedColState(columns: any, name: string) {
        let cols = this.storage.get('cols_' + name);
        if (cols) {
            let sortedCols = [];
            for (let c of cols) {
                for (let d of columns) {
                    if (c == d.field) {
                        sortedCols.push(d);
                    }
                }
            }
            return sortedCols;
        } else {
            return columns;
        }
    }

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

    /**
     * Quick access to show an error
     * @param msg
     */
    errorNotification(msg?: string) {
        if (!msg)
            msg = 'Something went wrong while connecting to the server, please try again';
        this.notification({
            text: msg,
            type: this.notificationType.error,
        });
    }

    /**
     *
     * @param msg
     */
    infoNotification(msg) {
        this.notification({
            text: msg,
            type: this.notificationType.info
        });
    }

    /**
     *
     * @param msg
     */
    successNotification(msg) {
        this.notification({
            text: msg,
            type: this.notificationType.success
        });
    }

    public escapeQuotes(str) {
        return str.replace(/\\([\s\S])|(')/g, "\\$1$2").replace(/\\([\s\S])|(")/g, "\\$1$2");
    }

    /**
     * Create a table name from its name?
     * This is to ensure that the name is always valid!
     * starts with a number and is unique to the (name or id whatever).
     *
     * @param a
     */
    public hashTableName(a) {
        return "S" + this.hashCode(a);
    }

    /**
     * Generate a hash off a string
     *
     * @param a
     */
    public hashCode(a): string {
        let hash = 0, i, chr;
        if (a.length === 0) return hash.toString();
        for (i = 0; i < a.length; i++) {
            chr = a.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        // it returns a negative number at times,
        // negative - sign is not accepted for table names, thus replace it with N.
        return hash.toString().replace(/-/ig, 'N');
    };

    /**
     * Get a unique code
     */
    public uniqueCode() {
        return 'A' + (Math.floor(Math.random() * 999999999999).toString());
    }

    /**
     * Make a PC friendly code, SLUG MAKER
     *
     * @param str
     */
    public makeSlug(str: string): string {
        return str.trim().replace(/ /ig, '_').toLowerCase();
    }
}

/**
 * HTTP helper class,
 * All http requests must go through this class
 */
@Injectable()
export class HttpHelper {
    baseUrl: string;

    defaultOptions: any = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true,
    };

    constructor(
        public http: HttpClient,
        public location: Location,
    ) {
        this.baseUrl = location.prepareExternalUrl('') + '../' + configs.api_url;
        console.log('base', this.baseUrl);
    }

    post(url: string, data?, options?): Observable<any> {
        options = {...this.defaultOptions, ...options};
        data = {
            ...data, ...{
                'token': window.localStorage.getItem('token')
            }
        };

        return this.http.post(this.baseUrl + url, data, options);
    }

    get(url: string, data?, options?) {
        options = {...this.defaultOptions, ...options};
        data = {
            ...data, ...{
                'token': window.localStorage.getItem('token')
            }
        };

        options['params'] = data;
        return this.http.get(this.baseUrl + url, options);
    }
}


export interface SelectOption {
    code: string,
    name: string,
}

@Injectable()
export class SearchService {
    public results: SearchResult[] = [];
    search_id: number;
    public readonly eventOnSearch = 'search-start';
    public readonly eventOnResult = 'search-result';
    public readonly eventOnLoading = 'search-loading';
    searchTerm: string;
    isLoading: boolean = false;

    /*
     * Result types
     */
    public readonly typeLink = 'link';
    public readonly typeExternalLink = 'externalLink';
    public readonly typeEvent = 'event';
    public readonly typeChat = 'chat';
    loaders: any[] = [];

    constructor(
        public utils: Utils,
        public appEvents: AppEvents,
        public router: Router,
    ) {
        // set the user's pages
    }

    /**
     * Fire when search is requested
     *
     * @param page
     * @param callback
     */
    onSearch(page, callback: Function) {
        let listenId = this.appEvents.on(this.eventOnSearch, (searchRequest: SearchRequest) => {
            callback(searchRequest);
        }, page);
        return listenId;
    }

    onResultsChange(callback: Function) {
        this.appEvents.on(this.eventOnResult, () => {
            callback([]); // send results.
        });
    }

    onLoadingChange(callback: Function) {
        this.appEvents.on(this.eventOnLoading, () => {
            callback(this.isLoading);
        })
    }

    /**
     * Stop listening to search requests.
     *
     * @param page
     */
    offSearch(page) {
        this.appEvents.offGroup(page);
    }

    /**
     * Get all results stored in data map
     */
    getAllResults() {
        return this.results;
    }

    placeSearchRequest(term) {
        term = term.trim();
        if (!term)
            return false;

        this.results = [];
        this.searchTerm = term;
        this.loaders = [];
        this.calcLoading();
        this.search_id = Math.round(Math.random() * 999999);

        this.appEvents.broadcast(this.eventOnSearch, <SearchRequest>{
            term: term,
        });
    }

    submitResults(term: string, results: SearchResult[]): number {
        if (term != this.searchTerm) {
            return 0;
        }
        let setId = Math.round(Math.random() * 999999);
        // only if the term matches
        for (let r of results) {
            r.groupId = setId;
            this.results.push(r);
        }
        this.appEvents.broadcast(this.eventOnResult, this.results);
        return setId;
    }

    click(sr: SearchResult) {
        switch (sr.type) {
            case this.typeLink:
                this.router.navigateByUrl(sr.url);
                break;
            case this.typeExternalLink:
                window.open(sr.url, '_empty');
                break;
            case this.typeEvent:
                break;
            case this.typeChat:
                let [id, type] = sr.typeValue;
                this.appEvents.broadcast('_start-chat', {
                    'id': id,
                    'type': type,
                });
                break;
        }
    }

    /**
     * Remove data that was set before.
     * @param id
     */
    removeResultsBySetId(id) {
        if (!id)
            return;
        this.results = this.results.filter((res: SearchResult) => {
            return res.groupId != id;
        });
    }

    /**
     * Show loading.
     */
    showLoading(): number {
        let id = Math.round(Math.random() * 9999999);
        this.loaders.push(id);
        // console.log('show loading', id, this.loaders.length);
        this.calcLoading();
        return id;
    }

    /**
     * Hide loading..
     * @param id
     */
    hideLoading(id: number) {
        let indx = this.loaders.indexOf(id);
        if (indx != -1) {
            this.loaders.splice(indx, 1);
        }
        // console.log('hide loading', id, this.loaders.length);
        this.calcLoading();
    }

    calcLoading() {
        this.isLoading = !!this.loaders.length;
        // console.log('loading, ', this.isLoading);
        this.appEvents.broadcast(this.eventOnLoading, this.isLoading);
    }

}

export interface SearchRequest {
    term: string,
}

export interface SearchResult {
    text?: string,
    type?: string,
    typeValue?: any,
    subText?: string,
    icon?: string,
    group?: string,
    groupId?: number, // result set id, internally used.
    url?: string,
    tag?: string,
}

export interface KeyboardListenerKeyOptions {
    disable_in_input?: boolean,
    prevent_default?: boolean,
    priority?: number, // @todo: to implement,
    queue?: boolean, // @todo: to implement
}

interface KeyboardRegisteredCombination {
    callback: Function,
    disable_in_input: boolean,
    prevent_default: boolean,
    combination: string,
    combinationKeys: string[],
    combinationChars: string[],
}

/**
 * Singleton instance of keyboard listener
 */
export class KeyboardListener {
    private static instance: KeyboardListener;
    private registeredShortcuts: {
        [id: string]: KeyboardRegisteredCombination
    } = {};
    private defaultKeyOptions: KeyboardListenerKeyOptions = {
        disable_in_input: true,
        prevent_default: false,
        priority: 1,
        queue: false,
    };
    private listenersCounter: number = 1;

    private constructor() {
        // will not work on IE8. Sorry!
        document.addEventListener('keydown', (event) => {
            this.keyDown(event);
        });
        document.addEventListener('keyup', (event) => {
            this.keyUp(event)
        });
        window.addEventListener('focus', () => {
            // console.log('document focus');
            if (this.isKeyDown) {
                this.keyUp();
            }
        });
    }

    static getListener() {
        if (!KeyboardListener.instance) {
            KeyboardListener.instance = new KeyboardListener();
            // ... any one time initialization goes here ...
        }
        return KeyboardListener.instance;
    }

    public destroy() {
        // console.warn('OK!');
        // document.removeEventListener('keydown', this.keyDown());
    }

    /**
     * Register keystrokes
     *
     * @param combination
     * @param callback
     * @param options
     */
    public register(combination: string, callback: Function, options?: KeyboardListenerKeyOptions) {
        let keyOptions: KeyboardListenerKeyOptions = this.defaultKeyOptions;
        if (options)
            Object.assign(keyOptions, options);

        combination = combination.toUpperCase();
        let combinationChars = combination.split('+');
        let combinationKeys = [];

        for (let char of combinationChars) {
            // check in keymap
            if (typeof this.keyMap[char] !== 'undefined') {
                combinationKeys.push(this.keyMap[char]);
            } else {
                let value = char.charCodeAt(0);
                combinationKeys.push(value);
            }
        }

        let id = (++this.listenersCounter).toString();

        // console.log('Registered', combination, combinationKeys);

        this.registeredShortcuts[id] = {
            callback: callback,
            disable_in_input: keyOptions.disable_in_input,
            prevent_default: keyOptions.prevent_default,
            combination: combination,
            combinationChars: combinationChars,
            combinationKeys: combinationKeys,
        };
        console.debug('registered!', id);

        return id;
    }

    /**
     * Unregister a keyboard shortcut
     * @param id | id[]
     */
    public unRegister(id: string | string[]) {
        if (typeof id == 'object') {
            for (let i of id) {
                if (typeof this.registeredShortcuts[i] !== 'undefined')
                    delete this.registeredShortcuts[i];
            }
        } else {
            if (typeof this.registeredShortcuts[id] !== 'undefined')
                delete this.registeredShortcuts[id];
        }
    }

    isKeyDown: boolean = false;
    keyPressed: any[] = [];
    keyMap: any = {
        'ESC': 27,
        'ESCAPE': 27,
        'TAB': 9,
        'SPACE': 32,
        'RETURN': 13,
        'ENTER': 13,
        'BACKSPACE': 8,

        'SCROLLLOCK': 145,
        'SCROLL_LOCK': 145,
        'SCROLL': 145,
        'CAPSLOCK': 20,
        'CAPS_LOCK': 20,
        'CAPS': 20,
        'NUMLOCK': 144,
        'NUM_LOCK': 144,
        'NUM': 144,

        'PAUSE': 19,
        'BREAK': 19,

        'INSERT': 45,
        'HOME': 36,
        'DELETE': 46,
        'END': 35,

        'PAGEUP': 33,
        'PAGE_UP': 33,
        'PU': 33,

        'PAGEDOWN': 34,
        'PAGE_DOWN': 34,
        'PD': 34,

        'LEFT': 37,
        'UP': 38,
        'RIGHT': 39,
        'DOWN': 40,

        'SHIFT': 16,
        'CTRL': 17,
        'CONTROL': 17,

        'F1': 112,
        'F2': 113,
        'F3': 114,
        'F4': 115,
        'F5': 116,
        'F6': 117,
        'F7': 118,
        'F8': 119,
        'F9': 120,
        'F10': 121,
        'F11': 122,
        'F12': 123,

        '!': 49, // key code of 1, shift does not count
        '@': 50, // 2
        '#': 51, // 3
        '$': 52, // 4
        '%': 53, // 5
        '^': 54, // 6
        '&': 55, // 7
        '*': 56, // 8
        '(': 57, // 9
        ')': 48, // 0
        '_': 189, // -
        '+': 187, // =
        '[': 219,
        '{': 219,
        ']': 221,
        '}': 221,
        '\\': 220,
        '|': 220,
        ',': 188,
        '<': 188,
        '.': 190,
        '>': 190,
        '/': 191,
        '?': 191,
    };
    keysDown: number = 0;

    /**
     * Returns the gotten matches if all values in hasAr in present in ar.
     * @param ar
     * @param hasAr
     */
    private match(ar: any[], hasAr: any[]) {
        // if (ar.length !== hasAr.length)
        //     return false;

        let matches = 0;
        for (let a of hasAr) {
            if (ar.indexOf(a) != -1)
                matches += 1;
        }
        return matches;
    }

    event: any;

    /**
     * Listen to global keyboard events
     * @param event
     */
    private keyDown(event: KeyboardEvent) {
        this.isKeyDown = true;
        let key = event.which;
        this.event = event;

        // @todo use 'key' instead of 'which', apparently which is deprecated
        // key gives string name of the key instead of its numeric value, it will be easier
        // why didn't i find that earlier!!!!
        // Update: because key is inconsistent!, which works well.
        // let char = String.fromCharCode(key.toString()).toLowerCase();

        if (this.keyPressed.indexOf(key) == -1) {
            this.keysDown += 1;
            // console.log('keydown', this.keysDown);
            this.keyPressed.push(key);

            let keyPressedTemp = this.keyPressed.slice();


            if (event.ctrlKey)
                keyPressedTemp.push(this.keyMap['CTRL']);
            if (event.shiftKey)
                keyPressedTemp.push(this.keyMap['SHIFT']);
            if (event.altKey)
                keyPressedTemp.push(this.keyMap['ALT']);

            for (let shortcutId of Object.keys(this.registeredShortcuts)) {
                let shortcut = this.registeredShortcuts[shortcutId];
                let combination = shortcut.combinationKeys;

                if (shortcut.prevent_default) {
                    if (this.match(keyPressedTemp, combination) > 1) {
                        // console.log('prevent default', shortcut.combinationKeys);
                        event.preventDefault();
                    }
                }
            }
        }
    }

    private keyUp(event?: KeyboardEvent) {
        this.keysDown -= 1;
        if (this.isKeyDown) {
            // console.log('FIRE!', this.keyPressed.join('+'));
            this.fireCombination(this.keyPressed.slice(0), this.event);
            this.isKeyDown = false;
            this.keyPressed = [];
        }
    }

    private findCombination(keysPressed) {
        let foundCombinations = [];
        // there can be multiple found combinations
        // pick the one that has the most matched keys, of the highest length

        for (let shortcutId of Object.keys(this.registeredShortcuts)) {
            let shortcut = this.registeredShortcuts[shortcutId];
            let combination = shortcut.combinationKeys;
            let yes = (this.match(combination, keysPressed) == combination.length);
            if (yes) {
                if (shortcut.disable_in_input) {
                    // check if input is focused
                    let $focused = $(':focus');
                    if ($focused.length > 0)
                        return;
                }
                shortcut.callback(event);
            } else {
            }
        }
    }

    private fireCombination(keysPressed, event) {
        let matchedShortcuts: KeyboardRegisteredCombination[] = [];

        for (let shortcutId of Object.keys(this.registeredShortcuts)) {
            let shortcut = this.registeredShortcuts[shortcutId];
            let combination = shortcut.combinationKeys;
            let yes = (this.match(combination, keysPressed) == combination.length);
            if (yes) {
                if (shortcut.disable_in_input) {
                    // check if input is focused
                    let $focused = $(':focus');
                    if ($focused.length > 0)
                        return;
                }
                shortcut.callback(event);
            } else {
            }
        }
    }

}

/**
 * Global key value pair interface for select options
 */
export interface KeyValuePair {
    key: string,
    value: string,
}

/**
 * HttpHelper response interface
 * My current setup returns data in this strict format.
 */
export interface HttpResponse {
    status: boolean,
    data: any,
    reason: string,
}