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

@NgModule({
    imports: [
        CommonModule,
        DemoRoutingModule,
        MatchHeightModule,
        NgbModule,
        FormsModule,
        AgGridModule.withComponents([]),
        TagInputModule,
        CalendarModule.forRoot()
    ],
    exports: [],
    declarations: [
        CalendarComponent
    ],
    providers: [],
})
export class DemoModule {
}
