import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../shared/auth/auth.service";
import {FormBuilder} from "@angular/forms";
import {AppEvents, HttpHelper, SearchService, Utils} from "../shared/helper.service";
import {Database} from "../shared/database.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnDestroy, OnInit {
    user: any = {};

    constructor(public httpHelper: HttpHelper,
                public authService: AuthService,
                public fb: FormBuilder,
                public utils: Utils,
                public database: Database,
                public searchService: SearchService,
                public events: AppEvents,) {

        this.user = this.authService.getUser();
        console.log(this.user);

        this.events.on(this.authService.userUpdateEvent, () => {
            this.user = this.authService.getUser();
        }, 'homepage');

        if (this.user.account_verification != '1' || this.user.account_handler_id == null) {
            // not verified, update data to check if its verified.
            this.updateUserData();
        }
    }

    updateUserData() {
        this.httpHelper.post('sec/user/self').subscribe((response: any) => {
            if (response.status) {
                let user = response.data.user;
                if (user.account_verification != this.user.account_verification)
                    this.authService.setUser(user);
            }
        }, err => {
        })
    }

    ngOnDestroy() {
        this.events.offGroup('homepage');
    }

    ngOnInit() {
        // this.database.executeThread('asda');
    }
}