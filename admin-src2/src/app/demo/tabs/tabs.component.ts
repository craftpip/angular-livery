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
import {endOfMonth, endOfToday, endOfWeek, startOfMonth, startOfToday, startOfWeek} from "date-fns";


@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})

export class TabsComponent {
    @ViewChild('agTable') agGrid: AgGridNg2;
    gridOptions: GridOptions;

    /*
     * FOR TABLE EXAMPLE, PLEASE SEE USERS COMPONENT
     */
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

    constructor(public httpHelper: HttpHelper,
                public jconfirm: JConfirm,
                public utils: Utils,
                public fb: FormBuilder,
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

        this.gridOptions.columnDefs = this.definedCols;

        this.initForm();
        this.initDropdown();
    }

    loading: boolean = false;
    files: any[] = [];

    // form validation
    testForm: FormGroup;

    initForm() {
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
            ]),
            first_name: this.fb.control('', [
                Validators.required,
            ]),
            userDropdown: this.fb.control('', [
                Validators.required,
            ]),
        });

    }

    submitForm() {
        if (this.testForm.valid) {
            this.jconfirm.confirm({
                title: 'Success!',
                content: 'the form is valid'
            });
        } else {
            this.jconfirm.confirm({
                title: 'Validation error',
                content: 'form is invalid, please try again'
            });
            for (let key of Object.keys(this.testForm.controls)) {
                this.testForm.get(key).markAsTouched();
                this.testForm.get(key).markAsDirty();
                // mark all as touched so that their errors are shown
            }
        }
    }

    /**
     * For testing
     *
     * @param a
     * @returns {string}
     */
    st(a) {
        return JSON.stringify(a);
    }

    removeFromFiles(indx) {
        let files = this.testForm.get('files').value;
        files.splice(indx, 1);
        this.testForm.get('files').setValue(files);
    }

    // auto complete
    firstNameResults: any[] = [];

    searchFirstName($event) {
        let query = $event.query;
        let users = Users;
        let results = users.filter((a) => {
            return (
                a.first_name.toLowerCase().indexOf(query) != -1
                || a.last_name.toLowerCase().indexOf(query) != -1
            );
        });
        this.firstNameResults = results.map(a => {
            return a.first_name + ' ' + a.last_name;
        });
    }

    advancedOptions: boolean = false;

    dropdownOptions: any[] = [];

    initDropdown() {
        this.dropdownOptions = Users.map((user) => {
            return {
                'name': user.first_name,
                'code': user.first_name,
            };
        });
        console.log(this.dropdownOptions)
    }
}
