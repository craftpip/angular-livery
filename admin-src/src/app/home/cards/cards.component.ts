import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AppEvents, HttpHelper, HttpResponse, KeyValuePair, Utils} from "../../shared/helper.service";
import {AuthService} from "../../shared/auth/auth.service";
import {JConfirm} from "../../shared/jconfirm";
import {TableHeaders} from "./card/card.component";
import {DragulaService} from "ng2-dragula";
import {Subscription} from "rxjs";

declare const Muuri: any;

/**
 * Level 1 for dashboard
 * everything starts here.
 * big bang happens
 */
@Component({
    selector: 'app-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss']
})

export class CardsComponent implements AfterViewInit, OnDestroy {
    constructor(public httpHelper: HttpHelper,
                public authService: AuthService,
                public fb: FormBuilder,
                public utils: Utils,
                public jconfirm: JConfirm,
                public dragulaService: DragulaService,
                public events: AppEvents,) {

        this.sidebarCard = this.utils.copy(CardsComponent.defaultCardMock);
        // have to fill the form will mock objects.
        // or else angular will start throwing errors for undefined object in object

        this.initDragula();
    }

    cards: DashboardCard[] = [];
    sidebarIsOpen: boolean = false;
    tableList: { code: string, name: string }[] = [];
    sidebarLoadingTableList: boolean = false;
    sidebarCard: DashboardCard;

    /**
     * All of the objects below must be present in the object,
     * to avoid the cant read property of undefined error.
     *
     * PLUS: _o: true is used to keep the object NOT EMPTY.
     * because php uses multi dim arrays for objects, and if an object is empty it will parse it as an array.
     */
    public static defaultCardMock: DashboardCard = {
        options: {
            view: 'table',
            filters: {
                _o: true,
            },
            viewOptions: {
                table: {
                    _o: true,
                },
                line: {
                    lines: []
                },
                bar: {
                    lines: []
                },
                column: {
                    lines: [],
                },
                pie: {
                    _o: true,
                },
                donut: {
                    _o: true,
                },
                count: {
                    _o: true,
                },
            },
        }
    };

    /**
     * Edit card
     * @param card
     * @param indx
     */
    editCard(card: DashboardCard, indx: number) {
        this.openAddEditSidebar(card);
    }

    /**
     * Create copy of an existing card,
     * generate a new id, thats it
     *
     * @param card
     * @param indx
     */
    copyCard(card: DashboardCard, indx: number) {
        let cardCopy = <DashboardCard>this.utils.copy(card);
        cardCopy.id = this.utils.uniqueCode();
        this.cards.push(cardCopy);
        this.saveCardsState(this.cards);
        this.utils.infoNotification('Card copied!');
    }

    /**
     * Remove the card from the cards array.
     * and save it on server.
     *
     * @param card
     * @param indx
     */
    removeCard(card: DashboardCard, indx: number) {
        let jc = this.jconfirm.confirm({
            title: 'Remove card?',
            content: 'The card will be deleted from your dashboard, you can set it up again later.',
            buttons: {
                remove: {
                    text: "Remove",
                    btnClass: 'btn-outline-danger clickable',
                    action: (btn) => {
                        // this is basically, just to remove the card from array and save the whole card array to server.
                        this.cards.splice(indx, 1);
                        jc.buttons.remove.disable();
                        jc.buttons.cancel.disable();
                        this.saveCardsState(this.cards).then(() => {
                            this.utils.successNotification('Changes saved!');
                        }).catch(err => {
                            this.utils.successNotification('Could not save dashboard changes');
                        });
                    }
                },
                cancel: {
                    text: 'Close',
                    btnClass: 'btn-default clickable',
                    action: () => {

                    }
                }
            }
        })
    }

