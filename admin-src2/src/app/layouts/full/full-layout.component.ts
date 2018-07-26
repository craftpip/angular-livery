import {Component, OnInit} from '@angular/core';
import {AppEvents} from "../../shared/helper.service";


@Component({
    selector: 'app-full-layout',
    templateUrl: './full-layout.component.html',
    styleUrls: ['./full-layout.component.scss']
})

export class FullLayoutComponent {

    yo: string = 'help';

    constructor(
        public events: AppEvents,
    ) {
        let id = this.events.on('hey', (data) => {
            alert(JSON.stringify(data));
        });

        this.events.off(id);

        this.events.on('hey', (data) => {
            alert('Wot' + JSON.stringify(data));
        });
    }
}