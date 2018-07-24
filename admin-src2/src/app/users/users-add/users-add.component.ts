import {Component} from '@angular/core';
import {HttpHelper} from "../../shared/helper.service";
import {ActivatedRoute, Router} from "@angular/router";


@Component({
    selector: 'app-users-add',
    templateUrl: './users-add.component.html',
    styleUrls: ['./users-add.component.scss']
})

export class UsersAddComponent {

    user: any = {
        profile_fields: {},
    };

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

    constructor(public httpHelper: HttpHelper,
                public router: Router,
                public route: ActivatedRoute) {

        this.route.params.subscribe(params => {
            if (params.id) {
                this.id = params.id;
                this.load(params.id);
            }
        });

        this.loadCurrency();
    }

    loading: boolean = false;

    load(user_id) {
        this.loading = true;

        this.httpHelper.post('sec/users/one', {
            user_id: user_id
        }).subscribe((response: any) => {
            this.loading = false;
            if (response.status) {
                this.user = response.data;
            } else {
                alert(response.reason);
            }
        }, err => {
            this.loading = false;
            alert(err);
        })
    }

    saving: boolean = false;

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

    tags: any[] = ['test1', 'test3', 'test4'];

    timeUpdated($event) {
        console.log('time updated', $event);
    }
}
