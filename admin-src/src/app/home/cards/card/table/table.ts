import {AfterViewInit, Component, Input} from '@angular/core';
import {CardsComponent, DashboardCard} from "../../cards.component";
import {Database} from "../../../../shared/database.service";
import {Utils} from "../../../../shared/helper.service";
import {TableHeaders} from "../card.component";

@Component({
    selector: 'graph-table',
    templateUrl: 'table.html',
})
export class TableGraphComponent implements AfterViewInit {

    rows: any = [];
    headers: string[] = [];
    card: DashboardCard;
    tableName: string = '';
    errorMsg: string = '';

    constructor(
        public database: Database,
        public utils: Utils,
    ) {
        this.card = this.utils.copy(CardsComponent.defaultCardMock);
    }

    tableHeaders: TableHeaders[] = [];

    @Input('tableHeaders')
    set _tableHeaders(headers: TableHeaders[]) {
        this.tableHeaders = headers;
    }

    @Input('card')
    set _card(card: DashboardCard) {
        this.card = card;
        this.tableName = this.utils.hashTableName(this.card.table);
    }

    query(): Promise<void> {
        this.errorMsg = '';
        return new Promise((resolve, reject) => {
            this.database.execute(`select * from ${this.tableName}`).then((a: any[]) => {
                // console.log(a);
                if (a.length) {
                    this.headers = Object.keys(a[0]);
                    this.rows = a;
                } else {
                    this.errorMsg = 'nothing to show';
                }
                resolve();
            }).catch(err => {
                console.log('error here', err);
                reject(err);
            });
        });
    }

    ngAfterViewInit() {
        this.query().then(() => {
        });
    }
} 