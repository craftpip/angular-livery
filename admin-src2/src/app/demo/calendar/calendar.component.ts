import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpHelper} from "../../shared/helper.service";
import * as moment from "moment";
import {AgGridNg2} from "ag-grid-angular";
import {JConfirm} from "../../shared/jconfirm";

@Component({
    selector: 'app-demo-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent {

    constructor(public httpHelper: HttpHelper,
                public jconfirm: JConfirm,
                public route: ActivatedRoute) {

        this.route.params.subscribe((data: any) => {
            // if (data.parent_id) {
            // this.filters.parent_id = data.parent_id;
            // }
        });
    }
}