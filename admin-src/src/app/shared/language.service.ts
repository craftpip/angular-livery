import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {Utils} from "./helper.service";

declare const $: any;

@Injectable()
export class LanguageService {
    langPack: any = [];
    mapLangPack: any = {};
    langName: string = 'en';

    constructor(public utils: Utils) {
        let language = this.utils.storage.get('language', false);
        if (language) {
            this.mapLangPack = language.map;
            this.langPack = language.pack;
            this.langName = language.lang;
        }
        this.setRtl();
    }

    setRtl() {
        let rtl = this.langName == 'ar';
        if (rtl) {
            $('body').addClass('rtl');
        } else {
            $('body').removeClass('rtl');
        }
    }

    /**
     * Set the language pack and language code
     *
     * @param languagePack
     * @param lang
     */
    setLangPack(languagePack, lang: string) {
        this.langPack = languagePack;
        this.mapLangPack = this.parseKeyValueMap(this.langPack);
        this.langName = lang;
        this.utils.storage.set('language', {
            map: this.mapLangPack,
            pack: this.langPack,
            lang: lang,
        });
        this.setRtl();
    }

    /**
     * Parse the array to key value map
     *
     * @param lang
     */
    parseKeyValueMap(lang) {
        let a = {};
        for (let b of lang) {
            a[b.key] = b.value;
        }
        return a;
    }

    /**
     * Get the key from the language pack.
     *
     * @param key
     * @param defaultValue
     */
    key(key, defaultValue?) {
        return this.mapLangPack[key] || (defaultValue || key);
    }
}


@Pipe({name: 'lang'})
export class LanguagePipe implements PipeTransform {
    constructor(private languageService: LanguageService) {

    }

    transform(value, defaultValue?) {
        let a = this.languageService.key(value, defaultValue);
        console.log('lang', value, a);
        return a;
    }
}