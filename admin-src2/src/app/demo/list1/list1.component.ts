import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
import {AgGridNg2, ICellEditorAngularComp} from "ag-grid-angular";
import {GridOptions} from "ag-grid";
import {TableCellDeleteButtonComponent} from "../../shared/table/table-cell-delete-button.component";
import {TableCellEditButtonComponent} from "../../shared/table/table-cell-edit-button.component";
import {AppEvents, HttpHelper, Utils} from "../../shared/helper.service";
import {JConfirm} from "../../shared/jconfirm";
import {Users} from "../../users/users.mock";
import {TableCellButtonCallback} from "../../shared/table/table-cell-button-callback";

/**
 This demo page was made to demo the filter in card,
 but this feature has already been shown in the demo/tabs page.
 */

@Component({
    selector: 'app-list1',
    templateUrl: './list1.component.html',
    styleUrls: ['./list1.component.scss']
})

export class List1Component {
    @ViewChild('agTable') agGrid: AgGridNg2;
    gridOptions: GridOptions;
    // define table col here!
    definedCols: any = [
        {
            headerName: 'Id', field: 'id',
        },
        {headerName: 'First name', field: 'first_name'},
        {headerName: 'Last name', field: 'last_name'},
        {headerName: 'Email', field: 'email'},
        {headerName: 'Gender', field: 'gender'},
        {headerName: 'City', field: 'city'},
        {headerName: 'Mobile', field: 'mobile'},
    ];

    fromDate;
    toDate;


    testEvent() {
        this.events.broadcast('hey', {
            'hellooooo': 'there'
        });
    }


    constructor(public httpHelper: HttpHelper,
                public jconfirm: JConfirm,
                public utils: Utils,
                private events: AppEvents,
                public route: ActivatedRoute) {

        this.route.params.subscribe((data: any) => {
            // parameters come here
        });

        this.gridOptions = {
            rowData: Users, // Load this data async later!
            context: {
                componentParent: this,
            },
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            rowSelection: 'single',
            pagination: true,
        };
    }

    /**
     * Store the state of the table columns
     * @param $event
     */
    colMoved($event) {
        // event fired when a col is moved in ag grid
        let newIndex = $event.toIndex;
        let columnMoved = $event.column.colId;
        let cols = <any>this.gridOptions.columnDefs.slice();
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

        this.utils.storage.set('usersTableCol', map);
    }

    loading: boolean = false;


    editSelected() {
        let nodes = this.agGrid.api.getSelectedRows();
        console.log(nodes);
        if (nodes.length) {
            let node = nodes[0];
            this.jconfirm.confirm({
                content: 'edit node: ' + JSON.stringify(node),
            });
        } else {
            this.jconfirm.confirm({
                content: 'Please select a node',
            });
        }
    }

    deleteSelected() {
        let nodes = this.agGrid.api.getSelectedRows();
        console.log(nodes);
        if (nodes.length) {
            let node = nodes[0];
            this.jconfirm.confirm({
                content: 'delete node: ' + JSON.stringify(node)
            });
        } else {
            this.jconfirm.confirm({
                content: 'Please select a node'
            });
        }
    }

    isRowSelected: boolean = false;

    tableSelection() {
        let nodes = this.agGrid.api.getSelectedRows();
        this.isRowSelected = !!(nodes.length);
    }

}
