import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatchHeightModule} from "../shared/directives/match-height.directive";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {UsersRoutingModule} from './users-routing.module';
import {UsersComponent} from './users.component';
import {UsersAddComponent} from './users-add/users-add.component';
import {AgGridModule} from "ag-grid-angular";
import {TagInputModule} from "ngx-chips";
import {FlatpickrModule} from "angularx-flatpickr";
import {CardCollapseDirective} from "../shared/directives/card-collapse.directive";
import {QuickPanelModule} from "../shared/directives/quick-panel.directive";

@NgModule({
    imports: [
        CommonModule,
        UsersRoutingModule,
        MatchHeightModule,
        NgbModule,
        FormsModule,
        AgGridModule.withComponents([]),
        TagInputModule,
        FlatpickrModule.forRoot(),
        QuickPanelModule,
    ],
    exports: [],
    declarations: [
        UsersComponent,
        UsersAddComponent,
        CardCollapseDirective,
    ],
    providers: [],
})
export class UsersModule {
}
