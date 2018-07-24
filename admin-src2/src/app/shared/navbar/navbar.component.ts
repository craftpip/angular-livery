import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

declare var $: any;

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    providers: []
})

export class NavbarComponent implements OnInit {
    public user = {};

    constructor(public authService: AuthService,
                public router: Router) {
        this.user = authService.getUser();

    }

    ngOnInit() {
        let nav = $('.nav-master');
        let search = $('.search-master');

        $('.app-sidebar, .main-panel').on('click', (e) => {
            nav.addClass('hide');
            search.addClass('hide');
        });

        $('[toggleSearchNav]').on('click', (e) => {
            search.toggleClass('hide');
            nav.addClass('hide');
        });

        $('[toggleMasterNav]').on('click', (e) => {
            nav.toggleClass('hide');
            search.addClass('hide');
        });

        $('.nav-master-item').on('click', (e) => {
            nav.addClass('hide');
        })

        $('.search-result').on('click', (e) => {
            search.addClass('hide');
        })
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }

    toggleMasterNav() {

    }

    searchTerm: string = '';
    searchResults: any[] = [];
    searchLoading: boolean = false;

    dummyData: any[] = [
        {
            text: 'Lorem ipsum dolor sit amet',
            subText: 'Lorem ipsum dolor ',
        },
        {
            text: 'enim. Donec pede justo',
            subText: 'enim. Donec ',
        },
        {
            text: 'venenatis vitae, justo. Nullam',
            subText: 'venenatis vitae, justo',
        },
        {
            text: 'Integer tincidunt',
            subText: '',
        },
        {
            text: 'tellus. Phasellus viverra',
            subText: 'tellus. ',
        },
        {
            text: 'Nam quam nunc',
            subText: 'Nam ',
        },
        {
            text: 'faucibus. Nullam quis',
            subText: 'faucibus. ',
        },
        {
            text: 'Curabitur ullamcorper ultricies',
            subText: 'Curabitur ',
        },
        {
            text: 'dapibus. Vivamus elementum',
            subText: 'dapibus. ',
        },
        {
            text: 'metus varius laoreet. Quisque',
            subText: 'metus varius laoreet',
        },
        {
            text: 'sodales, augue velit cursus nunc',
            subText: 'sodales, augue velit ',
        },
        {
            text: 'Sed consequat, leo eget',
            subText: 'Sed consequat, ',
        },
    ];

    searchTyping: any;

    searchApp() {
        this.searchLoading = true;

        if (!this.searchTerm) {
            this.searchResults = [];
            this.searchLoading = false;
            return false;
        }

        if (this.searchTyping) {
            clearTimeout(this.searchTyping);
            this.searchTyping = false;
        }


        // api call here.
        this.searchTyping = setTimeout(() => {
            this.searchResults = this.dummyData.filter((a) => {
                if (JSON.stringify(a).toLowerCase().indexOf(this.searchTerm.toLowerCase()) != -1) {
                    return true;
                } else {
                    return false;
                }
            });
            this.searchLoading = false;
        }, 400);
    }

    notifications: any[] = [
        {
            'text': 'New notification bar!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification bar!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification bar!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification bar!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification bar!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification bar!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification bar!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification bar!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification bar!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification bar!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
    ];

}
