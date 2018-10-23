import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpHelper, Utils} from "../shared/helper.service";
import * as moment from "moment";
import {AgGridNg2, ICellEditorAngularComp} from "ag-grid-angular";
import {JConfirm} from "../shared/jconfirm";
import {Users} from "./users.mock";
import {GridOptions} from "ag-grid";
import {TableCellDeleteButtonComponent} from "../shared/table/table-cell-delete-button.component";
import {
    TableCellEditButtonComponent,
} from "../shared/table/table-cell-edit-button.component";
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

export class UsersComponent implements OnInit {
    @ViewChild('agTable') agGrid: AgGridNg2;
    gridOptions: GridOptions;
    gridSaveStateName: string = 'usersTableCols';
    // define table col here!
    definedCols: any = [
        {
            headerName: 'Delete', field: 'action_delete',
            cellRendererFramework: TableCellDeleteButtonComponent,
            width: 50,
        },
        {
            headerName: 'Edit', field: 'action_edit',
            cellRendererFramework: TableCellEditButtonComponent,
            width: 50,
        },
        {
            headerName: 'ID', field: 'id',
        },
        {headerName: 'Group', field: 'group'},
        {headerName: 'Company name', field: 'company_name'},
        {headerName: 'E-mail', field: 'email'},
        {headerName: 'Mobile', field: 'mobile'},
        {headerName: 'Country', field: 'country'},
        {headerName: 'Username', field: 'username'},
        {headerName: 'Account handler', field: 'account_handler_name'},
    ];

    constructor(public httpHelper: HttpHelper,
                public jconfirm: JConfirm,
                public utils: Utils,
                public router: Router,
                public route: ActivatedRoute) {

        this.route.params.subscribe((data: any) => {
            // parameters come here
        });

        this.gridOptions = {
            rowData: [],
            context: {
                componentParent: this,
            },
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            rowSelection: 'single',
            pagination: true,
        };

        this.gridOptions.columnDefs = this.utils.agGridGetSavedColState(this.definedCols, this.gridSaveStateName);
    }

    load() {
        this.loading = true;
        this.httpHelper.post('sec/users/list').subscribe((response: any) => {
            this.loading = false;
            if (response.status) {
                let users = response.data.users;
                this.agGrid.api.setRowData(users);
                setTimeout(() => {
                    this.agGrid.api.sizeColumnsToFit();
                }, 100);
            } else {
                this.utils.errorNotification(response.reason);
            }
        }, err => {
            this.loading = false;
            this.utils.errorNotification();
        });
    }

    ngOnInit() {
        this.load();
    }

    /**
     * This function will be called from @TableCellEditButtonComponent
     * name should be editCell()
     *
     * @param {TableCellButtonCallback} s
     */
    editCell(s: TableCellButtonCallback) {
        let user_id = s.data.id;
        this.router.navigateByUrl('/users/edit/' + user_id);
    }

    /**
     * Similarly
     * This function will be called from @TableCellDeleteButtonComponent
     *
     * @param {TableCellButtonCallback} s
     */
    deleteCell(s: TableCellButtonCallback) {
        this.deleteUser(s.data);
    }

    colMoved($event) {
        this.utils.agGridSaveColState(this.gridOptions.columnDefs, $event, this.gridSaveStateName);
    }

    loading: boolean = false;

    editSelected() {
        let nodes = this.agGrid.api.getSelectedRows();
        console.log(nodes);
        if (nodes.length) {
            let node = nodes[0];
            this.editInPanel(node);

            // this.jconfirm.confirm({
            //     content: 'edit node: ' + node.first_name,
            // });
        } else {
            this.jconfirm.confirm({
                content: 'Please select a node',
            });
        }
    }

    deleteUser(user) {
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

    deleteSelected() {
        let nodes = this.agGrid.api.getSelectedRows();
        console.log(nodes);
        if (nodes.length) {
            let node = nodes[0];
            this.deleteUser(node);
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

//    quick panel

    editInPanel(user: any) {
        this.editUser = {...user}; // make a copy.
        this.isOpen = true;
    }

    isOpen: boolean = false; // close the panel initially
    editUser: any = {}; // object used in quick panel
}
