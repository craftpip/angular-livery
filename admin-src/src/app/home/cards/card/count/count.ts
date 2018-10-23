import {AfterViewInit, Component, Input} from '@angular/core';
import {CardsComponent, DashboardCard} from "../../cards.component";
import {Database} from "../../../../shared/database.service";
import {Utils} from "../../../../shared/helper.service";
import {TableHeaders} from "../card.component";

@Component({
    selector: 'graph-count',
    templateUrl: 'count.html',
})
export class CountGraphComponent implements AfterViewInit {

    card: DashboardCard;
    tableName: string = '';
    tableHeaders: TableHeaders[] = [];

    constructor(
        public database: Database,
        public utils: Utils,
    ) {
        this.card = this.utils.copy(CardsComponent.defaultCardMock);
    }


    @Input('tableHeaders')
    set _tableHeaders(headers: TableHeaders[]) {
        this.tableHeaders = headers;
    }

    @Input('card')
    set _card(card: DashboardCard) {
        this.card = card;
        this.tableName = this.utils.hashTableName(this.card.table);
    }

    queryResponse: any = [];

    query(): Promise<DashboardCard> {
        return new Promise((resolve, reject) => {
            let method = this.card.options.viewOptions.count.method.toUpperCase();
            let col = this.card.options.viewOptions.count.col;
            let query = `
                  select ${method}(${col}) as c  
                  from ${this.tableName}
                `;

            let colHeader = this.tableHeaders.filter(a => {
                return a.slug == col;
            });

            this.database.execute(query).then((a) => {
                this.column = colHeader[0].name;
                this.method = method;
                this.count = a[0].c;

                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }

    count: any = '';
    method: any = '';
    column: any = '';
    renderCount: any = '';
    renderMethod: any = '';
    renderColumn: any = '';


    render() {

        let method = this.method.toUpperCase();
        switch (method) {
            case 'SUM':
                this.renderMethod = 'Sum';
                break;
            case 'AVG':
                this.renderMethod = 'Average';
                break;
            case 'COUNT':
                this.renderMethod = 'Count';
                break;
        }

        if (!this.count)
            this.count = '0';

        let c = this.count.toString();

        // check for alphabets in c, alasql concats strings
        if (/\D/.test(c.replace(/\./ig, '')))
            c = `Invalid column selected`;

        // debugger;
        let decimals = parseInt(this.card.options.viewOptions.count.decimals);
        if (isNaN(decimals))
            decimals = 2;

        if (decimals == 0) {
            decimals = -1;
        }

        let pointIndex = c.lastIndexOf('.');
        if (pointIndex != -1) {
            // got point index, trim that stuff
            c = c.substr(0, (pointIndex + decimals + 1));
        }

        let format = this.card.options.viewOptions.count.format;

        switch (format) {
            case 'normal':
                break;
            case 'us':
                c = this.formatUS(c);
                break;
            case 'in':
                c = this.formatIN(c);
                break;
            default:
            // nothing
        }
        this.renderCount = c;
        this.renderColumn = this.column;
    }

    formatUS(str: string): string {
        // debugger;
        let pointPos = str.lastIndexOf('.');
        let decimal = '';
        let base = str;
        if (pointPos != -1) {
            decimal = str.substr(pointPos + 1);
            base = str.substring(0, pointPos);
        }
        let baseAr = base.split('');
        baseAr = baseAr.reverse();
        let createdAr = [];
        for (let i in baseAr) {
            createdAr.push(baseAr[i]);
            if ((parseInt(i) + 1) % 3 == 0) {
                createdAr.push(',');
            }
        }
        let formatted = createdAr.reverse().join('') + (decimal ? ('.' + decimal) : '');
        if (formatted.charAt(0) == ',')
            formatted = formatted.substr(1);
        return formatted;
    }

    formatIN(str: string): string {
        // debugger;
        let pointPos = str.lastIndexOf('.');
        let decimal = '';
        let base = str;
        if (pointPos != -1) {
            decimal = str.substr(pointPos + 1);
            base = str.substring(0, pointPos);
        }
        let baseAr = base.split('');
        baseAr = baseAr.reverse();
        let createdAr = [];
        for (let i in baseAr) {
            createdAr.push(baseAr[i]);
            let mod = 2;
            let f = 0;
            if (parseInt(i) < 3) {
                mod = 3;
                f = 1;
            }
            if ((parseInt(i) + f) % mod == 0) {
                createdAr.push(',');
            }
        }
        let formatted = createdAr.reverse().join('') + (decimal ? ('.' + decimal) : '');
        if (formatted.charAt(0) == ',')
            formatted = formatted.substr(1);
        return formatted;

    }

    ngAfterViewInit() {
        this.query().then(() => {
            this.render();
        });
    }
} 