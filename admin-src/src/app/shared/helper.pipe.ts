import {Pipe, PipeTransform} from "@angular/core";
import * as moment from "moment";
import {DomSanitizer} from "@angular/platform-browser";

/**
 * Date formatter,
 * from unix to calendar direct!
 */
@Pipe({name: 'dateFormat'})
export class DateFormatPipe implements PipeTransform {
    transform(date) {
        return moment.unix(date).calendar();
    }
}

@Pipe({name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) {
    }

    transform(value) {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}