    /**
     * Open the add new sidebar
     */
    openAddEditSidebar(card) {
        this.sidebarIsOpen = true;
        let mock = card || CardsComponent.defaultCardMock;
        this.sidebarCard = this.utils.copy(mock);
        this.loadTableNames();
        if (this.sidebarCard.id) {
            // edit ? load the column names
            this.sidebarOnChangeTableName();
        }
    }

    closeAddEditSidebar() {
        this.sidebarIsOpen = false;
        this.sidebarCard = this.utils.copy(CardsComponent.defaultCardMock);
    }

    sidebarOnChangeTableName() {
        let table = this.sidebarCard.tableCode;
        // loads columns for this table.
        this.loadTableColumns();
    }

    sidebarLoadingTableColumns: boolean = false;
    sidebarTableColumns: KeyValuePair[] = [];
    sidebarTableLoadedFor: string = '';

    /**
     * Load columns for the table.
     */
    private loadTableColumns() {
        let tableName = this.sidebarCard.tableCode;
        for (let t of this.tableList) {
            if (t.code == this.sidebarCard.tableCode)
                tableName = t.name;
        }

        if (this.sidebarTableLoadedFor != tableName)
            this.sidebarLoadingTableColumns = true;

        this.httpHelper.post('sec/dashboard/get_cols', {
            'table': tableName,
        }).subscribe((response: HttpResponse) => {
            this.sidebarTableLoadedFor = tableName;
            this.sidebarLoadingTableColumns = false;
            if (response.status) {
                let columns = Object.keys(response.data.cols);
                this.sidebarTableColumns = columns.map((a) => {
                    return <KeyValuePair>{
                        key: a,
                        value: this.utils.makeSlug(a),
                    }
                });
            } else {
                this.utils.errorNotification(response.reason);
            }
        }, err => {
            this.sidebarLoadingTableColumns = false;
        })
    }

    /**
     * Load table name to show in option dropdown in sidebar.
     * One time load, all the tables in the database.
     */
    private loadTableNames() {
        if (this.tableList.length)
            return;

        this.sidebarLoadingTableList = true;
        this.httpHelper.post('sec/dashboard/get_tables')
            .subscribe((response: any) => {
                this.sidebarLoadingTableList = false;
                if (response.status) {
                    console.log(response);
                    let tables = response.data.tables;
                    let tableNames: any[] = [];
                    for (let i of tables) {
                        let name = i[Object.keys(i)[0]];
                        tableNames.push({
                            code: this.utils.makeSlug(name),
                            name: name,
                        });
                    }
                    this.tableList = tableNames;
                } else {
                    this.utils.errorNotification(response.reason);
                }
            }, err => {
                this.sidebarLoadingTableList = false;
                this.utils.errorNotification();
            })
    }

    private _validateLine(lines: GraphViewLine[], errors) {
        if (lines.length == 0) {
            errors.push('Please add lines to the graph.');
        } else {
            for (let l of lines) {
                if (!l.line || !l.aggregator)
                    errors.push('Please select line column and aggregator');
            }
        }
    }

