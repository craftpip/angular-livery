import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
import {AgGridNg2, ICellEditorAngularComp} from "ag-grid-angular";
import {GridOptions} from "ag-grid";
import {TableCellDeleteButtonComponent} from "../../shared/table/table-cell-delete-button.component";
import {TableCellEditButtonComponent} from "../../shared/table/table-cell-edit-button.component";
import {FormHelper, HttpHelper, Utils} from "../../shared/helper.service";
import {JConfirm} from "../../shared/jconfirm";
import {Users} from "../../users/users.mock";
import {TableCellButtonCallback} from "../../shared/table/table-cell-button-callback";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})

export class TabsComponent {
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

    fromDate;
    toDate;

    constructor(public httpHelper: HttpHelper,
                public jconfirm: JConfirm,
                public utils: Utils,
                public fb: FormBuilder,
                public formHelper: FormHelper,
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

        this.formReady();
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

    asd: string;

    files: any[] = [];


    // form validation
    testForm: FormGroup;

    formReady() {
        // this.testForm = new FormGroup({
        //     'group': new FormControl(null, )
        // })

        this.testForm = this.fb.group({
            group: this.fb.control('', [
                Validators.required,
            ]),
            name: this.fb.control('', [
                Validators.required,
                Validators.minLength(5)
            ]),
            files: this.fb.control([], [
                Validators.required,
                Validators.minLength(2),
            ]),
            email: this.fb.control('', [
                Validators.required,
                Validators.email,
            ]),
            email_verified: this.fb.control('1', [
                Validators.required
            ]),
            account_active: this.fb.control('1', [
                Validators.required
            ]),
            country: this.fb.control('91', [
                Validators.required
            ]),
            mobile: this.fb.control('', [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(15),
                Validators.pattern('^[0-9]+$')
            ]),
            mobile_verified: this.fb.control('1', [
                Validators.required,
            ]),
            currency: this.fb.control('', [
                Validators.required
            ]),
            password: this.fb.control('', [
                Validators.required,
                Validators.minLength(6)
            ]),
            tag_input: this.fb.control([], [
                Validators.required,
                Validators.minLength(2)
            ]),
            date2: this.fb.control('', [
                Validators.required,
            ]),
            date: this.fb.control('', [
                Validators.required,
            ]),
            date3: this.fb.control('', [
                Validators.required,
            ]),
            checkbox_1: this.fb.control(false, [
                Validators.requiredTrue
            ]),
            radio1: this.fb.control(null, [
                Validators.required
            ]),
            radio2: this.fb.control(null, [
                Validators.required
            ]),
            textarea1: this.fb.control('', [
                Validators.required,
            ])
        });

    }

    submitForm() {
        if (this.testForm.valid) {
            this.jconfirm.confirm({
                content: 'form is valid'
            });
        } else {
            this.jconfirm.confirm({
                content: 'form is invalid'
            });
            for (let key of Object.keys(this.testForm.controls)) {
                console.log(key);
                this.testForm.get(key).markAsTouched();
            }
        }
    }

    calendarSettings: any = {
        bigBanner: true,
        timePicker: false,
        format: 'dd-MM-yyyy',
        defaultOpen: false,
    };
    date: Date = new Date();

    e(formErrors, property) {
        if (formErrors == null) {
            return true;
        }
        if (typeof formErrors[property] === 'undefined') {
            return false;
        } else {
            return true;
        }


    }

    st(a) {
        return JSON.stringify(a);
    }

    removeFromFiles(indx) {
        let files = this.testForm.get('files').value;
        files.splice(indx, 1);
        this.testForm.get('files').setValue(files);
    }

    changed() {
        alert('hey');
    }
}
