import {Component} from '@angular/core';
import {HttpHelper} from "./shared/helper.service";
import {AuthService} from "./shared/auth/auth.service";
import {LanguageService} from "./shared/language.service";

declare const $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(
        public authService: AuthService,
        public httpHelper: HttpHelper,
    ) {
        this.startUserUpdateProcess();
        this.runOtherCode();
    }

    startUserUpdateProcess() {
        setInterval(() => {
            if (document.hasFocus())
                this.update();
        }, 10000);
    }

    update() {
        this.httpHelper.post('sec/user/self').subscribe((response: any) => {
            if (response.status) {
                let user = response.data.user;
                this.authService.setUser(user);
            }
        }, err => {
        })
    }

    /**
     * Put other jquery code here
     * make sure to unbind everything when you leave.
     */
    runOtherCode() {
        /*
         * prevent body scroll, If the user scrolls during his cursor is inside the quick panel,
         * When the user's cursor leaves quick panel we can resume scrolling the body.
         * Great.
         * However this does not work on Internet explorer 11, not so great.
         */
        $(document).on('mouseenter.quickPanelScroll', '.quick-panel', () => {
            let st = $(document).scrollTop();
            $(document).on('scroll.scrollLock', function () {
                $(document).scrollTop(st);
            })
        });
        $(document).on('mouseleave.quickPanelScroll', '.quick-panel', () => {
            $(document).off('scroll.scrollLock');
        });
    }
}