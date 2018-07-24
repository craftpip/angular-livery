import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpHelper, Utils} from "../shared/helper.service";
import * as moment from "moment";
import {AgGridNg2, ICellEditorAngularComp} from "ag-grid-angular";
import {JConfirm} from "../shared/jconfirm";
import {Users} from "./users.mock";
import {GridOptions} from "ag-grid";
import {TableCellDeleteButtonComponent} from "../shared/table/table-cell-delete-button.component";
import {TableCellEditButtonComponent} from "../shared/table/table-cell-edit-button.component";
import {TableCellButtonCallback} from "../shared/table/table-cell-button-callback";


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})

export class UsersComponent {
    @ViewChild('agTable') agGrid: AgGridNg2;
    columnDefs: any[] = [];
    gridOptions: GridOptions;
    definedCols: any = [
        {
            headerName: 'Id', field: 'id',
        },
        {
            headerName: 'Delete', field: 'action_delete',
            cellRendererFramework: TableCellDeleteButtonComponent,
            width: 31,
        },
        {
            headerName: 'Edit', field: 'action_edit',
            cellRendererFramework: TableCellEditButtonComponent,
            width: 31,
        },
        {headerName: 'First name', field: 'first_name'},
        {headerName: 'Last name', field: 'last_name'},
        {headerName: 'Email', field: 'email'},
        {headerName: 'Gender', field: 'gender'},
        {headerName: 'City', field: 'city'},
        {headerName: 'Mobile', field: 'mobile'},
    ];

    constructor(public httpHelper: HttpHelper,
                public jconfirm: JConfirm,
                public utils: Utils,
                public route: ActivatedRoute) {

        this.route.params.subscribe((data: any) => {
            // parameters come here
        });

        this.gridOptions = {
            rowData: Users,
            context: {
                componentParent: this,
            },
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            rowSelection: 'single',
            pagination: true,
        };

        let cols;
        if (cols = this.utils.storage.get('usersTableCol')) {
            // get the column def from storage. presist the state!
            console.log(cols);

            let sortedCols = [];
            for (let c of cols) {
                for (let d of this.definedCols) {
                    if (c == d.field) {
                        sortedCols.push(d);
                    }
                }
            }
            console.log(sortedCols);
            this.gridOptions.columnDefs = sortedCols;
        } else {
            // state does not exist, defaults please!s
            this.gridOptions.columnDefs = this.definedCols;
        }
    }

    /**
     * This function will be called from @TableCellEditButtonComponent
     * name should be editCell()
     *
     * @param {TableCellButtonCallback} s
     */
    editCell(s: TableCellButtonCallback) {
        alert(JSON.stringify(s.data));
    }

    /**
     * Similarly
     * This function will be called from @TableCellDeleteButtonComponent
     *
     * @param {TableCellButtonCallback} s
     */
    deleteCell(s: TableCellButtonCallback) {
        alert(s);
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
