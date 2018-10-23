import {Component} from '@angular/core';
import {HttpHelper} from "../../shared/helper.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-users-add',
    templateUrl: './users-add.component.html',
    styleUrls: ['./users-add.component.scss']
})

export class UsersAddComponent {

    userData: any = false;

    id: any = false;

    groups: any[] = [
        {
            name: 'User',
            value: 1,
        },
        {
            name: 'Administrator',
            value: 100,
        }
    ];

    currencyList: any[] = [];
    userForm: FormGroup;

    constructor(public httpHelper: HttpHelper,
                public router: Router,
                public route: ActivatedRoute, public fb: FormBuilder) {

        this.route.params.subscribe(params => {
            if (params.id) {
                this.id = params.id;
                this.load(params.id);
            }
        });

        this.initForm();
        // loading demo.
        // this.loading = true;
        // setTimeout(() => {
        //     this.loading = false;
        // }, 3000);

    }

    initForm() {
        this.userForm = this.fb.group({
            user_id: this.fb.control((!this.userData) ? '' : this.userData['id'], []),
            group: this.fb.control((!this.userData) ? '' : this.userData['group'], [Validators.required]),
            name: this.fb.control((!this.userData) ? '' : this.userData['name'], []),
            user_name: this.fb.control((!this.userData) ? '' : this.userData['username'], [Validators.required]),
            email: this.fb.control((!this.userData) ? '' : this.userData['email'], [Validators.required]),
            email_verify: this.fb.control((!this.userData) ? '' : this.userData['email_verified'], [Validators.required]),
            account_active: this.fb.control((!this.userData) ? '' : this.userData['account_active'], [Validators.required]),
            country: this.fb.control((!this.userData) ? '' : this.userData['country'], [Validators.required]),
            mobile: this.fb.control((!this.userData) ? '' : this.userData['mobile'], [Validators.required]),
            mobile_verified: this.fb.control((!this.userData) ? '' : this.userData['mobile_verified'], [Validators.required]),
            // password: this.fb.control('******', [Validators.required]),
        })
    }

    isOpen: boolean = true;

    showLoading() {
        this.loading = !this.loading;
    }

    loading: boolean = false;

    load(user_id) {
        this.loading = true;

        this.httpHelper.post('sec/users/get_by_id', {
            user_id: user_id
        }).subscribe((response: any) => {
            this.loading = false;
            if (response.status) {
                if (response.data.users) {
                    this.userData = response.data.users;
                    this.initForm();
                } else {
                    alert('No Such User');
                }
            } else {
                alert(response.reason);
            }
        }, err => {
            this.loading = false;
            alert(err);
        })
    }

    editing: boolean = false;


    editUser(ev) {
        ev.preventDefault();

        if (this.userForm.valid) {

            this.editing = true;
            this.loading = true;
            this.httpHelper.post('sec/users/edit', this.userForm.value)
                .subscribe((data: any) => {
                    this.editing = false;
                    this.loading = false;

                }, error => {
                    this.editing = false;
                    this.loading = false;

                });

        } else {
            alert('invalid data');
        }
    }


    /***
     * test function
     save(ev) {
        ev.preventDefault();
        this.saving = true;

        this.httpHelper.post('sec/users/save', {
            'user': this.user
        }).subscribe((data: any) => {
            this.saving = false;
            console.log(data);
            if (data.status) {
                this.router.navigate(['/users']);
            } else {
                alert(data.reason);
            }
        }, err => {
            this.saving = false;
            alert(err);
        })
    }
     loadingCurrency: boolean = false;
     loadCurrency() {
        this.loadingCurrency = true;

        this.httpHelper.post('sec/users/currency_codes').subscribe((response: any) => {
            this.loadingCurrency = false;
            if (response.status) {
                this.currencyList = response.data;
            } else {
                alert(response.reason);
            }
        }, err => {
            this.loadingCurrency = false;
        })
    }
     // demo
     tags: any[] = ['test2', 'test3', 'test4'];
     */
}

