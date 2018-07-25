import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {forEach} from "@angular/router/src/utils/collection";

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
            $('.search-input > input').focus();
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
            group: 'Yo Yo'
        },
        {
            text: 'enim. Donec pede justo',
            subText: 'enim. Donec ',
            group: 'Yo Yo'
        },
        {
            text: 'venenatis vitae, justo. Nullam',
            subText: 'venenatis vitae, justo',
            group: 'Edit menu'
        },
        {
            text: 'Integer tincidunt',
            subText: '',
            group: 'Edit menu'
        },
        {
            text: 'tellus. Phasellus viverra',
            subText: 'tellus. ',
            group: 'Edit menu'
        },
        {
            text: 'Nam quam nunc',
            subText: 'Nam ',
            group: 'Edit menu'
        },
        {
            text: 'faucibus. Nullam quis',
            subText: 'faucibus. ',
            group: 'Others'
        },
        {
            text: 'Curabitur ullamcorper ultricies',
            subText: 'Curabitur ',
            group: 'Others'
        },
        {
            text: 'dapibus. Vivamus elementum',
            subText: 'dapibus. ',
            group: 'Others'
        },
        {
            text: 'metus varius laoreet. Quisque',
            subText: 'metus varius laoreet',
            group: 'Others'
        },
        {
            text: 'sodales, augue velit cursus nunc',
            subText: 'sodales, augue velit ',
            group: 'Others'
        },
        {
            text: 'Sed consequat, leo eget',
            subText: 'Sed consequat, ',
            group: 'Others'
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
            let results = this.dummyData.filter((a) => {
                if (JSON.stringify(a).toLowerCase().indexOf(this.searchTerm.toLowerCase()) != -1) {
                    return true;
                } else {
                    return false;
                }
            });
            results = this.searchGroupResults(results);
            this.searchResults = results;

            this.searchLoading = false;
        }, 400);
    }

    searchGroupResults(results: any[]) {
        let withGroup = {};

        for (let r of results) {
            let g = r.group || 'Others';
            if (typeof withGroup[g] === 'undefined')
                withGroup[g] = [];
            withGroup[g].push(r);
        }

        let groupArr = [];
        for (let group of Object.keys(withGroup)) {
            groupArr.push({
                'group': group,
                'options': withGroup[group],
            });
        }

        console.log(groupArr);

        return groupArr;
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
