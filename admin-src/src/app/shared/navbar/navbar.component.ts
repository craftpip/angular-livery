import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {NavigationEnd, Router} from "@angular/router";
import {TourService} from "../tours/tours.service";
import {AppEvents, HttpHelper, KeyboardListener, SearchRequest, SearchResult, SearchService, Utils} from "../helper.service";
import {ROUTES} from "../sidebar/sidebar-routes.config";
import {ChatComponent} from "../../chat/chat.component";
import {JConfirm} from "../jconfirm";
import {LanguageService} from "../language.service";

declare var $: any;

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    providers: []
})

export class NavbarComponent implements AfterViewInit, OnDestroy {
    public user: any = {};
    newChats: number = 0;
    public currentTourPath: string;
    public isTourAvailable: boolean = false;
    searchTerm: string = '';
    searchResults: any[] = [];
    searchLoading: boolean = false;
    searchTyping: any;
    notifications: any[] = [
        {
            'text': 'New notification!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
        {
            'text': 'New notification!',
            'subText': 'Lorem ipsum dolor sit ametitaque in, et!'
        },
    ];
    searchShow: boolean = false;
    navShow: boolean = false;
    userRouteResultSet: SearchResult[] = [];
    searchRequestPlaced: boolean = false;
    chatIsOpen: boolean = false;
    @ViewChild(ChatComponent) chatComponent: ChatComponent;
    @ViewChild('globalSearchInput') searchInput: ElementRef;
    rightNavShow: boolean = false;
    instance: NavbarComponent;
    searchKeyboardNavigationIndex = -1;
    private keyboardListener: KeyboardListener;

    constructor(public authService: AuthService,
                public tourService: TourService,
                public searchService: SearchService,
                public appEvents: AppEvents,
                public jconfirm: JConfirm,
                public languageService: LanguageService,
                public httpHelper: HttpHelper,
                public utils: Utils,
                public router: Router) {

        this.instance = this;
        this.user = authService.getUser();
        this.keyboardListener = KeyboardListener.getListener();

        this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
                let url = e.urlAfterRedirects;
                console.log(url);
                this.isTourAvailable = !!this.tourService.isAvailableForPath(url);
                this.currentTourPath = url;
            }
        })
    }

    startTour() {
        if (this.isTourAvailable) {

            this.tourService.createForPath(this.currentTourPath);
        }
    }

    openSearch() {
        this.searchShow = !this.searchShow;
        this.navShow = false;
        this.searchTerm = '';
        this.startSearch();
        $('.search-input > input').focus();
    }

    closeSearch() {
        this.searchShow = false;
        $('.search-input > input').blur();
    }

    ngOnDestroy() {
        $('.app-sidebar, .main-panel').off('click.f1');
        $('[toggleSearchNav]').off('click.f2');
        $('[toggleMasterNav]').off('click.f3');
        $('.nav-master-item').off('click.f4');
        for (let id of this.keyboardListenerIds) {
            this.keyboardListener.unRegister(id);
        }
        this.searchService.offSearch('sidebar');
        this.appEvents.offGroup('search-events-navbar');
    }

    ngAfterViewInit() {
        let nav = $('.nav-master');
        let search = $('.search-master');

        $('.app-sidebar, .main-panel').on('click.f1', (e) => {
            this.navShow = false;
            this.closeSearch();
        });

        $('[toggleSearchNav]').on('click.f2', (e) => {
            this.openSearch();
        });

        $('[toggleMasterNav]').on('click.f3', (e) => {
            this.navShow = !this.navShow;
            this.closeSearch();
        });

        $('.nav-master-item').on('click.f4', (e) => {
            this.navShow = false;
        });

        this.initSearch();
        this.initSidebarSearch();
        this.initLedgerSearch();
        this.initShortcuts();
    }

    keyboardListenerIds: any[] = [];

    initShortcuts() {
        let id1 = this.keyboardListener.register('SHIFT+C', () => {
            this.chatIsOpen = true;
        });
        this.keyboardListenerIds.push(id1);

        let id2 = this.keyboardListener.register('SHIFT+S', () => {
            this.searchShow = true;
            $('.search-input > input').focus();
        });
        this.keyboardListenerIds.push(id2);

        // let id3 = this.keyboardListener.register('CTRL+S', () => {
        //     alert('hey');
        // });
        // this.keyboardListenerIds.push(id3);

        let id4 = this.keyboardListener.register('ESC', () => {
            if (this.searchShow) {
                this.closeSearch();
            } else if (this.chatIsOpen) {
                this.chatIsOpen = false;
            }
        }, {
            disable_in_input: false,
        });
        this.keyboardListenerIds.push(id4);
    }

    initLedgerSearch() {
        this.searchService.onSearch('sidebar', (request: SearchRequest) => {
            let loading_id = this.searchService.showLoading();
            this.httpHelper.post('sec/ledger/ledger/search', {
                term: request.term
            }).subscribe((response: any) => {
                this.searchService.hideLoading(loading_id);
                if (response.status) {
                    let searchedResults: SearchResult[] = [];
                    for (let l of response.data) {
                        searchedResults.push({
                            text: '#' + l.ledger_id + ' ' + l.ledger_name,
                            subText: 'Ledger',
                            group: 'Data sets',
                            type: this.searchService.typeLink,
                            url: '/ledger/details/' + l.ledger_id,
                            tag: 'Sheet'
                        });
                    }
                    this.searchService.submitResults(request.term, searchedResults);
                }
            }, err => {
                this.searchService.hideLoading(loading_id);
            });
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }


    updateUserRoutes() {
        let user = this.authService.getUser();
        let pagesRoutes = ROUTES[user.group];
        let set: SearchResult[] = [];
        for (let r of pagesRoutes) {
            set.push({
                text: r.title,
                url: r.path,
                icon: r.icon,
                group: 'Quick links',
                type: r.isExternalLink ? this.searchService.typeExternalLink : this.searchService.typeLink,
                tag: 'Page',
            });

            if (r.submenu.length) {
                for (let sm of r.submenu) {
                    set.push({
                        text: sm.title,
                        url: sm.path,
                        group: 'Sidebar',
                        icon: sm.icon,
                        type: sm.isExternalLink ? this.searchService.typeExternalLink : this.searchService.typeLink,
                    });

                    if (sm.submenu.length) {
                        for (let sm2 of sm.submenu) {
                            set.push({
                                text: sm2.title,
                                url: sm2.path,
                                icon: sm2.icon,
                                group: 'Sidebar',
                                type: sm2.isExternalLink ? this.searchService.typeExternalLink : this.searchService.typeLink,
                            });


                        }
                    }
                }
            }
        }
        this.userRouteResultSet = set;
    }

    initSidebarSearch() {
        this.updateUserRoutes();
        this.appEvents.on(this.authService.userUpdateEvent, () => {
            this.updateUserRoutes();
        }, 'search-events-navbar');

        this.searchService.onSearch('sidebar', (request: SearchRequest) => {
            let loading_id = this.searchService.showLoading();
            let searchedResults = this.userRouteResultSet.filter((result: SearchResult) => {
                return (JSON.stringify(result).toLowerCase().indexOf(request.term.toLowerCase()) != -1);
            });
            this.searchService.submitResults(request.term, searchedResults);
            this.searchService.hideLoading(loading_id);
        });
    }

    initSearch() {
        this.appEvents.on('_start-chat', (data) => {
            this.chatIsOpen = true;
            this.chatComponent.chat(data.id, data.type);
        }, 'search-events-navbar');

        this.searchService.onLoadingChange((isLoading) => {
            // console.log('Loading: ', isLoading);
            this.searchLoading = isLoading;
        });
        this.searchService.onResultsChange(() => {
            let results = this.searchService.getAllResults();
            // console.log(results);
            let sr = this.searchGroupResults(results);
            console.log(sr);
            this.searchResults = sr;
        });

        let w = <any>window;
        console.log(this.searchInput, w.test = this.searchInput);


        // search result navigation with keyboard.
        $(this.searchInput.nativeElement).on('keydown', (e) => {
            if (e.which == '38' || e.which == '40') {
                e.preventDefault();
                this.searchInputNavigate(e.which == '38' ? -1 : 1);
            }
            if (e.which == '13') {
                e.preventDefault();
                this.searchInputEnter();
            }
        });
    }

    searchInputEnter() {
        let indx = this.searchKeyboardNavigationIndex;
        let res = this.searchResults[indx] || {};
        if (res.type == 'result') {
            this.searchClick(res.data);
        } else {
            // hmm
        }
    }

    /**
     * Navigate the search results.
     * @param dir
     */
    searchInputNavigate(dir: number = 1) {
        if (this.searchResults.length == 0)
            return false;


        while (true) {
            this.searchKeyboardNavigationIndex += dir;

            if (this.searchKeyboardNavigationIndex < 0) {
                this.searchKeyboardNavigationIndex = this.searchResults.length - 1;
            } else if (this.searchKeyboardNavigationIndex > this.searchResults.length - 1) {
                this.searchKeyboardNavigationIndex = 0;
            }

            let r = this.searchResults[this.searchKeyboardNavigationIndex] || false;

            if (r.type && r.type == 'result') {
                console.log('got result');
                break;
            } else {
                // not a result. navigate more!
            }
        }

        setTimeout(() => {
            let offset = $('.result-active').offset().top;
            let scrollTop = $('.search-results').scrollTop();
            offset = scrollTop + offset - $('.search-results').height();

            $('.search-results').animate({
                scrollTop: offset,
            }, 50)

            // $('.search-results').scrollTop(offset);
        }, 100);

    }


    startSearch() {
        this.searchRequestPlaced = false;
        if (!this.searchTerm) {
            // this.searchLoading = false;
            return false;
        }

        if (this.searchTyping) {
            clearTimeout(this.searchTyping);
            this.searchTyping = false;
        }

        this.searchTyping = setTimeout(() => {
            this.searchService.placeSearchRequest(this.searchTerm);
            this.searchRequestPlaced = true;
        }, 300);
    }

    searchClick(r: SearchResult) {
        this.searchService.click(r);
        this.closeSearch();
    }

    searchGroupResults(results: SearchResult[]) {
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

        return this.searchGroupResultsFlat(groupArr);

        // return groupArr;
    }

    chatFullWidth: boolean = false;

    openChat() {
        this.chatIsOpen = !this.chatIsOpen;
        // if (this.chatComponent.chatContact.contact_id) {
        // this.chatComponent.unReadMessages[this.chatComponent.chatContact.contact_id] = 0;
        // this.chatComponent.calcUnReadMessages();
        // }
    }


    changeLanguage() {
        let user = this.authService.getUser();
        let lang = user.profile_fields.lang || 'en';

        this.jconfirm.confirm({
            title: 'Language',
            content: ` 
                <div style="width: 90px;float: right;">
                    <img src="assets/img/translation_icon.jpg">
                </div>
                
                <div style="width: calc(100% - 150px);" class="pt-2"> 
                    <div class="form-group">
                        <label for="">Select language</label>
                        <select class="form-control form-control-sm lang-selection-input">
                            <option value="en">English</option>
                            <option value="ar">Arabic</option>
                        </select>
                    </div>
                </div>
            `,
            onContentReady: () => {
                $('.lang-selection-input').val(lang);
            },
            buttons: {
                confirm: {
                    btnClass: 'btn btn-outline-success',
                    action: () => {
                        let selectedLang = $('.lang-selection-input').val();
                        this.utils.infoNotification('Saving language');
                        this.httpHelper.post('sec/user/update_lang', {
                            lang: selectedLang
                        }).subscribe((response: any) => {
                            if (response.status) {
                                this.utils.successNotification('Language changed successfully, reloading application.');
                                this.router.navigateByUrl('/');
                            } else {
                                this.utils.errorNotification(response.reason);
                            }
                        }, err => {
                            this.utils.errorNotification();
                        })
                    }
                },
                close: {

                    action: () => {

                    }
                }
            }
        })
    }


    /**
     * Creates grouping in flat, one level hierarchy
     * @param results
     */
    private searchGroupResultsFlat(results: {
        group: string,
        options: SearchResult[]
    }[]) {
        let flatResults = [];

        for (let g of results) {
            flatResults.push({
                'type': 'group',
                'data': g.group
            });

            for (let g2 of g.options) {
                flatResults.push({
                    'type': 'result',
                    'data': g2,
                });
            }
        }

        return flatResults;
    }

}
