import {Component, OnInit} from '@angular/core';
import {AppEvents} from "../../shared/helper.service";


@Component({
    selector: 'app-full-layout',
    templateUrl: './full-layout.component.html',
    styleUrls: ['./full-layout.component.scss']
})

export class FullLayoutComponent {
    constructor(
        public events: AppEvents,
    ) {

    }
}