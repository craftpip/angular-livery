import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {MatchHeightModule} from "../shared/directives/match-height.directive";
import {LoginRoutingModule} from "./login-routing.module";
import {LoginComponent} from "./login.component";


@NgModule({
    imports: [
        CommonModule,
        LoginRoutingModule,
        MatchHeightModule
    ],
    exports: [],
    declarations: [LoginComponent],
    providers: [],
})
export class LoginModule {
}
