import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {MatchHeightModule} from "../shared/directives/match-height.directive";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AgGridModule} from "ag-grid-angular";
import {TagInputModule} from "ngx-chips";
import {DemoRoutingModule} from "./demo-routing.module";
import {CalendarComponent} from "./calendar/calendar.component";
import {CalendarModule} from "angular-calendar";
import {List1Component} from "./list1/list1.component";
import {FlatpickrModule} from "angularx-flatpickr";
import {TabsComponent} from "./tabs/tabs.component";
import {SharedModule} from "../shared/shared.module";
import {AutoCompleteModule, CalendarModule as CM} from "primeng/primeng";

@NgModule({
    imports: [
        CommonModule,
        DemoRoutingModule,
        MatchHeightModule,
        NgbModule,
        FormsModule,
        AgGridModule.withComponents([]),
        TagInputModule,
        ReactiveFormsModule,
        CalendarModule.forRoot(),
        FlatpickrModule.forRoot(),
        SharedModule,
        CM,
        AutoCompleteModule,
    ],
    exports: [],
    declarations: [
        CalendarComponent,
        List1Component,
        TabsComponent,
    ],
    providers: [],
})
export class DemoModule {
}
