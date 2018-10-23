import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatchHeightModule} from "../shared/directives/match-height.directive";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TagInputModule} from "ngx-chips";
import {FlatpickrModule} from "angularx-flatpickr";
import {QuickPanelModule} from "../shared/directives/quick-panel.directive";
import {SharedModule} from "../shared/shared.module";
import {LanguageRoutingModule} from "./language-routing.module";
import {LanguageComponent} from "./language.component";

@NgModule({
    imports: [
        CommonModule,
        LanguageRoutingModule,
        MatchHeightModule,
        NgbModule,
        FormsModule, ReactiveFormsModule,
        TagInputModule,
        FlatpickrModule.forRoot(),
        QuickPanelModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        LanguageComponent,
    ],
    providers: [],
})
export class LanguageModule {
}
