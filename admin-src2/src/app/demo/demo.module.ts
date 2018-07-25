import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {MatchHeightModule} from "../shared/directives/match-height.directive";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {AgGridModule} from "ag-grid-angular";
import {TagInputModule} from "ngx-chips";
import {DemoRoutingModule} from "./demo-routing.module";
import {CalendarComponent} from "./calendar/calendar.component";
import {CalendarModule} from "angular-calendar";
import {List1Component} from "./list1/list1.component";
import {FlatpickrModule} from "angularx-flatpickr";

@NgModule({
    imports: [
        CommonModule,
        DemoRoutingModule,
        MatchHeightModule,
        NgbModule,
        FormsModule,
        AgGridModule.withComponents([]),
        TagInputModule,
        CalendarModule.forRoot(),
        FlatpickrModule.forRoot()
    ],
    exports: [],
    declarations: [
        CalendarComponent,
        List1Component,
    ],
    providers: [],
})
export class DemoModule {
}
