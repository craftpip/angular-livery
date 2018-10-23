import {AfterViewInit, Component, Input} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AppEvents, HttpHelper, HttpResponse, Utils} from "../../../shared/helper.service";
import {AuthService} from "../../../shared/auth/auth.service";
import {DashboardCard} from "../cards.component";
import {Database} from "../../../shared/database.service";

declare const Muuri: any;
declare const alasql: any;

/**
 * Level 2 for dashboard
 * everything starts here.
 * single card gets loaded.
 */
@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})

export class CardComponent implements AfterViewInit {
    constructor(public httpHelper: HttpHelper,
                public authService: AuthService,
                public fb: FormBuilder,
                public utils: Utils,
                public database: Database,
                public events: AppEvents,) {
    }

    @Input('card')
    set _card(card) {
        this.card = card;
    }

    card: DashboardCard;

    ngAfterViewInit() {
        this.initCard();
    }

    tableName: string = '';

    /**
     * Load the cards data.
     * put it in database
     */
    initCard() {
        this.tableName = this.utils.hashTableName(this.card.tableCode);
        this.initSequence();
    }

    loading: boolean = false;
    table: any[] = [];
    viewType: string = '';

    /**
     * start loading and other things.
     */
    initSequence() {
        let cache = true;
        this.load(cache).then(() => {
            this.insertTableToDatabase(cache).then(() => {
                this.setView();
            });
        });
    }

    /**
     * Set the view type for this graph, that will load the respective graph directive.
     * The child will query the database
     */
    setView(): Promise<any> {
        let defaultView = 'table';
        if (this.card.options.view)
            defaultView = this.card.options.view;

        // we have to do is to apply the view name
        // and supply the card object.
        // to the child directive.

        return new Promise((resolve, reject) => {
            this.viewType = defaultView;
            resolve();
            // okay , lets move the queries in the respective graph pages.
            // this will make the graph pages independent,
            // we will only have to supply them with the card data and filters.
            // that will be all.

            if (defaultView == 'table') {
                // this.viewTable(resolve, reject);
            } else if (defaultView == 'pie') {
                // this.viewPie(resolve, reject);
            } else if (defaultView == 'donut') {
                // this.viewDonut(resolve, reject);
            } else if (defaultView == 'line') {
                // this.viewLine(resolve, reject);
            } else if (defaultView == 'count') {
                // this.viewCount(resolve, reject);
            } else if (defaultView == 'bar') {
                // this.viewBar(resolve, reject);
            } else if (defaultView == 'column') {
                // this.viewColumn(resolve, reject);
            }
        });
    }


    /**
     * Step 1 in init sequence
     * @param enableCaching
     */
    load(enableCaching: boolean = true): Promise<any> {
        return new Promise((resolve, reject) => {
            this.loading = true;

            // use enableCaching,

            let url = 'sec/dashboard/table';
            let params = {
                'table': this.card.table,
            };
            let cacheKey = url + JSON.stringify(params);

            let cache = this.utils.storage.get(cacheKey, true);
            if (cache && enableCaching) {
                this.table = cache;
                resolve();
            } else {

                console.log(url);
                console.log(params);

                this.httpHelper.post(url, params).subscribe((response: HttpResponse) => {
                    this.loading = false;
                    if (response.status) {
                        let responseTable = response.data.table || [];
                        this.utils.storage.set(cacheKey, responseTable);
                        this.table = responseTable;
                        resolve();
                    } else {
                        this.utils.errorNotification(response.reason);
                        reject(response.reason);
                    }
                }, err => {
                    this.loading = false;
                    this.utils.errorNotification();
                    reject('Error while getting data from server');
                });
            }
        });
    }

    tableHeaders: TableHeaders[] = [];

    /**
     * Step 2 in init Sequence
     */
    insertTableToDatabase(cacheEnabled: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.table.length) {
                reject();
                return;
            }

            let headers = Object.keys(this.table[0]);
            let tableHeaders = <TableHeaders[]>headers.map(a => {
                return <TableHeaders>{
                    name: a,
                    slug: this.utils.makeSlug(a),
                }
            });

            this.tableHeaders = tableHeaders;

            // every time the page loads, this thing is working, deleting the table, recreating it and inserting all data again!.
            // need something to persist it, check the length of the records, if its not a match then do it ?

            let cols = tableHeaders.map(a => {
                return '`' + a.slug + '`';
            }).join(',');

            let statements = [];

            statements.push(`DROP TABLE IF EXISTS ${this.tableName}`);
            statements.push(`CREATE TABLE ${this.tableName} (${cols})`);

            for (let row of this.table) {
                let values = [];
                let value;

                // Feature?
                // Convert all possible 'numbers in string' to number ?

                for (let key of Object.keys(row)) {
                    // insert query depending on the type of data presented
                    let v = row[key];

                    if (typeof v == 'string' && /^(-)?\d+(\.\d+)?$/ig.test(v)) {
                        // parse as number only if it contains all numbers and optionally contains one decimal point,
                        // must accept negative numbers
                        // must be a valid float number
                        let n = parseFloat(v);
                        if (!isNaN(n) && isFinite(n))
                            v = n;
                    }

                    if (typeof v == 'string') {
                        // escape quotes alasql
                        let v2 = this.utils.escapeQuotes(v);
                        value = `'${v2}'`;
                    } else if (typeof v == 'number') {
                        // numbers go as it is
                        value = `${v}`;
                    } else if (v == null) {
                        // null goes as it is
                        value = `${v}`;
                    } else {
                        // some new data type? call for help
                        // data entry was skipped, database goes in chaos
                        console.error('ATTENTION ALL UNITS UNHANDLED DATA! *LOUD SIREN RINGING*', row[key]);
                    }
                    values.push(value);
                }

                let jValues = values.join(',');
                let q = `INSERT INTO ${this.tableName} values (${jValues})`;
                statements.push(q);
            }

            // generated all queries, now execute

            this._insertDataToDatabase(statements, cacheEnabled, resolve, reject);
        })
    }

    private async _insertDataToDatabase(statements: string[], cacheEnabled: boolean, resolve, reject) {
        let hasUpdatedData = false;
        if (cacheEnabled) {
            let tableList = <{ tableid: string }[]>await this.database.execute('show tables');
            let hasTable = false;
            // check if table exists.
            for (let l of tableList) {
                if (l.tableid == this.tableName) {
                    hasTable = true;
                    break;
                }
            }
            if (hasTable) {
                // table exists.
                let count = await this.database.execute(`select count(*) as c from ${this.tableName}`);
                // check if table has same amount of rows that i'm going to insert.
                // This is a loose way to check if data is updated
                if (count[0].c != this.table.length) {
                    hasUpdatedData = true;
                }
            }
        }

        if (hasUpdatedData) {
            // has updated rows.
            resolve();
        } else {
            this.database.execute(statements).then(() => {
                resolve();
            }).catch(err => {
                reject('err');
            });
        }
    }
}


export interface TableHeaders {
    name?: string,
    slug?: string,
}