    private validateDashboardCard(card): string[] {
        let errors: string[] = [];

        if (!card.name)
            errors.push('Please enter name for card');
        if (!card.tableCode)
            errors.push('Please select data source for the card');
        if (!card.size)
            errors.push('Please select size for card');

        switch (card.options.view) {
            case 'table':
                // all good
                break;
            case 'pie':
                if (!card.options.viewOptions.pie.legend || !card.options.viewOptions.pie.value)
                    errors.push('Please select valid item in legend and value');
                if (!card.options.viewOptions.pie.valueAggregator) // default if nothing?
                    card.options.viewOptions.pie.valueAggregator = 'sum';
                break;
            case 'donut':
                if (!card.options.viewOptions.donut.legend || !card.options.viewOptions.donut.value)
                    errors.push('Invalid value for legend and value fields');
                if (!card.options.viewOptions.donut.valueAggregator) // default if nothing?
                    card.options.viewOptions.donut.valueAggregator = 'sum';
                break;
            case 'line':
                if (!card.options.viewOptions.line.legend)
                    errors.push('Please select legend');
                this._validateLine(card.options.viewOptions.line.lines, errors);
                break;
            case 'bar':
                if (!card.options.viewOptions.bar.legend)
                    errors.push('Please select legend');
                this._validateLine(card.options.viewOptions.bar.lines, errors);
                break;
            case 'column':
                if (!card.options.viewOptions.column.legend)
                    errors.push('Please select legend');
                this._validateLine(card.options.viewOptions.column.lines, errors);
                break;
            case 'count':
                if (!card.options.viewOptions.count.col)
                    errors.push('Please select column for count');

                if (!card.options.viewOptions.count.method)
                    card.options.viewOptions.count.method = 'sum';
                if (!card.options.viewOptions.count.decimals)
                    card.options.viewOptions.count.decimals = 0;
                if (!card.options.viewOptions.count.format)
                    card.options.viewOptions.count.format = 'normal';

                break;
            default:
                errors.push('Please select a view to render');
        }

        return errors;
    }

    /**
     * Create the card and push to cards array
     */
    sidebarCreateOrSaveCard() {
        let newCard: DashboardCard = this.utils.copy(this.sidebarCard);
        console.log(newCard);
        let updateCard: boolean = !!newCard.id;
        newCard.nameCode = this.utils.makeSlug(newCard.name);
        for (let t of this.tableList)
            if (t.code == newCard.tableCode)
                newCard.table = t.name;

        let errors = this.validateDashboardCard(newCard);

        if (errors.length == 0)
            this._sidebarCreateOrSaveCard(newCard, updateCard);
        else
            this.utils.errorNotification(errors.join('<br>'));
    }

    _sidebarCreateOrSaveCard(newCard: DashboardCard, updateCard: boolean) {
        // set name code, and set the table name from the table code.

        if (updateCard) {
            for (let i in this.cards) {
                if (this.cards[i].id == newCard.id) {
                    this.cards[i] = this.utils.copy(newCard);
                }
            }
        } else {
            newCard.id = this.utils.uniqueCode();
            this.cards.push(newCard);
        }

        this.sidebarCard = this.utils.copy(CardsComponent.defaultCardMock);
        this.sidebarIsOpen = false;
        this.saveCardsState(this.cards).then(() => {
            this.utils.infoNotification('Dashboard saved');
        });
    }

    ngAfterViewInit() {
        this.initCards();
    }

    ngOnDestroy() {
        this.destroyDragula();
    }

    //
    // vamps = [
    //     {name: "Bad Vamp"},
    //     {name: "Petrovitch the Slain"},
    //     {name: "Bob of the Everglades"},
    //     {name: "The Optimistic Reaper"}
    // ];

    dragTimeout: number;
    dragSubscription: Subscription;

    initDragula() {

        this.dragulaService.destroy('DCARDS');

        this.dragulaService.createGroup("DCARDS", {
            moves: (el, container, handle) => {
                return handle.className === 'card-title';
            }
        });

        this.dragSubscription = this.dragulaService.dropModel("DCARDS").subscribe(args => {
            console.log(args);

            if (this.dragTimeout)
                clearTimeout(this.dragTimeout);

            this.dragTimeout = setTimeout(() => {
                this.saveCardsState(this.cards);
            }, 2000);
        });
    }

    destroyDragula() {
        this.dragSubscription.unsubscribe();
    }

