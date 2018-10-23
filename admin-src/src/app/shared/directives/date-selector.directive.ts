import {Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

import * as screenfull from 'screenfull';
import {endOfDay, startOfDay, startOfMonth, startOfWeek, subDays} from "date-fns";

@Directive({
    selector: '[dateRangeSelect]'
})
export class DateRangeSelectorDirective implements OnInit {
    value: string;
    range: any;

    /**
     * Not planned
     */
    @Input()
    fromDate;

    @Output('dateRangeChanged')
    dateRangeChanged: EventEmitter<any> = new EventEmitter<any>();

    constructor(public el: ElementRef) {
    }

    ngOnInit() {
        this.convertToRange();
    }

    convertToRange() {
        this.value = this.el.nativeElement.value;
        let today = new Date();
        let from;
        let to;
        switch (this.value) {
            case 'day':
                from = startOfDay(today);
                to = endOfDay(today);
                break;
            case 'week':
                from = startOfWeek(today);
                to = endOfDay(today);
                break;
            case 'month':
                from = startOfMonth(today);
                to = endOfDay(today);
                break;
            case '30days':
                from = subDays(today, 30);
                to = endOfDay(today);
                break;
            case '7days':
                from = subDays(today, 7);
                to = endOfDay(today);
                break;
            default:
                console.warn('dateRangeSelect: Invalid value' + this.value);
                break;
        }

        this.range = {
            'to': to,
            'from': from,
        };

        this.dateRangeChanged.emit(this.range);
    }

    @HostListener('change') onChange() {
        this.convertToRange();
    }
}
