import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpHelper, TourOptions, TourService, TourSteps, Utils} from "../../shared/helper.service";
import * as moment from "moment";
import {AgGridNg2} from "ag-grid-angular";
import {JConfirm} from "../../shared/jconfirm";
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';
import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent
} from 'angular-calendar';
import {Subject} from "rxjs/internal/Subject";

@Component({
    selector: 'app-demo-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

    colors: any = {
        red: {
            primary: '#ad2121',
            secondary: '#FAE3E3'
        },
        blue: {
            primary: '#1e90ff',
            secondary: '#D1E8FF'
        },
        yellow: {
            primary: '#e3bc08',
            secondary: '#FDF1BA'
        }
    };

    constructor(public httpHelper: HttpHelper,
                public jconfirm: JConfirm,
                public tourService: TourService,
                public utils: Utils,
                public route: ActivatedRoute) {
        this.route.params.subscribe((data: any) => {

        });

    }

    notification() {
        this.utils.notification({
            text: 'em Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the ind',
            layout: this.utils.notificationLayouts.bottomRight,
            type: this.utils.notificationType.info,
        });
    }

    ngOnInit() {
        let tourOptions: TourOptions = {
            steps: [
                {
                    content: 'test',
                    element: '#step1',
                    title: 'hello',
                },
                {
                    content: 'test2',
                    element: '#step2',
                    title: 'hello wow',
                }
            ]
        };

        console.log(tourOptions);
        let tour = this.tourService.create(tourOptions);
        console.log(tour);
        tour.init();
        tour.start();
        console.log(tour);
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = {event, action};
        // this.modal.open(this.modalContent, {size: 'lg'});
    }

    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                this.handleEvent('Deleted', event);
            }
        }
    ];

    dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    activeDayIsOpen: boolean = true;
    refresh: Subject<any> = new Subject();

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    view: string = 'month';

    eventTimesChanged({
                          event,
                          newStart,
                          newEnd
                      }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    }


    viewDate: Date = new Date();

    events: CalendarEvent[] = [
        {
            start: subDays(startOfDay(new Date()), 1),
            end: addDays(new Date(), 1),
            title: 'A 3 day event',
            color: this.colors.red,
            actions: this.actions
        },
        {
            start: startOfDay(new Date()),
            title: 'An event with no end date',
            color: this.colors.yellow,
            actions: this.actions
        },
        {
            start: subDays(endOfMonth(new Date()), 3),
            end: addDays(endOfMonth(new Date()), 3),
            title: 'A long event that spans 2 months',
            color: this.colors.blue
        },
        {
            start: addHours(startOfDay(new Date()), 2),
            end: new Date(),
            title: 'A draggable and resizable event',
            color: this.colors.yellow,
            actions: this.actions,
            resizable: {
                beforeStart: true,
                afterEnd: true
            },
            draggable: true
        }
    ];

}