    // mi: any[] = [
    //     {
    //         text: 'hey'
    //     },
    //     {
    //         text: 'hey2'
    //     },
    //     {
    //         text: 'hey3'
    //     },
    //     {
    //         text: 'hey3'
    //     },
    //     {
    //         text: 'hey3'
    //     },
    //     {
    //         text: 'hey3'
    //     },
    //     {
    //         text: 'hey3'
    //     },
    //     {
    //         text: 'hey3'
    //     },
    //     {
    //         text: 'hey3'
    //     },
    //     {
    //         text: 'hey3'
    //     },
    //     {
    //         text: 'hey3'
    //     },
    //     {
    //         text: 'hey3'
    //     },
    //     {
    //         text: 'hey3'
    //     },
    //     {
    //         text: 'hey3'
    //     },
    //     {
    //         text: 'hey3'
    //     },
    // ];
    //
    // grid: any;
    //
    // initMuuri() {
    //     this.grid = new Muuri('.grid', {
    //         dragEnabled: true,
    //     });
    // }
    //
    // addD() {
    //     this.vamps.push({
    //         name: Math.round(Math.random() * 999).toString()
    //     });
    // }
    //
    // add() {
    //     this.grid.destroy();
    //     this.mi.push({
    //         text: Math.round(Math.random() * 999)
    //     });
    //     setTimeout(() => {
    //         this.initMuuri()
    //     }, 1);
    // }

    table: any[] = [];
    loadingCards: boolean = false;

    initCards() {
        this.loadingCards = true;
        this.httpHelper.post('sec/dashboard/init', {}).subscribe((response: HttpResponse) => {
            this.loadingCards = false;
            if (response.status) {
                this.cards = response.data.cards || [];
            } else {
                this.utils.errorNotification(response.reason);
            }
        }, err => {
            this.loadingCards = false;
            this.utils.errorNotification();
        });
    }


    savingCards: boolean = false;

    /**
     * Save cards state
     * @param cards
     */
    saveCardsState(cards): Promise<any> {
        return new Promise((resolve, reject) => {
            this.cards = cards;
            this.savingCards = true;
            this.httpHelper.post('sec/dashboard/save', {
                cards: this.cards
            }).subscribe((response: HttpResponse) => {
                this.savingCards = false;
                if (response.status) {
                    // ok whatever
                    resolve();
                } else {
                    reject();
                    this.utils.errorNotification(response.reason);
                }
            }, err => {
                this.savingCards = false;
                this.utils.errorNotification();
                reject();
            });
        })

    }
}

export interface DashboardCard {
    name?: string,
    nameCode?: string,
    table?: string,
    tableCode?: string,
    tableHeaders?: TableHeaders[],
    size?: string,
    options: GraphFilterOptions,
    id?: string,
}


/**
 * Options for card graph,
 * NOW why does the objects have _o in it,
 * it is to preserve the object when its empty.
 *
 * TLDR: prevent the empty object from converting to an array.
 *
 * In php JSON objects are converted to Associative arrays,
 * and back to JSON
 * When a object is empty, it php converts it to a associative array that is empty,
 * when converting it back to json it comes a empty array.
 *
 * Other than that _o has no use to this application
 * If .net does not have this issue we can skip this.
 */
export interface GraphFilterOptions {
    filters?: {
        // filters ? later on please
        OnDate?: string,
        FromDate?: any,
        ToDate?: any,
        _o?: any,
    },
    view?: string,
    viewOptions?: {
        table?: {
            _o?: any,
        },
        line?: {
            legend?: string,
            lines: GraphViewLine[],
            groupBy?: string,
            _o?: any,
        },
        bar?: {
            legend?: string,
            x?: string,
            y?: string,
            lines: GraphViewLine[],
            groupBy?: string,
            _o?: any,
        },
        column?: {
            legend?: string,
            x?: string,
            y?: string,
            lines: GraphViewLine[],
            groupBy?: string,
            _o?: any,
        },
        pie?: {
            legend?: string,
            value?: string,
            valueAggregator?: string,
            _o?: any,
        },
        donut?: {
            legend?: string,
            value?: string,
            valueAggregator?: string,
            _o?: any,
        },
        count?: {
            col?: string,
            method?: string,
            decimals?: any,
            format?: any,
            _o?: any,
        }
    }
}

export interface GraphViewLine {
    line: string,
    aggregator: string,
}