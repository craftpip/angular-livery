import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpHelper} from "../shared/helper.service";
import * as moment from "moment";
import {AgGridNg2} from "ag-grid-angular";
import {JConfirm} from "../shared/jconfirm";
import {Users} from "./users.mock";


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})

export class UsersComponent {

    page = 1;
    total = 10;
    pageSize = 30;
    usersList: any[] = [];

    constructor(public httpHelper: HttpHelper,
                public jconfirm: JConfirm,
                public route: ActivatedRoute) {

        // this.getList();

        this.route.params.subscribe((data: any) => {
            // if (data.parent_id) {
            // this.filters.parent_id = data.parent_id;
            // }
        });
    }

    loading: boolean = false;

    filters: any = {};

    // deleteUser(user_id) {
    //     let c = confirm('Are you sure to delete the user?, this action cannot be undone.');
    //
    //     if (!c)
    //         return false;
    //
    //     this.httpHelper.post('sec/users/remove', {
    //         user_id: user_id
    //     }).subscribe((data: any) => {
    //         if (data.status) {
    //             this.getList();
    //         } else {
    //             alert(data.reason);
    //         }
    //     }, err => {
    //         this.loading = false;
    //         console.log(err);
    //     });
    // }

    @ViewChild('agTable') agGrid: AgGridNg2;
    columnDefs = [
        {headerName: 'Id', field: 'id'},
        {headerName: 'First name', field: 'first_name'},
        {headerName: 'Last name', field: 'last_name'},
        {headerName: 'Email', field: 'email'},
        {headerName: 'Gender', field: 'gender'},
        {headerName: 'City', field: 'city'},
        {headerName: 'Mobile', field: 'mobile'},
    ];
    icons = {
        groupLoading:
            '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid-docs/master/src/javascript-grid-server-side-model/spinner.gif" style="width:22px;height:22px;">'
    };
    rowData = Users;

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

    colMoved($event) {
        console.log($event);
    }
}
