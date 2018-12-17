import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpHelper, Utils} from "../shared/helper.service";
import {JConfirm} from "../shared/jconfirm";


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

    constructor(public httpHelper: HttpHelper,
                public jconfirm: JConfirm,
                public utils: Utils,
                public router: Router,
                public route: ActivatedRoute) {

        this.route.params.subscribe((data: any) => {
            // parameters come here
        });
    }


    users: any[] = [];

    load() {
        this.loading = true;
        this.httpHelper.post('sec/users/list').subscribe((response: any) => {
            this.loading = false;
            if (response.status) {
                let users = response.data.users;
                this.users = users;
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

    loading: boolean = false;

    edit(user) {
        // this.editInPanel(user);
        this.router.navigateByUrl('/users/edit/' + user.id);
    }

    deleteUser(user) {
        this.jconfirm.confirm({
            content: 'Are you sure to delete the row?',
            title: "Confirm?",
            buttons: {
                deleteBtn: {
                    text: 'Delete',
                    btnClass: 'btn-sm btn-outline-danger',
                    action: () => {
                        this.utils.successNotification('The row has been deleted');
                    }
                },
                cancel: {
                    action: () => {

                    }
                }
            },
            animateFromElement: false, // because it wont be able to find the button clicked
            autoClose: 'cancel|4000',
        });
    }

    editInPanel(user: any) {
        this.editUser = {...user}; // make a copy.
        this.isOpen = true;
    }

    isOpen: boolean = false; // close the panel initially
    editUser: any = {}; // object used in quick panel
}
