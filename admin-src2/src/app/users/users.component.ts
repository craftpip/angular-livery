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
import {HomeComponent} from "../home/home.component";
import {LoginComponent} from "../login/login.component";
import {CalendarModule} from "angular-calendar";
import {CalendarComponent} from "../demo/calendar/calendar.component";


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})

export class UsersComponent {
    isOpen: boolean = true;
    @ViewChild('agTable') agGrid: AgGridNg2;
    gridOptions: GridOptions;
    // define table col here!
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

        let cols;
        if (cols = this.utils.storage.get('usersTableCol')) {
            // get the column def from storage. presist the state!
            // have to sort the columns according to its history manually,
            // after adding components in col options its not possible to load its json directly as it contains reference to component class.
            let sortedCols = [];
            for (let c of cols) {
                for (let d of this.definedCols) {
                    if (c == d.field) {
                        sortedCols.push(d);
                    }
                }
            }
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
        this.jconfirm.confirm({
            content: 'edit node: ' + s.data.first_name
        });
    }

    /**
     * Similarly
     * This function will be called from @TableCellDeleteButtonComponent
     *
     * @param {TableCellButtonCallback} s
     */
    deleteCell(s: TableCellButtonCallback) {
        // alert(s);

        this.jconfirm.confirm({
            content: 'Are you sure to delete the row?',
            title: "Confirm?",
            buttons: {
                'delete': {
                    btnClass: 'btn-sm btn-outline-danger',
                    action: () => {
                        // this.jconfirm.confirm({
                        //     content: 'The row has been deleted!',
                        //     title: 'Alert',
                        // })
                        this.utils.notification({
                            text: 'The row has been deleted',
                            type: this.utils.notificationType.success,
                            layout: this.utils.notificationLayouts.topRight,
                        });
                    }
                },
                cancel: {
                    action: () => {
                        this.jconfirm.confirm({
                            content: 'That action has been cancelled!'
                        });
                        // return false;
                    }
                }
            },
            animateFromElement: false, // because it wont be able to find the button clicked
            autoClose: 'cancel|4000',
        });
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
                content: 'edit node: ' + node.first_name,
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
                content: 'delete node: ' + node.first_name
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
