import {HttpHelper, Utils} from "../shared/helper.service";
import {JConfirm} from "../shared/jconfirm";
import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";

@Component({
    selector: 'app-language',
    templateUrl: './language.component.html',
    styleUrls: ['./language.component.scss']
})

export class LanguageComponent implements OnInit {

    constructor(public httpHelper: HttpHelper,
                public jconfirm: JConfirm,
                public utils: Utils,
                public router: Router,
                public route: ActivatedRoute) {

        this.route.params.subscribe((data: any) => {
            // parameters come here
        });

    }

    loading: boolean = false;
    languages: any[] = [];

    modalOpen: boolean = false;
    new: any = {lang: 'en'};

    create() {
        this.modalOpen = true;

    }

    filteredLanguages: any[] = [];
    filterTerm: string = '';

    filterLang() {
        if (this.filterTerm) {
            let filtered = this.languages.filter((a) => {
                return JSON.stringify(a).toLowerCase().indexOf(this.filterTerm.toLowerCase()) != -1;
            })
            this.filteredLanguages = filtered;
        } else {
            this.filteredLanguages = this.languages;
        }
    }

    saveChanges(l) {
        // this.utils.infoNotification('Saving changes');
        this.httpHelper.post('sec/lang/save', {
            lang: l
        }).subscribe((response: any) => {
            if (response.status) {
                this.utils.successNotification('Changes saved successfully');
            } else {
                this.utils.errorNotification(response.reason);
            }
        }, err => {
            this.utils.errorNotification();
        })
    }

    load() {
        this.loading = true;
        this.httpHelper.post('sec/lang/list').subscribe((response: any) => {
            this.loading = false;
            if (response.status) {
                this.languages = response.data.list;
                this.filterLang();
            } else {
                this.utils.errorNotification(response.reason);
            }
        }, err => {
            this.loading = false;
            this.utils.errorNotification();
        });
    }

    saving: boolean = false;

    save() {
        this.saving = true;
        this.httpHelper.post('sec/lang/save', {
            lang: this.new,
        }).subscribe((response: any) => {
            this.saving = false;
            if (response.status) {
                // this.modalOpen = false;
                let newLang = response.data.lang;
                // if (this.new.lang_id) {
                //     let findLang = this.languages.filter((a) => {
                //         return a.lang_id == this.new.lang_id;
                //     });
                //     findLang[0].key = newLang.key;
                //     findLang[0].value = newLang.value;
                //     findLang[0].lang = newLang.lang;
                // } else {
                //     this.languages.push(newLang);
                // }
                this.load();
                this.new = {
                    lang: this.new.lang,
                    key: this.new.key,
                };
                this.utils.successNotification('Successfully saved language');
            } else {
                this.utils.errorNotification(response.reason);
            }
        }, err => {
            this.saving = false;
            this.utils.errorNotification();
        })
    }

    deleteLanguage(l) {
        this.utils.infoNotification('Please wait, deleting lang');
        this.httpHelper.post('sec/lang/remove', {
            lang: l
        }).subscribe((response: any) => {
            if (response.status) {
                this.utils.successNotification('Successfully deleted lang key');
                this.load();
            } else {
                this.utils.errorNotification(response.reason);
            }
        }, err => {
            this.utils.errorNotification();
        })
    }

    ngOnInit() {
        this.load();
    }

}
