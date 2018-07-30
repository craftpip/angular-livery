import {Component} from '@angular/core';
import {Router, RouterLink, Routes} from "@angular/router";
import {HttpHelper} from "../shared/helper.service";
import {Form, FormControl, FormGroup, Validator, Validators} from "@angular/forms";
import {AuthService} from "../shared/auth/auth.service";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent {
    loginForm: FormGroup;

    constructor(public router: Router, public http: HttpHelper, public authService: AuthService) {
        this.loginForm = new FormGroup({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required])
        });

        this.checkLogin();
    }

    checkingLogin: boolean = false;

    checkLogin() {
        this.checkingLogin = true;
        this.http.get('auth/valid').subscribe((data: any) => {
            this.checkingLogin = false;

            console.log(data);

            if (data.status) {
                this.authService.setUser(data.data.user);

                if (this.authService.isAuthenticated()) {
                    this.router.navigate(['home']);
                }
            } else {

            }
        }, err => {
            this.checkingLogin = false;
        });
    }

    loading: boolean = false;

    login($event) {
        $event.preventDefault();
        if (!this.loginForm.valid) {
            alert('Please enter the required fields');
            return false;
        }

        this.loading = true;
        this.http.post('auth/authenticate', this.loginForm.value).subscribe((data: any) => {
            this.loading = false;
            if (data.status) {
                console.log(data);
                this.authService.setUser(data.data.user);
                this.authService.setToken(data.data.token);

                if (this.authService.isAuthenticated()) {
                    this.router.navigate(['home']);
                }
            } else {
                alert(data.reason);
            }
        }, err => {
            this.loading = false;
            alert(err);
        });

    }

}
