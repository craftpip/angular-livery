import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {MatchHeightModule} from "../shared/directives/match-height.directive";

import {HomeComponent} from "./home.component";
import {HomeRoutingModule} from "./home-routing.module";


@NgModule({
    imports: [
        CommonModule,
        HomeRoutingModule,
        MatchHeightModule
    ],
    exports: [],
    declarations: [HomeComponent],
    providers: [],
})
export class HomeModule {
}
