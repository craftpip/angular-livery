import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatchHeightModule} from "../shared/directives/match-height.directive";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UsersRoutingModule} from './users-routing.module';
import {UsersComponent} from './users.component';
import {UsersAddComponent} from './users-add/users-add.component';
import {AgGridModule} from "ag-grid-angular";
import {TagInputModule} from "ngx-chips";
import {FlatpickrModule} from "angularx-flatpickr";
import {CardCollapseDirective} from "../shared/directives/card-collapse.directive";
import {QuickPanelModule} from "../shared/directives/quick-panel.directive";
import {SharedModule} from "../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        UsersRoutingModule,
        MatchHeightModule,
        NgbModule,
        FormsModule, ReactiveFormsModule,
        AgGridModule.withComponents([]),
        TagInputModule,
        FlatpickrModule.forRoot(),
        QuickPanelModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        UsersComponent,
        UsersAddComponent,
    ],
    providers: [],
})
export class UsersModule {
}
