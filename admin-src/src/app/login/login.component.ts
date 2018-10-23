import {AfterViewInit, Component} from '@angular/core';
import {Router} from "@angular/router";
import {HttpHelper, Utils} from "../shared/helper.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/auth/auth.service";
import {JConfirm} from "../shared/jconfirm";
import {LanguageService} from "../shared/language.service";

declare const $: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
    loginForm: FormGroup;
    registerForm: FormGroup;
    // form: string = 'login';
    form: string = 'login';
    checkingLogin: boolean = false;
    loading: boolean = false;
    registerLoading: boolean = false;

    constructor(public router: Router,
                public http: HttpHelper,
                public utils: Utils,
                public jconfirm: JConfirm,
                public fb: FormBuilder,
                public lang: LanguageService,
                public authService: AuthService) {
        this.loginForm = new FormGroup({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required])
        });

        this.registerForm = this.fb.group({
            name: this.fb.control('', [
                Validators.required,
            ]),
            email: this.fb.control('', [
                Validators.required,
                Validators.email,
            ]),
            country: this.fb.control(null, [
                Validators.required,
            ]),
            mobile: this.fb.control('', [
                Validators.required,
                Validators.maxLength(12),
                Validators.minLength(10),
                Validators.pattern('^[0-9]+$'),
            ]),
            password: this.fb.control('', [
                Validators.required,
                Validators.minLength(6),
            ]),
            confirmPassword: this.fb.control('', [
                Validators.required,
                Validators.minLength(6),
            ])
        });

        this.checkLogin();
    }


    ngAfterViewInit(){
        $('.login-username-input').focus();
    }

    checkLogin() {
        this.checkingLogin = true;

        this.http.post('auth/valid').subscribe((data: any) => {
            if (data.status) {
                this.authService.setUser(data.data.user);
                this.lang.setLangPack(data.data.langPack, data.data.lang);
                if (this.authService.isAuthenticated()) {
                    this.router.navigate(['home']);
                }
            } else {
                this.checkingLogin = false;
            }
        }, err => {
            this.checkingLogin = false;
        });
    }

    login($event) {
        $event.preventDefault();
        if (!this.loginForm.valid) {
            this.jconfirm.confirm({
                title: 'Oops',
                content: 'Please enter the required fields',
            });
            return false;
        }

        this.loading = true;
        this.http.post('auth/authenticate', this.loginForm.value).subscribe((data: any) => {
            if (data.status) {
                console.log(data);
                this.authService.setUser(data.data.user);
                this.authService.setToken(data.data.token);
                this.lang.setLangPack(data.data.langPack, data.data.lang);

                if (this.authService.isAuthenticated()) {
                    this.router.navigate(['home']);
                }
            } else {
                this.loading = false;
                this.jconfirm.confirm({
                    title: 'Oops',
                    content: data.reason,
                    type: 'red',
                });
            }
        }, err => {
            this.loading = false;
            this.jconfirm.confirm({
                title: 'Oops',
                content: err,
                type: 'red'
            });
        });
    }

    register($event) {
        $event.preventDefault();
        if (!this.registerForm.valid) {
            for (let key of Object.keys(this.registerForm.controls)) {
                this.registerForm.get(key).markAsTouched();
            }

            return false;
        }

        this.registerLoading = true;
        this.http.post('auth/create', this.registerForm.value).subscribe((data: any) => {
            this.registerLoading = false;
            if (data.status) {
                console.log(data);
                this.authService.setUser(data.data.user);
                this.authService.setToken(data.data.token);
                this.lang.setLangPack(data.data.langPack, data.data.lang);

                if (this.authService.isAuthenticated()) {
                    this.router.navigate(['home']);
                }
            } else {
                this.jconfirm.confirm({
                    title: 'Oops',
                    content: data.reason,
                    type: 'red',
                });
            }
        }, err => {
            this.registerLoading = false;
            this.jconfirm.confirm({
                title: 'Oops',
                content: err,
                type: 'red'
            });
        });
    }


}
